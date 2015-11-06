
import DDPClient from 'ddp';
import Promise from 'bluebird';
import Chance from 'chance';

const chance = new Chance();
chance.name();

if (require.main === module) {
  const host = 'localhost';
  const port = 3000;
  const client = new DDPClient({host, port});

  let exiting = false;
  let count = 0;

  process.on('SIGINT', function(){
    console.info('Exiting');
    exiting = true;
  });

  const keepWriting = function() {
    client.call('player/new', [chance.name()], function(e, id) {
      if (e) {
        console.error(e);
        process.exit(1);
      }
      console.info(`New player created with id ${id}`);
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
