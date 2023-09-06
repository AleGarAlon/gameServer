const { Schema, model } = require("mongoose");

const characterSchema = new Schema(
    {
        name: {
            type: String
        },
        image: {
            type: String,
            default : "https://res.cloudinary.com/dvml0gelc/image/upload/v1691593037/Zen_z7ulvc.png"
        },

        gold: {
            type: Number,
            default : 0
        },
        gear: {
            type: Schema.Types.ObjectId,
            ref: "Item"
        },
        inventory: {
            type: Schema.Types.ObjectId,
            ref: "Item"
        },
        consumables: {
            type: Schema.Types.ObjectId,
            ref: "Consumable"
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
            type: [Number],
            default: [1,4]
        },
        health: {
            type:Number
        },
        power:{
            type:Number
        },
        points: {
            type: Number,
            default : 12
        },
        pit: {
            wins:{
                type: Number
            },
            loses:{
                type:Number
            },
            score: {
                type:Number
            }
        },
    }
)

const Character = model("Character", characterSchema)
module.exports = Character