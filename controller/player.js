const Character = require("../models/Character.model");
const Item = require("../models/Item.model");
const Consumable = require("../models/Consumable.model");

//add all the atributes and famage from the gear to the character stats
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
      gearedCharacter.power += item.power;
      console.log(gearedCharacter);
    });

    return gearedCharacter;
  } catch (error) {
    console.log(error);
  }
};

//add +1 to the selected stat
const lvlUp = async (characterID, updatedAttribute) => {
  try {
    let character = await Character.findById(characterID);
    character.gold = Math.round(
      character.gold -
        (character.attributes[updatedAttribute] **
          (character.attributes[updatedAttribute] * 0.12) +
          character.attributes[updatedAttribute] *
            character.attributes[updatedAttribute])
    );
    character.attributes[updatedAttribute] =
      character.attributes[updatedAttribute] + 1;
    character.power = character.power + 1;
    await Character.findByIdAndUpdate(characterID, character, { new: true });
    const gearedLeveledCharacter = await gearSum(characterID);
    return gearedLeveledCharacter;
  } catch (error) {
    console.log(error);
  }
};
//return the character to the base stats(without gear)
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
    character.power -= item.power;
  });
  const naked = await Character.findByIdAndUpdate(character._id, character);
  return naked;
};
//equip an item from the inventory
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
//Unequip an item from the gear and send to the inventory
const unequipItem = async (characterId, itemId) => {
  const character = await Character.findById(characterId);
  const itemIndex = character.gear.indexOf(itemId);
  const unequipedItem = character.gear.splice(itemIndex, 1);
  character.inventory.push(unequipedItem);
  await Character.findByIdAndUpdate(characterId, character);
  const gearedCharacter = await gearSum(character._id);
  return gearedCharacter;
};
//use a consumable as gain the effect
const useConsumable = async (characterId, consumableId) => {
  const character =
    await Character.findById(characterId).populate("consumables");
  const usedConsumable = character.consumables.find(
    (consumable) => consumable.id === consumableId
  );
  const usedConsumableIndex = character.consumables.findIndex(
    (consumable) => consumable.id === consumableId
  );
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
//set the initial gear that will be assign to a new player
const initialGear = async (characterId) => {
  const shieldId = "653adb5c690af601c7d82130";
  const weaponId = "6537c49f84e1685de5c7cd3c";
  const potionId = "654a381cfd62ac0ef8069059";
  const newCharacter = await Character.findById(characterId);
  const shield = await Item.findById(shieldId);
  const weapon = await Item.findById(weaponId);
  const potion = await Consumable.findById(potionId);
  newCharacter.gear.push(weapon);
  newCharacter.inventory.push(shield);
  newCharacter.consumables.push(potion);
  return newCharacter;
};

module.exports = {
  lvlUp,
  gearSum,
  reverseGearSum,
  unequipItem,
  equipItem,
  useConsumable,
  initialGear,
};
