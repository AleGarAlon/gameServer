const { Schema, model } = require("mongoose");

const ItemSchema = new Schema (
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
        attributes: {
            strength:{
                type: Number,
                default: 10
            },
            dexterity:{
                type: Number,
                default: 10
            },
            agility:{
                type: Number,
                default: 10
            },
            constitution:{
                type: Number,
                default: 10
            },
            fate:{
                type: Number,
                default: 10
            },
            armor:{
                type: Number,
                default: 0
            },
        },
        damage: {
            type: Number
        }
    }
)

const Item = model("Item", ItemSchema)
module.exports = Item