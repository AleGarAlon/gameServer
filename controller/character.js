const Enemy = require("../models/Enemy.model");
const Character = require("../models/Character.model");
const Item = require("../models/Item.model");
const Consumable = require("../models/Consumable.model");

const gearSum = async (id) => {
  try {
    const gearedCharacter = await Character.findById(id)
      .populate("gear")
      .populate("inventory")
      .populate("consumables");

    gearedCharacter.gear.map((item) => {
      gearedCharacter.attributes.strength += item.attributes.strength;
      gearedCharacter.attributes.dexterity += item.attributes.dexterity;
      gearedCharacter.attributes.agility += item.attributes.agility;
      gearedCharacter.attributes.constitution += item.attributes.constitution;
      gearedCharacter.attributes.fate += item.attributes.fate;
      gearedCharacter.attributes.armor += item.attributes.armor;
      gearedCharacter.damage += item.damage;
    });

    return gearedCharacter;
  } catch (error) {
    console.log(error);
  }
};
const lvlUp = async (characterID, updatedAttribute) => {
  try {
    let character = await Character.findById(characterID);

    character.gold =
      character.gold - character.attributes[updatedAttribute] * 5;
    character.attributes[updatedAttribute] =
      character.attributes[updatedAttribute] + 1;
    const lvlCharacter = await Character.findByIdAndUpdate(
      characterID,
      character,
      { new: true }
    );

    const gearedLeveledCharacter = await gearSum(characterID);

    return gearedLeveledCharacter;
  } catch (error) {
    console.log(error);
  }
};

const reverseGearSum = async (character) => {
  console.log(character);

  character.gear.map((item) => {
    character.attributes.strength -= item.attributes.strength;
    character.attributes.dexterity -= item.attributes.dexterity;
    character.attributes.agility -= item.attributes.agility;
    character.attributes.constitution -= item.attributes.constitution;
    character.attributes.fate -= item.attributes.fate;
    character.attributes.armor -= item.attributes.armor;
    character.damage -= item.damage;
  });
  const naked = await Character.findByIdAndUpdate(character._id, character);
  return naked;
};

const equipItem = async (characterId, itemId) => {
  const character = await Character.findById(characterId)
    .populate("gear")
    .populate("inventory");

  const equippedItem = character.inventory.find((item) => item.id === itemId);
  const equippedItemIndex = character.inventory.findIndex(
    (item) => item.id === itemId
  );
  const replacedItemIndex = character.gear.findIndex(
    (item) => item.type === equippedItem.type
  );
  if (replacedItemIndex !== -1) {
    const replacedItem = character.gear[replacedItemIndex];
    character.gear[replacedItemIndex] = equippedItem;
    character.inventory.push(replacedItem);
    character.inventory.splice(equippedItemIndex, 1);
  } else {
    character.gear.push(equippedItem);
    character.inventory.splice(equippedItemIndex, 1);
  }
  await Character.findByIdAndUpdate(characterId, character);
  const gearedCharacter = await gearSum(character._id);
  return gearedCharacter;
};

const unequipItem = async (characterId, itemId) => {
  const character = await Character.findById(characterId);
  const itemIndex = character.gear.indexOf(itemId);
  const unequipedItem = character.gear.splice(itemIndex, 1);
  character.inventory.push(unequipedItem);
  await Character.findByIdAndUpdate(characterId, character);
  const gearedCharacter = await gearSum(character._id);
  return gearedCharacter;
};

const useConsumable = async (characterId, consumableId) => {
  const character =
    await Character.findById(characterId).populate("consumables");
  console.log(character.consumables);
  console.log(consumableId);
  const usedConsumable = character.consumables.find(
    (consumable) => consumable.id === consumableId
  );
  const usedConsumableIndex = character.consumables.findIndex(
    (consumable) => consumable.id === consumableId
  );
  console.log(usedConsumable);
  if (usedConsumable.effect === "heal") {
    character.health += usedConsumable.amount;
    if (character.health > 100) {
      character.health = 100;
    }
  } else {
    character.attributes[usedConsumable.effect] += usedConsumable.amount;
  }
  character.consumables.splice(usedConsumableIndex, 1);
  await Character.findByIdAndUpdate(characterId, character);
  const gearedCharacter = gearSum(characterId);
  return gearedCharacter;
};

module.exports = {
  lvlUp,
  gearSum,
  reverseGearSum,
  unequipItem,
  equipItem,
  useConsumable,
};
