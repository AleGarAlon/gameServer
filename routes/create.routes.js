const router = require("express").Router();
const Enemy = require("../models/Enemy.model");
const Item = require("../models/Item.model");
const Consumable = require("../models/Consumable.model");

router.post("/enemy", async (req, res) => {
  const parsedBody = {
    ...req.body,
    attributes: {
      ...req.body.attributes,
      strength: parseInt(req.body.attributes.strength),
      dexterity: parseInt(req.body.attributes.dexterity),
      agility: parseInt(req.body.attributes.agility),
      constitution: parseInt(req.body.attributes.constitution),
      fate: parseInt(req.body.attributes.fate),
      armor: parseInt(req.body.attributes.armor),
    },
    damage: parseInt(req.body.damage),
    health: parseInt(req.body.health),
    locationNumber: parseInt(req.body.locationNumber),
    gold: parseInt(req.body.gold),
    consumables: [],
    inventory: [],
  };
  console.log(parsedBody);
  try {
    const newEnemy = await Enemy.create(parsedBody);
    res.status(201).json(newEnemy);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
