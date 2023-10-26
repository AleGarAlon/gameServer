const Enemy = require("../models/Enemy.model");
const Character = require("../models/Character.model")
const Item = require("../models/Item.model")
const Consumable = require("../models/Consumable.model")

const lvlUp = async (characterID,updatedAttribute) => {
    
try {
    let  character = await Character.findById(characterID)
    character.gold = character.gold - character.attributes[updatedAttribute] * 5
    character.attributes[updatedAttribute] = character.attributes[updatedAttribute] + 1
    let lvlCharacter = await Character.findByIdAndUpdate(characterID,character, { new: true })
    return lvlCharacter
} catch (error) {
    
}
}

const gearSum = async (id) => {
    const gearedCharacter= await Character.findById(id).populate("Items")

} 

const characterTurn = async (character,enemy,combat1) => {
    const randomDex1 = parseInt(Math.random() * 100);
    const randomAgi1 = parseInt(Math.random() * 100);
    const randomFate1 = parseInt(Math.random() * 100);
    //player turn
            //Random C.dex vs random E.agi to deternine if the atack land
            if (randomDex1 + character.attributes.dexterity > randomAgi1 + enemy.attributes.agility) {
                //if land, determine if the fate attribute triggers 
                //fate triggers = ignore armor
                if (character.attributes.fate>= randomFate1) {
                    //determine the damage, playerdamage + str atribute
                    const dmg = (character.damage + character.attributes.strength);
                    enemy.health -= dmg
                    
                    console.log("Enemy health post atack", enemy.health)
                    let combat1Result = `${enemy.name} recived a piercing strike of ${dmg}` 
                    console.log(combat1Result)
                    combat1.push(combat1Result) 
                    console.log("Your combat1 is", combat1)
                }
                //non fate attack
                else {
                    const dmg = (character.damage + character.attributes.strength) - enemy.attributes.armor
                    // console.log("Enemy health pre atack", enemy.health)
                    enemy.health -= dmg
                    }
                    console.log("Enemy health post atack", enemy.health)
                    let combat1Result = `${enemy.name} recived a strike of ${dmg}` 
                    console.log(combat1Result)
                    combat1.push(combat1Result)
                    console.log("Your combat1 is", combat1)
                }
                else {
                let combat1Result = `${character.name}, atack failed`
                console.log(combat1Result)
                combat1.push(combat1Result)
                console.log("Your combat1 is", combat1)
                
            }
            

}

const enemyTurn = (character,enemy,combat2)=> {
    const randomDex2 = parseInt(Math.random() * 100);
    const randomAgi2 = parseInt(Math.random() * 100);
    const randomFate2 = parseInt(Math.random() * 100);
    //enemy turn
    //Random E.dex vs random C.agi to deternine if the atack land
    if (randomDex2 + enemy .attributes.dexterity > randomAgi2 + character.attributes.agility) {
        //if land, determine if the fate attribute triggers 
        //fate triggers = ignore armor
        if (enemy.attributes.fate>= randomFate2) {
            //determine the damage, enemydamage + str atribute
            const dmg = (enemy.damage + enemy.attributes.strength);
            // console.log("Character health pre attack", character.health)
            // console.log(newHealth)
            console.log("Character health post attack", character.health)
            character.health -= dmg
            let combat2Result = `${character.name} recived a piercing strike of ${dmg}`
                console.log(combat2Result)
                combat2 = (combat2Result)
                console.log("Your combat2 is", combat2)
        }
         //non fate attack
        else {
            const dmg = (enemy.damage + enemy.attributes.strength) - character.attributes.armor
            character.health -= dmg
            console.log("Character health post attack", character.health)
            let combat2Result =`${character.name} recived a strike of ${dmg}`
            console.log(combat2Result)
            combat2 = (combat2Result)
            console.log("Your combat2 is", combat2)
        }
    }// if the attack failed on the dex vs agi
    else {
        let combat2Result =`${enemy.name}, atack failed`
        console.log(combat2Result)
        combat2 = (combat2Result)
        console.log("Your combat2 is", combat2)
    }
    
}

const exploreCombat = async(characterID, location) => {
    let  character = await Character.findById(characterID)
    
}

module.exports = {
    lvlUp,

}