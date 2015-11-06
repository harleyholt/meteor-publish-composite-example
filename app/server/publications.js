
Meteor.publishComposite('players', function() {
  return {
    find: function() {
      return Players.find({});
    },
    children: [
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
});

Meteor.publishComposite('playerData', function(playerId) {
  return {
    find: function() {
      return Players.find({_id: playerId});
    },
    children: [
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
});
