const { Schema, model } = require("mongoose");

const characterSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dvml0gelc/image/upload/v1695039396/game/character%20portraits/m_13_hqseg6.png",
  },

  gold: {
    type: Number,
    default: 500,
  },
  gear: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  inventory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  consumables: [
    {
      type: Schema.Types.ObjectId,
      ref: "Consumable",
    },
  ],
  attributes: {
    strength: {
      type: Number,
      default: 10,
    },
    dexterity: {
      type: Number,
      default: 10,
    },
    agility: {
      type: Number,
      default: 10,
    },
    constitution: {
      type: Number,
      default: 10,
    },
    fate: {
      type: Number,
      default: 10,
    },
    armor: {
      type: Number,
      default: 0,
    },
  },
  damage: {
    type: Number,
    default: 1,
  },
  health: {
    type: Number,
    default: 100,
  },
  power: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 12,
  },
  pit: {
    wins: {
      type: Number,
      default: 0,
    },
    loses: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
});

const Character = model("Character", characterSchema);
module.exports = Character;
