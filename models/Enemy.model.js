const { Schema, model } = require("mongoose");

const enemySchema = new Schema(
    {
        name: {
            type: String
        },
        image: {
            type: String,
            default : "https://res.cloudinary.com/dvml0gelc/image/upload/v1691593037/Zen_z7ulvc.png"
        },

        gold: {
            type: Number
        },
        
        inventory:[ {
            type: Schema.Types.ObjectId,
            ref: "Item"
        }],
        consumables: [{
            type: Schema.Types.ObjectId,
            ref: "Consumable"
        }],
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
            type: Number,
            
        },
        health: {
            type:Number
        },
        location: {
            type: String
        },
        locationNumber: {
            type:Number
        }
    }
)

const Enemy = model("Enemy", enemySchema)
module.exports = Enemy