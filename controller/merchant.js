const Item = require("../models/Item.model");
const Consumable = require("../models/Consumable.model");
const Character = require("../models/Character.model");
const { gearSum } = require("./player");

//randomize and array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

//pick 4 random consumables from the DB for the shop
const randomConsumables = async () => {
  let consumables = await Consumable.find({ rarity: "common" });
  consumables = shuffleArray(consumables);
  let shopConsumables = consumables.slice(0, 4);
  return shopConsumables;
};
//buy a consumable from the shop
const buyConsumable = async (characterId, consumableId) => {
  try {
    const character = await Character.findById(characterId);
    const buyedConsumable = await Consumable.findById(consumableId);
    const goldCost = buyedConsumable.price;
    character.gold -= goldCost;
    character.consumables.push(buyedConsumable);
    await Character.findByIdAndUpdate(characterId, character);
    const gearedCharacter = await gearSum(character._id);
    return gearedCharacter;
  } catch (error) {
    console.log(error);
  }
};
//buy a consumable x5 from the shop
const buyConsumableX5 = async (characterId, consumableId) => {
  try {
    const character = await Character.findById(characterId);
    const buyedConsumable = await Consumable.findById(consumableId);
    const goldCost = buyedConsumable.price;
    character.gold -= goldCost * 5;
    character.consumables.push(buyedConsumable);
    character.consumables.push(buyedConsumable);
    character.consumables.push(buyedConsumable);
    character.consumables.push(buyedConsumable);
    character.consumables.push(buyedConsumable);
    await Character.findByIdAndUpdate(characterId, character);
    const gearedCharacter = await gearSum(character._id);
    return gearedCharacter;
  } catch (error) {
    console.log(error);
  }
};
//sell a consumable from the character inventory in the shop page
const sellConsumable = async (characterId, consumableId) => {
  try {
    const character =
      await Character.findById(characterId).populate("consumables");
    const selledConsumable = character.consumables.find(
      (consumable) => consumable.id === consumableId
    );
    const selledConsumableIndex = character.consumables.findIndex(
      (consumable) => consumable.id === consumableId
    );
    const goldRecived = Math.round(selledConsumable.price / 4);
    character.gold += goldRecived;
    character.consumables.splice(selledConsumableIndex, 1);
    await Character.findByIdAndUpdate(characterId, character);
    const gearedCharacter = await gearSum(character._id);
    return gearedCharacter;
  } catch (error) {
    console.log(error);
  }
};
//get 4 random items from the database
const randomItems = async () => {
  let items = await Item.find({ rarity: "common" });
  items = shuffleArray(items);
  let shopItems = items.slice(0, 4);
  return shopItems;
};
//buy an item in the blacksmith page
const buyItem = async (characterId, itemId) => {
  try {
    const character = await Character.findById(characterId);
    const buyedItem = await Item.findById(itemId);
    const goldCost = buyedItem.price;
    character.gold -= goldCost;
    character.inventory.push(buyedItem);
    await Character.findByIdAndUpdate(characterId, character);
    const gearedCharacter = await gearSum(character._id);
    return gearedCharacter;
  } catch (error) {
    console.log(error);
  }
};
//sell an item from the character inventory in the blacksmith page
const sellItem = async (characterId, itemId) => {
  try {
    const character =
      await Character.findById(characterId).populate("inventory");
    const selledItem = character.inventory.find((item) => item.id === itemId);
    const selledItemIndex = character.inventory.findIndex(
      (item) => item.id === itemId
    );
    const goldRecived = Math.round(selledItem.price / 4);
    character.gold += goldRecived;
    character.inventory.splice(selledItemIndex, 1);
    await Character.findByIdAndUpdate(characterId, character);
    const gearedCharacter = await gearSum(character._id);
    return gearedCharacter;
  } catch (error) {
    console.log(error);
  }
};
//sell all the items from the character invantory in the blacksmith page
const sellAll = async (characterId) => {
  try {
    const character =
      await Character.findById(characterId).populate("inventory");
    character.inventory.forEach((item) => {
      character.gold += Math.round(item.price / 4);
    });
    character.inventory = [];
    await Character.findByIdAndUpdate(characterId, character);
    const gearedCharacter = await gearSum(character._id);
    return gearedCharacter;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  randomConsumables,
  randomItems,
  buyConsumable,
  sellConsumable,
  buyItem,
  sellItem,
  sellAll,
  buyConsumableX5,
};
