Meteor.startup(function(){
  const appmetrics = Meteor.npmRequire('appmetrics');
  const monitor = appmetrics.monitor();
  const StatsD = Meteor.npmRequire('node-statsd');
  const statsd = new StatsD({port: 48125, prefix: 'mpc.', cacheDns: true});


  monitor.on('cpu', function(cpu) {
    statsd.gauge('server.cpu.process', cpu.process);
  });
});
