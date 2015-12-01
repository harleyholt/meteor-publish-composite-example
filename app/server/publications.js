
const children = {
  players:  [
    {
      // Weapons
      find: function(player) {
        return Weapons.find({_id: {$in: player.weapons}});
      }
    },
    {
      // Armors
      find: function(player) {
        return Armors.find({_id: {$in: player.armors}});
      }
    }
  ]
};

Meteor.publishComposite('players', function(playerId) {
  return {
    find: function() {
      const filter = {};
      if (playerId !== undefined) {
        filter._id = playerId;
      }
      return Players.find(filter);
    },
    children: children.players
  };
});
