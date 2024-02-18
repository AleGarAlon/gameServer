const Enemy = require("../models/Enemy.model");
const Character = require("../models/Character.model");
const { gearSum, reverseGearSum } = require("./player");
const { shuffleArray } = require("./merchant");
const Consumable = require("../models/Consumable.model");

//The user character turn in a combat
const characterTurn = async (character, enemy, combat1) => {
  const hitMod = Math.log(
    1 + Math.abs(character.attributes.dexterity - enemy.attributes.agility)
  );
  let hitChance = 0;
  if (character.attributes.dexterity - enemy.attributes.agility >= 0) {
    hitChance = 0.5 + hitMod * 0.1;
    const randomHitNumber = Math.random();
    if (hitChance >= randomHitNumber) {
      let charDmg = Math.round(
        (character.damage * 0.1 * character.attributes.strength -
          enemy.attributes.armor * enemy.attributes.constitution * 0.01) *
          (Math.random() + 2)
      );
      if (charDmg <= 0) {
        charDmg = 1;
      }
      enemy.health -= charDmg;
      let combat1Result = `${enemy.name} received ${charDmg} damage`;
      combat1.push(combat1Result);
    } else {
      let combat1Result = `${enemy.name} evades the attack`;
      combat1.push(combat1Result);
    }
  } else {
    hitChance = 0.5 - hitMod * 0.1;
    const randomHitNumber = Math.random();
    if (hitChance >= randomHitNumber) {
      let charDmg = Math.round(
        (character.damage * 0.1 * character.attributes.strength -
          enemy.attributes.armor * enemy.attributes.constitution * 0.01) *
          (Math.random() + 2)
      );
      if (charDmg <= 0) {
        charDmg = 1;
      }
      enemy.health -= charDmg;
      let combat1Result = `${enemy.name} received ${charDmg} damage`;
      combat1.push(combat1Result);
    } else {
      let combat1Result = `${enemy.name} evades the attack`;
      combat1.push(combat1Result);
    }
  }
};

//Enemy turn in a combat
const enemyTurn = (character, enemy, combat2) => {
  const hitMod = Math.log(
    1 + Math.abs(enemy.attributes.dexterity - character.attributes.agility)
  );
  let hitChance = 0;
  if (enemy.attributes.dexterity - character.attributes.agility) {
    hitChance = 0.5 + hitMod * 0.1;
    const randomHitNumber = Math.random();
    if (hitChance >= randomHitNumber) {
      let eneDmg = Math.round(
        (enemy.damage * 0.1 * enemy.attributes.strength -
          character.attributes.armor *
            0.01 *
            character.attributes.constitution) *
          (Math.random() + 2)
      );
      if (eneDmg <= 0) {
        eneDmg = 1;
      }
      character.health -= eneDmg;
      let combat2Result = `${character.name} received ${eneDmg} damage`;
      combat2.push(combat2Result);
    } else {
      let combat2Result = `${character.name} evades the attack`;
      combat2.push(combat2Result);
    }
  } else {
    hitChance = 0.5 - hitMod * 0.1;
    const randomHitNumber = Math.random();
    if (hitChance >= randomHitNumber) {
      let eneDmg = Math.round(
        (enemy.damage * 0.1 * enemy.attributes.strength -
          character.attributes.armor *
            0.01 *
            character.attributes.constitution) *
          (Math.random() + 2)
      );
      if (eneDmg <= 0) {
        eneDmg = 1;
      }
      character.health -= eneDmg;
      let combat2Result = `${character.name} received ${eneDmg} damage`;
      combat2.push(combat2Result);
    } else {
      let combat2Result = `${character.name} evades the attack`;
      combat2.push(combat2Result);
    }
  }
};
//give a 1 of the 4 random enemies that populates each zone
const randomLocation = () => {
  let locNum = Math.floor(Math.random() * 20) + 1;

  if (locNum >= 1 && locNum <= 9) {
    locNum = 1;
  } else if (locNum >= 10 && locNum <= 16) {
    locNum = 2;
  } else if (locNum >= 17 && locNum <= 19) {
    locNum = 3;
  } else {
    locNum = 4;
  }
  return locNum;
};

//chose randomly 1 of the loot items in the enemy inventory(in defeated)
const itemLoot = async (character, enemy) => {
  const chance = Math.random() * 100;

  if (chance >= 30 && chance <= 55) {
    lootedItem = enemy.inventory[0];
    character.inventory.push(lootedItem);
  } else if (chance > 55 && chance <= 75) {
    lootedItem = enemy.inventory[1];
    character.inventory.push(lootedItem);
  } else if (chance > 75 && chance <= 90) {
    lootedItem = enemy.inventory[2];
    character.inventory.push(lootedItem);
  } else if (chance > 90 && chance <= 100) {
    lootedItem = enemy.inventory[3];
    character.inventory.push(lootedItem);
  } else {
    allFoodConsumables = await Consumable.find({ type: "food" });

    const lootedConsumable = shuffleArray(allFoodConsumables);
    console.log(lootedConsumable);
    character.consumables.push(lootedConsumable[0]);
  }

  return character;
};

const searchEnemies = async (location) => {
  try {
    const enemies = await Enemy.find({ location: location });
    return enemies;
  } catch (error) {
    console.log(error);
  }
};
//find an enemy in the chosen location and then execute the combat dinamic
const exploreCombat = async (characterID, enemyId) => {
  console.log(characterID, enemyId, "<-----------");
  let character = await gearSum(characterID);
  let enemy = await Enemy.findById(enemyId);
  let combat1 = [];
  let combat2 = [];
  let victory = "";
  const whosTurn = Math.floor(Math.random() * 100) + 1;
  //randomly assign who will attack first and triggers the end of the combat
  if (whosTurn % 2 !== 0) {
    combat1.push(`${character.name} attack first`);
    while (character.health > 0 && enemy.health > 0) {
      characterTurn(character, enemy, combat1);

      if (enemy.health <= 0) {
        enemy.health = 0;
        character.gold += enemy.gold;
        character = await itemLoot(character, enemy);
        await reverseGearSum(character);
        character = await gearSum(characterID);
        victory = `${character.name} wins`;
        break;
      }
      enemyTurn(character, enemy, combat2);

      if (character.health <= 0) {
        character.health = 0;
        await reverseGearSum(character);
        character = await gearSum(characterID);
        victory = `${enemy.name} wins`;
        break;
      }
    }
  }
  if (whosTurn % 2 === 0) {
    combat2.push(`${enemy.name} attack first`);
    while (character.health > 0 && enemy.health > 0) {
      enemyTurn(character, enemy, combat2);

      if (character.health <= 0) {
        character.health = 0;
        await reverseGearSum(character);
        character = await gearSum(characterID);
        victory = `${enemy.name} wins`;
        break;
      }
      characterTurn(character, enemy, combat1);

      if (enemy.health <= 0) {
        enemy.health = 0;
        character.gold += enemy.gold;
        character = await itemLoot(character, enemy);
        await reverseGearSum(character);
        character = await gearSum(characterID);
        victory = `${character.name} wins`;
        break;
      }
    }
  }
  return { character, enemy, combat1, combat2, victory };
};

module.exports = {
  exploreCombat,
  searchEnemies,
};
