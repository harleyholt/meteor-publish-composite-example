Meteor.startup(function(){

  if (!Materials.find().count()) {
    const materials = [
      {name: 'Aluminum', cost: 50},
      {name: 'Iron', cost: 30},
      {name: 'Wood', cost: 10},
      {name: 'Plastic', cost: 10},
      {name: 'Magic', cost: 100},
      {name: 'Ballistic Fiber', cost: 120},
    ];
    materials.forEach((m) => { Materials.insert(m); });
  }

  const aluminum = Materials.find({name: 'Aluminum'});
  const iron = Materials.find({name: 'Iron'});
  const wood = Materials.find({name: 'Wood'});
  const plastic = Materials.find({name: 'Plastic'});
  const magic = Materials.find({name: 'Magic'});
  const ballisticFiber = Materials.find({name: 'Ballistic Fiber'});

  if (!Weapons.find().count()) {
    const weapons = [
      {name: 'Broom', damage: 3, weight: 6, materials: [wood._id]},
      {name: 'Castiron Skillet', damage: 8, weight: 12, materials: [iron._id]},
      {name: 'Bucket', damage: 1, weight: 3, materials: [aluminum._id, magic._id]}
    ];
    weapons.forEach((w) => { Weapons.insert(w); });
  }

  if (!Armors.find().count()) {
    const armor = [
      {name: 'Pasta Strainer', defense: 2, weight: 2, materials: [aluminum._id, magic._id]},
      {name: 'Bulletproof Vest', defense: 20, weight: 8, materials: [ballisticFiber._id]},
      {name: 'Shin Guards', defense: 1, weight: 1, materials: [plastic._id]}
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
