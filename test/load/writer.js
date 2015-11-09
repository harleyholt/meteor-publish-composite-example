
import DDPClient from 'ddp';
import Promise from 'bluebird';
import Chance from 'chance';
import StatsD from 'node-statsd';
import uuid from 'node-uuid';

const chance = new Chance();
const statsd = new StatsD({port: 48125, prefix: 'mpc.', cacheDns: true});
statsd.socket.on('error', function(error) {
  console.log('statsd error', error);
  process.exit(1);
});

const newPlayer = function(ddp, callback) {
  if (!callback) { callback = function() {}; }
  const t0 = new Date();
  ddp.call('player/new', [chance.name()], function(e, id) {
    statsd.timing('methods.player.new.response_time', new Date() - t0);
    callback(e, id);
  });
};

if (require.main === module) {
  const host = 'localhost';
  const port = 3000;
  const client = new DDPClient({host, port});

  // The heartbeat to statsd which counts the number of writers active at a given time
  // Runs every second
  const writerId = uuid.v4();
  setInterval(function() {
    statsd.unique('writers', writerId);
  }, 1000);

  // Handle Ctrl-C gracefully
  let exiting = false;
  process.on('SIGINT', function(){
    console.info(`Writer shutting down; created ${count} new players`);
    exiting = true;
  });

  // Continuously keep creating new players until Ctrl-C is hit to exit
  let count = 0;
  const keepWriting = function() {
    newPlayer(client, function(error, id) {
      if (error) {
        console.error(error);
        process.exit(1);
      }
      console.info(`New player created with id ${id}`);
      count++;

      if (!exiting) {
        keepWriting();
      } else {
        client.close();
        process.exit(0);
      }
    });
  };

  Promise.promisify(client.connect, {context: client})()
    .then(function() {
      console.info('Connected. Creating new players');
      keepWriting();
    })
    .error(function(e) {
      console.error('Error while running writer');
      console.error(e);
      process.exit(1);
    });
}
