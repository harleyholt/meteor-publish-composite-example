/* global Players:true */
Players = new Mongo.Collection('players');

Meteor.methods({
  'player/new': function(name) {
    return Players.insert({name, weapons: [], armors: [], health: 100});
  },
  'player/equip': function(id, weapon) {
    return Players.update({_id: id}, {$push: {weapons: weapon}});
  },
  'player/unequip': function(id, weapon) {
    return Players.update({_id: id}, {$pull: {weapons: weapon}});
  },
  'player/wear': function(id, armor) {
    return Players.update({_id: id}, {$push: {armors: armor}});
  },
  'player/remove': function(id, armor) {
    return Players.update({_id: id}, {$pull: {armors: armor}});
  }
});
