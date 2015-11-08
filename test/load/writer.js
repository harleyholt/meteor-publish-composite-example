
import DDPClient from 'ddp';
import Promise from 'bluebird';
import Chance from 'chance';
import StatsD from 'node-statsd';

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

  let exiting = false;
  let count = 0;

  process.on('SIGINT', function(){
    console.info(`Writer shutting down; created ${count} new players`);
    exiting = true;
  });

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
