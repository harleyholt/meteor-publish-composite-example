
/**
 * This starts a process of collecting and reporting our process metrics to the statsd server.
 */
Meteor.startup(function(){
  const appmetrics = Meteor.npmRequire('appmetrics');
  const StatsD = Meteor.npmRequire('node-statsd');

  const statsd = new StatsD({port: 48125, prefix: 'mpc.', cacheDns: true});
  const monitor = appmetrics.monitor();

  monitor.on('cpu', function(cpu) {
    // Percentage of CPU used by the process.
    // This is reported as percentage of the total CPU power of the system; the process may
    // be using 100% of the core it is running on, but will only show some percent of the total
    statsd.gauge('server.cpu.process', cpu.process);
  });

  monitor.on('memory', function(memory) {
    // Bytes of memory assigned to the process that are not shared with other processes.
    statsd.gauge('server.memory.private', memory.private);
  });

  monitor.on('gc', function(gc) {
    // Size of the process heap in bytes
    statsd.gauge('gc.used', gc.used);
  });

  monitor.on('mongo', function(mongo) {
    // A mongo query was issued
    // TODO: This is not working. First thought is that meteor is not using the same mongo
    // library that app metrics is hooking into. Investigate.
    statsd.increment('mongo.query');
  });
});
