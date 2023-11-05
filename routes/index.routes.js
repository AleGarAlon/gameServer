const Enemy = require("../models/Enemy.model");
const Character = require("../models/Character.model")
const Item = require("../models/Item.model")
const Consumable = require("../models/Consumable.model")
const router = require("express").Router();
const { isAuthenticated } = require('../middlewares/jwt.middleware')
const {lvlUp, exploreCombat} = require("../controller/Character")
const {randomConsumables,randomItems} = require("../controller/merchant")

router.get("/", (req, res, next) => {
  res.json("All good in here");
});


router.get("/explore/combat", async (req,res) => {
  const id = req.query.id;
  const location = req.query.location;
  
  try {
    console.log("GOING INTO THE TRY EXPLORE COMBAT")
    const exploreCombatResult = await exploreCombat(id,location)
    console.log("Your combat results are", exploreCombatResult)
    res.status(200).json(exploreCombatResult)
  } catch (error) {
    console.log("Your error in combat is", error);
    res.status(500).json({ error: "An error occurred in combat." });
  }
})

router.get("/explore/:location", async (req, res)=> {
    const {location} = req.params
    console.log("Your location on the Get explore",location)
    try {
      const enemy = await Enemy.findOne({location : location})
      console.log("Your enemy on the Get explore",enemy)
      res.status(200).json(enemy)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
})
router.get("/character/:id", async (req, res) => {
  // console.log("Your params on the character GEt are",req.params)
  const {id} = req.params
  try {
    const character = await Character.findById(id)
    // console.log("Your character on the character GEt are",character)
    res.status(200).json(character)
  } catch (error) {
    console.log(error)
    res.status(500).json("Something goes wrong")
  } 
}) 

router.patch("/character/:id", async (req, res) => {
  const characterID = req.params.id
  const {updatedAttribute} = req.body
  try {
  // let  character = await Character.findById(characterID)
  //   character.gold = character.gold - character.attributes[updatedAttribute] * 5
  //   character.attributes[updatedAttribute] = character.attributes[updatedAttribute] + 1
  //   let updatedCharacter = await Character.findByIdAndUpdate(characterID,character, { new: true })
  const sendCharacter = await lvlUp(characterID,updatedAttribute)
  
    res.status(200).json(sendCharacter)
  } catch (error) {
    console.log(error)
    res.status(500).json("something goes wrong in the character PATCH")
  }
})

router.get("/shop", async(req,res) => {
  try {
    const consumables = await randomConsumables()
    res.status(200).json(consumables)
  } catch (error) {
    console.log(error)
    res.status(500).json("something goes wrong in the consumables GET")
  }
})

router.get("/armory", async (req,res) =>{
  try {
    const items = await randomItems()
    console.log("YOUR FINAL ITEMS BEFORE SEND TO FRONT", items)
  res.status(200).json(items)
  } catch (error) {
    console.log(error)
    res.status(500).json("soething goes wrong in the items GET")
  }
  
})
 
router.get('/verify', isAuthenticated, async(req, res) => {
  console.log('here is after the middleware, what JWT is giving us', req.payload)
  const currentUser = await User.findById(req.payload.userId)  
  .populate("character") 
  console.log(currentUser)
  currentUser.password = '****'
  res.status(200).json({message: 'Token is valid', currentUser})
})




module.exports = router;
