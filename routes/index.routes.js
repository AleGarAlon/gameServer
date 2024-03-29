const Enemy = require("../models/Enemy.model");
const Character = require("../models/Character.model");
const Item = require("../models/Item.model");
const Consumable = require("../models/Consumable.model");
const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const {
  lvlUp,
  unequipItem,
  equipItem,
  useConsumable,
} = require("../controller/player");
const { exploreCombat, searchEnemies } = require("../controller/combat");
const {
  randomConsumables,
  randomItems,
  sellConsumable,
  buyConsumable,
  sellItem,
  buyItem,
  sellAll,
  buyConsumableX5,
} = require("../controller/merchant");

router.get("/explore/zone", async (req, res) => {
  const location = req.query.location;
  try {
    const locationEnemies = await searchEnemies(location);
    res.status(200).json(locationEnemies);
  } catch (error) {
    console.log(error);
  }
});

//This route handle the combat petition in the "enemy card"
router.get("/explore/combat", async (req, res) => {
  const characterId = req.query.id;
  const enemyId = req.query.enemyId;
  try {
    const exploreCombatResult = await exploreCombat(characterId, enemyId);
    res.status(200).json(exploreCombatResult);
  } catch (error) {
    console.log("Your error in combat is", error);
    res.status(500).json({ error: "An error occurred in combat." });
  }
});
//This route get and ungeared character to show the base stats in the "train screen"
router.get("/character/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const character = await Character.findById(id);
    res.status(200).json(character);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something goes wrong");
  }
});
//This route handle the lvl up in the "train screen"
router.patch("/character/:id", async (req, res) => {
  const characterID = req.params.id;
  const { updatedAttribute } = req.body;
  try {
    const sendCharacter = await lvlUp(characterID, updatedAttribute);
    res.status(200).json(sendCharacter);
  } catch (error) {
    console.log(error);
    res.status(500).json("something goes wrong in the character PATCH");
  }
});
// This route handle the equip of an item in the "character screen"
router.get("/equip", async (req, res) => {
  const characterId = req.query.characterId;
  const itemId = req.query.itemId;
  try {
    equipedItemCharacter = await equipItem(characterId, itemId);
    res.status(200).json(equipedItemCharacter);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something goes wrong in the equip GET route");
  }
});
// This route handle the unequip of an item in the "character screen"
router.get("/unequip", async (req, res) => {
  const characterId = req.query.characterId;
  const itemId = req.query.itemId;
  try {
    unequipedItemCharacter = await unequipItem(characterId, itemId);
    res.status(200).json(unequipedItemCharacter);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something goes wrong in the unequip GET route");
  }
});
//this route handle the use of a consumable in the character screen.
router.get("/useConsumable", async (req, res) => {
  const characterId = req.query.characterId;
  const consumableId = req.query.consumableId;
  try {
    useConsumableCharacter = await useConsumable(characterId, consumableId);
    res.status(200).json(useConsumableCharacter);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something goes wrong in the useConsumable GET route");
  }
});
//This route handle the random shop consumables in the "shop screen"
router.get("/shop", async (req, res) => {
  try {
    const consumables = await randomConsumables();
    res.status(200).json(consumables);
  } catch (error) {
    console.log(error);
    res.status(500).json("something goes wrong in the consumables GET");
  }
});
//This route handle the consumable BUY in the shop screen
router.get("/shop/buy", async (req, res) => {
  const characterId = req.query.characterId;
  const consumableId = req.query.consumableId;
  try {
    const buyConsumableCharacter = await buyConsumable(
      characterId,
      consumableId
    );
    res.status(200).json(buyConsumableCharacter);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something goes wrong in the shop/buy GET route");
  }
});
router.get("/shop/buyX5", async (req, res) => {
  const characterId = req.query.characterId;
  const consumableId = req.query.consumableId;
  try {
    const buyConsumableCharacter = await buyConsumableX5(
      characterId,
      consumableId
    );
    res.status(200).json(buyConsumableCharacter);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something goes wrong in the shop/buy GET route");
  }
});
//This route handle the consumable SELL in the shop screen
router.get("/shop/sell", async (req, res) => {
  const characterId = req.query.characterId;
  const consumableId = req.query.consumableId;
  try {
    const sellConsumableCharacter = await sellConsumable(
      characterId,
      consumableId
    );
    res.status(200).json(sellConsumableCharacter);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something goes wrong in the shop/buy GET route");
  }
});

//This route handle the random armory imtes in the "armory screen"
router.get("/armory", async (req, res) => {
  try {
    const items = await randomItems();
    console.log("YOUR FINAL ITEMS BEFORE SEND TO FRONT", items);
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something goes wrong in the armory GET route");
  }
});
//This route handle the consumable BUY in the armory screen
router.get("/armory/buy", async (req, res) => {
  const characterId = req.query.characterId;
  const itemId = req.query.itemId;
  try {
    const buyItemCharacter = await buyItem(characterId, itemId);
    res.status(200).json(buyItemCharacter);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something goes wrong in the armory/buy GET route");
  }
});
//This route handle the item SELL in the armory screen
router.get("/armory/sell", async (req, res) => {
  const characterId = req.query.characterId;
  const itemId = req.query.itemId;
  try {
    const sellItemCharacter = await sellItem(characterId, itemId);
    res.status(200).json(sellItemCharacter);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something goes wrong in the armory/buy GET route");
  }
});
//This route handle the SELL all items in the armory screen
router.get("/armory/sellAll", async (req, res) => {
  const characterId = req.query.characterId;
  try {
    const sellAllItems = await sellAll(characterId);
    res.status(200).json(sellAllItems);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something goes wrong in the armory/buy GET route");
  }
});

module.exports = router;
