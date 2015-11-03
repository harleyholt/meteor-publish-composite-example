Template.player.helpers({
  'playerWeapons': function() {
    return Weapons.find({_id: {$in: this.weapons}});
  },
  'playerArmors': function() {
    return Armors.find({_id: {$in: this.armors}});
  }
});
