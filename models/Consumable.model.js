const { Schema, model } = require("mongoose");

const ConsumableSchema = new Schema (
   {
    name: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    type: {
        type:String
    },
    rarity: {
        type: String
    },
    effect: {
        type:Number
    }
   } 
)

const Consumable = model("consumable", ConsumableSchema)

module.exports = Consumable