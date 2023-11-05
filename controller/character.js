const Enemy = require("../models/Enemy.model");
const Character = require("../models/Character.model")
const Item = require("../models/Item.model")
const Consumable = require("../models/Consumable.model")

const gearSum = async (id) => {
    try {
        
        const gearedCharacter= await Character.findById(id)
        .populate("gear")
        .populate("inventory")
        .populate("consumables")
    
        gearedCharacter.gear.map(item => {
            gearedCharacter.attributes.strength += item.attributes.strength
            gearedCharacter.attributes.dexterity += item.attributes.dexterity
            gearedCharacter.attributes.agility += item.attributes.agility
            gearedCharacter.attributes.constitution += item.attributes.constitution
            gearedCharacter.attributes.fate += item.attributes.fate
            gearedCharacter.attributes.armor += item.attributes.armor
            gearedCharacter.damage += item.damage
        })
    
        return gearedCharacter
    } catch (error) {
        console.log(error)
    }

} 
const lvlUp = async (characterID,updatedAttribute) => {
    
try {
    let character = await Character.findById(characterID)
    
    character.gold = character.gold - character.attributes[updatedAttribute] * 5
    character.attributes[updatedAttribute] = character.attributes[updatedAttribute] + 1
    const lvlCharacter = await Character.findByIdAndUpdate(characterID,character, { new: true })
    
    const gearedLeveledCharacter = await gearSum(characterID)
    
    return gearedLeveledCharacter
} catch (error) {
    console.log(error)
}
}


const reverseGearSum = async (character) => {
    console.log(character)

    character.gear.map(item => {
        character.attributes.strength -= item.attributes.strength
        character.attributes.dexterity -= item.attributes.dexterity
        character.attributes.agility -= item.attributes.agility
        character.attributes.constitution -= item.attributes.constitution
        character.attributes.fate -= item.attributes.fate
        character.attributes.armor -= item.attributes.armor
        character.damage -= item.damage
    })

    const naked = await Character.findByIdAndUpdate(character._id, character)
    return naked
    

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
                    const charDmg = Math.round((character.damage * (1.1 **character.attributes.strength)) - enemy.attributes.armor);
                    enemy.health -= charDmg
                    
                    console.log("Enemy health post atack", enemy.health)
                    let combat1Result = `${enemy.name} recived a piercing strike of ${charDmg}` 
                    console.log(combat1Result)
                    combat1.push(combat1Result) 
                    console.log("Your combat1 is", combat1)
                }
                //non fate attack
                else {
                    const charDmg = Math.round((character.damage * (1.1 **character.attributes.strength)) - (enemy.attributes.armor / 5 * (1.1** enemy.attributes.constitution)))
                    // console.log("Enemy health pre atack", enemy.health)
                    enemy.health -= charDmg
                    console.log("Enemy health post atack", enemy.health)
                    let combat1Result = `${enemy.name} recived a strike of ${charDmg}` 
                    console.log(combat1Result)
                    combat1.push(combat1Result)
                    console.log("Your combat1 is", combat1)
                }
                }
                else {
                let combat1Result = `${enemy.name} evades the attack`
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
            const eneDmg = Math.round(enemy.damage * (1.1 ** enemy.attributes.strength));
            // console.log("Character health pre attack", character.health)
            // console.log(newHealth)
            console.log("Character health post attack", character.health)
            character.health -= eneDmg
            let combat2Result = `${character.name} recived a piercing strike of ${eneDmg}`
                console.log(combat2Result)
                combat2.push(combat2Result)
                console.log("Your combat2 is", combat2)
        }
         //non fate attack
        else {
            const eneDmg = Math.round((enemy.damage * (1.1 ** enemy.attributes.strength))) - character.attributes.armor
            character.health -= eneDmg
            console.log("Character health post attack", character.health)
            let combat2Result =`${character.name} recived a strike of ${eneDmg}`
            console.log(combat2Result)
            combat2.push(combat2Result)
            console.log("Your combat2 is", combat2)
        }
    }// if the attack failed on the dex vs agi
    else {
        let combat2Result =`${character.name} evades the attack`
        console.log(combat2Result)
        combat2.push(combat2Result)
        console.log("Your combat2 is", combat2)
    }
    
}

const exploreCombat = async(characterID, location) => {
    let character = await gearSum(characterID)
    let enemy = await Enemy.findOne({location : location})
    let combat1 = []
    let combat2= []
    let victory = ""
    const whosTurn = Math.floor(Math.random() * 100) + 1;
    console.log("Your turn number is",whosTurn)
         
        if (whosTurn % 2 !== 0){
            console.log("PLAYER ATTACK FIRST")
            combat1.push(`${character.name} attack first`)
        while (character.health > 0 && enemy.health > 0) {
            characterTurn(character,enemy,combat1);
            
            if (enemy.health <= 0) {
                enemy.health = 0
                character.gold += enemy.gold
                await reverseGearSum(character)
                character = await gearSum(characterID)
                victory =`${character.name} wins`
                break
            }
            enemyTurn(character,enemy,combat2);
            
            if (character.health <= 0){
                character.health = 0
                await reverseGearSum(character)
                character = await gearSum(characterID)
                victory=`${enemy.name} wins`
                break
            }
        }
        }
        if(whosTurn % 2 === 0) {
            console.log("ENEMY ATTACK FIRST")
            combat2.push(`${enemy.name} attack first`)
            while (character.health > 0 && enemy.health > 0) {
                enemyTurn(character,enemy,combat2);
                
                if (character.health <= 0){
                    character.health = 0
                    await reverseGearSum(character)
                    character = await gearSum(characterID)
                    victory=`${enemy.name} wins`
                    break
                }
                characterTurn(character,enemy,combat1);
                
                if (enemy.health <= 0) {
                    enemy.health = 0
                    character.gold += enemy.gold
                    await reverseGearSum(character)
                    character = await gearSum(characterID)
                    victory=`${character.name} wins`
                    break
                }
            }  
        }
         return {character, enemy, combat1, combat2, victory}
}

module.exports = {
    lvlUp,
    exploreCombat,
    gearSum,
    reverseGearSum,

}