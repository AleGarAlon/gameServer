const Enemy = require("../models/Enemy.model");
const Character = require("../models/Character.model")
const Item = require("../models/Item.model")
const Consumable = require("../models/Consumable.model")
const router = require("express").Router();
const { isAuthenticated } = require('../middlewares/jwt.middleware')

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

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
  const updateCharacterData = req.body
  console.log("your body on the PATCH is",req.body)
  // console.log("your params on the PATCH is",req.params)
  try {
    const character = await Character.findByIdAndUpdate(characterID, { $set: { attributes: updateCharacterData.attributes, gold: updateCharacterData.gold  } }, { new: true })
    console.log(character)
    res.status(200).json(character)
  } catch (error) {
    console.log(error)
    res.status(500).json("something goes wrong in the character PATCH")
  }
})

router.get("/shop", async(req,res) => {
  try {
    const consumables = await Consumable.find()
    res.status(200).json(consumables)
  } catch (error) {
    console.log(error)
    res.status(500).json("something goes wrong in the consumables GET")
  }
})

router.get("/armory", async (req,res) =>{
  try {
    const items = await Item.find();
  res.status(200).jsom(items)
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
