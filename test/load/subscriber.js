import DDPClient from 'ddp';
import Promise from 'bluebird';
import StatsD from 'node-statsd';
import uuid from 'node-uuid';

const statsd = new StatsD({port: 48125, prefix: 'mpc.', cacheDns: true});
statsd.socket.on('error', function(error) {
  console.log('statsd error', error);
  process.exit(1);
});

/**
 * This a client to our app which subscibes to collections.
 */
class AppSubscriber {

  constructor(ddpClient) {
    this._ddp = ddpClient;
    this.connected = false;
  }

  connect() {
    console.info('Connecting...');
    return Promise.promisify(this._ddp.connect, {context: this._ddp})().then((wasReconnect) => {
      console.info('Connected');
      this.connected = true;
    }).error((err) => {
      console.error('Could not connect to DDP server');
      throw err;
    });
  }

  /**
  * Connect to the DDP server only if we're not connected. Otherwise return a resolved promise.
  * Any functions which require a connection should call this before performing other operations.
  * @return {Promise} Resolves when the client is connected
  */
  _connect() {
    if (this.connected) {
      return Promise.resolve();
    } else {
      return this.connect();
    }
  }

  subscribe(cb) {
    console.info('Subscribing');
    this._connect().then(() => {
      return this._ddp.subscribe('players', [], cb);
    });
  }

  unsubscribe(id) {
    console.info('Unsubscribing');
    this._connect().then(() => {
      console.info('Unsubscribed from players');
      return Promise.promisify(this._ddp.unsubscribe, {context: this._ddp})(id);
    });
  }
}

if (require.main === module) {
  const host = 'localhost';
  const port = 3000;
  const ddpClient = new DDPClient({host, port});
  const clients = [];

  const subscriberId = uuid.v4();

  // Heartbeat to statsd for counting the number of active subscribers
  // Every second
  setInterval(function() {
    statsd.unique('subscribers', subscriberId);
  }, 1000);

  const another = function() {
    const client = new AppSubscriber(ddpClient);
    const onSubscribed = function() {
      console.info('Subscribed to players');
      console.info('Observing changes');
      const observer = client._ddp.observe('players');
      observer.added = function(id, doc) {
        console.log(`New player seen with id ${id}`);
      };
    };
    client.connect()
    .then(function() {
      const t0 = new Date();
      return client.subscribe(function() {
        statsd.timing('subscriptions.players.ready_time', new Date() - t0);
        console.info(`Subscribed in ${new Date() - t0}ms`);
        onSubscribed();
      });
    })
    .error(function(err) {
      console.error('The subscriber failed with an error');
      console.error(err);
      process.exit(1);
    });
    return client;
  };

  process.on('SIGINT', function() {
    console.info('Shutting down');
    try {
      for (var i = 0; i < clients.length; i++) {
        client._ddp.close();
      }
    } catch (e) {
      console.info('Error closing connections; just exit');
    } finally {
      console.info('Done. Goodbye.');
      process.exit(0);
    }
  });
  for(var i = 0; i < 10; i++) {
    clients.push(another());
  }
}
