const Enemy = require("../models/Enemy.model");
const Character = require("../models/Character.model")
const {gearSum,reverseGearSum} = require("./Character")

const characterTurn = async (character,enemy,combat1) => {
    const hitMod = Math.log(1 + Math.abs(character.attributes.dexterity - enemy.attributes.agility))
    let hitChance = 0
        if (character.attributes.dexterity - enemy.attributes.agility >= 0) {
            hitChance = 0.5 + hitMod * 0.1
            const randomHitNumber = Math.random()
            if(hitChance >= randomHitNumber) {
                
                let charDmg = Math.round((character.damage * (1.1 **character.attributes.strength)) - ((enemy.attributes.armor/2 ) * ((1.1** enemy.attributes.constitution))));
                if (charDmg < character.damage){
                    charDmg = character.damage
                }
                enemy.health -= charDmg
                console.log("Enemy health post atack", enemy.health)
                let combat1Result = `${enemy.name} recived a piercing strike of ${charDmg}` 
                console.log(combat1Result)
                combat1.push(combat1Result) 
                console.log("Your combat1 is", combat1)
            }
            else {
                let combat1Result = `${enemy.name} evades the attack`
                console.log(combat1Result)
                combat1.push(combat1Result)
                console.log("Your combat1 is", combat1)
            }
        }
        else {
            hitChance = 0.5 - hitMod * 0.1
            const randomHitNumber = Math.random()
            if(hitChance >= randomHitNumber) {
                
                let charDmg = Math.round((character.damage * (1.1 **character.attributes.strength)) - ((enemy.attributes.armor/2) * ((1.1** enemy.attributes.constitution)) ));
                if (charDmg < character.damage){
                    charDmg = character.damage
                }
                enemy.health -= charDmg
                console.log("Enemy health post atack", enemy.health)
                let combat1Result = `${enemy.name} recived a piercing strike of ${charDmg}` 
                console.log(combat1Result)
                combat1.push(combat1Result) 
                console.log("Your combat1 is", combat1)
            }
            else {
                let combat1Result = `${enemy.name} evades the attack`
                console.log(combat1Result)
                combat1.push(combat1Result)
                console.log("Your combat1 is", combat1)
            }
        }
            

}

const enemyTurn = (character,enemy,combat2)=> {
    const hitMod = Math.log(1 + Math.abs(enemy .attributes.dexterity - character.attributes.agility))
    let hitChance = 0
        if (enemy .attributes.dexterity - character.attributes.agility) {
            hitChance = 0.5 + hitMod * 0.1
            const randomHitNumber = Math.random()
                if (hitChance >= randomHitNumber) {
                    let eneDmg = Math.round((enemy.damage * (1.1 **enemy.attributes.strength)) - ((character.attributes.armor/2 )* ((1.1** character.attributes.constitution))));  ;
                    if (eneDmg < enemy.damage){
                        eneDmg = enemy.damage
                    }
                    character.health -= eneDmg
                    let combat2Result = `${character.name} recived a piercing strike of ${eneDmg}`
                    console.log(combat2Result)
                    combat2.push(combat2Result)
                    console.log("Your combat2 is", combat2)
                }
                else {
                    let combat2Result =`${character.name} evades the attack`
                    console.log(combat2Result)
                    combat2.push(combat2Result)
                    console.log("Your combat2 is", combat2)
                }
        }
        else {
            hitChance = 0.5 - hitMod * 0.1
            const randomHitNumber = Math.random()
                if (hitChance >= randomHitNumber) {
                    let eneDmg = Math.round((enemy.damage * (1.1 **enemy.attributes.strength)) - ((character.attributes.armor/2 )* ((1.1** character.attributes.constitution)) ));
                    if (eneDmg < enemy.damage){
                        eneDmg = enemy.damage
                    }
                    console.log("Character health post attack", character.health)
                    character.health -= eneDmg
                    let combat2Result = `${character.name} recived a piercing strike of ${eneDmg}`
                    console.log(combat2Result)
                    combat2.push(combat2Result)
                    console.log("Your combat2 is", combat2)
                }
                else {
                    let combat2Result =`${character.name} evades the attack`
                    console.log(combat2Result)
                    combat2.push(combat2Result)
                    console.log("Your combat2 is", combat2)
                }
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
    exploreCombat,
}