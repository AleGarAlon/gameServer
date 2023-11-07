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
        type:String
    },
    amount: {
        type:Number
    },
    description: {
        type:String
    }
   } 
)

const Consumable = model("Consumable", ConsumableSchema)

module.exports = Consumable