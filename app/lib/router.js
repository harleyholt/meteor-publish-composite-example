Router.route('/', {
  name: 'home',
  waitOn: function() {
    return [Meteor.subscribe('players')];
  },
  data: function() {
    return {
      players: Players.find()
    };
  },
  template: 'home'
});

Router.route('/player/:playerId', {
  name: 'player',
  waitOn: function() {
    return [Meteor.subscribe('players', this.params.playerId)];
  },
  data: function() {
    return Players.findOne({_id: this.params.playerId});
  }
});
