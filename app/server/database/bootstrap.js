Meteor.startup(function(){

  if (!Weapons.find().count()) {
    const weapons = [
      {name: 'Broom', damage: 3, weight: 6},
      {name: 'Castiron Skillet', damage: 8, weight: 12},
      {name: 'Bucket', damage: 1, weight: 3}
    ];
    weapons.forEach((w) => { Weapons.insert(w); });
  }

  if (!Armors.find().count()) {
    const armor = [
      {name: 'Pasta Strainer', defense: 2, weight: 2},
      {name: 'Bulletproof Vest', defense: 20, weight: 8},
      {name: 'Shin Guards', defense: 1, weight: 1}
    ];
    armor.forEach((a) => { Armors.insert(a); });
  }

  if (!Players.find().count()) {

    const broom = Weapons.findOne({name: 'Broom'});
    const bucket = Weapons.findOne({name: 'Bucket'});
    const skillet = Weapons.findOne({name: 'Castiron Skillet'});

    const strainer = Armors.findOne({name: 'Pasta Strainer'});
    const vest = Armors.findOne({name: 'Bulletproof Vest'});
    const shinGuards = Armors.findOne({name: 'Shin Guards'});

    const players = [
      {name: 'Brock', weapons: [broom._id, bucket._id], armors: [strainer._id], health: 100},
      {name: 'Lily', weapons: [skillet._id], armors: [shinGuards._id, vest._id], health: 62},
      {name: 'Ike', weapons: [], armors: [], health: 88}
    ];
    players.forEach((p) => { Players.insert(p); });
  }

});
