 import DDPClient from 'ddp';
 import Promise from 'bluebird';

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

   subscribe() {
     console.info('Subscribing');
     this._connect().then(() => {
       console.info('Subscribed to players');
       return Promise.promisify(this._ddp.subscribe, {context: this._ddp})('players');
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
   const client = new AppSubscriber(ddpClient);
   client.connect()
    .then(function() {
      return client.subscribe();
    })
    .then(function(subscriptionId) {
      setInterval(() => {
        client.unsubscribe(subscriptionId);
        console.info('Subscriber completing successfully.');
        process.exit(0);
      }, 20*1000);
    })
    .error(function(err) {
      console.error('The subscriber failed with an error');
      console.error(err);
      process.exit(1);
    });
 }
