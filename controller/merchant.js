const Item = require("../models/Item.model")
const Consumable = require("../models/Consumable.model")

const shuffleArray =(array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


const randomConsumables = async () => {
let consumables = await Consumable.find()
consumables = shuffleArray(consumables)
    let shopConsumables = consumables.slice(0, 4)
     return shopConsumables
}

const randomItems = async () => {
    let items = await Item.find()
    items = shuffleArray(items)
    let shopItems = items.slice(0, 4)
     return shopItems
    }
    
module.exports = {
    randomConsumables,
    randomItems
}