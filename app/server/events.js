
Meteor.startup(function(){

  const StatsD = Meteor.npmRequire('node-statsd');
  const statsd = new StatsD({port: 48125, prefix: 'mpc.', cacheDns: true});
  Meteor.events.on('subscriptionStarted', function() {
    console.log('subscription started', arguments);
  });
  console.log('listening for events');

});
