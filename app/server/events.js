
Meteor.startup(function(){

  const StatsD = Meteor.npmRequire('node-statsd');
  const statsd = new StatsD({port: 48125, prefix: 'mpc.', cacheDns: true});

  Meteor.instrumentation.on('subscriptionStarted', function() {
    statsd.increment('server.subscriptions');
  });
  Meteor.instrumentation.on('subscriptionStopped', function() {
    statsd.decrement('server.subscriptions');
  });

  Meteor.instrumentation.on('sessionOpened', function() {
    statsd.increment('server.sessions');
  });
  Meteor.instrumentation.on('sessionClosed', function() {
    statsd.decrement('server.sessions');
  });
  Meteor.instrumentation.on('sessionSend', function() {
    statsd.increment('server.sessions.messages');
  });

  console.log('Application server is listening for internal meteor events');
});
