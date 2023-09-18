const Enemy = require("../models/Enemy.model");
const Character = require("../models/Character.model")
const router = require("express").Router();
const { isAuthenticated } = require('../middlewares/jwt.middleware')

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get("/explore/:location", async (req, res)=> {
    const {location} = req.params
    console.log(location)
    try {
      const enemy = await Enemy.findOne({location : location})
      console.log(enemy)
      res.status(200).json(enemy)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
})

router.get("/character/:id", async (req, res) => {
  console.log(req.params)
  const {id} = req.params
  try {
    const character = await Character.findById(id)
    console.log(character)
    res.status(200).json(character)
  } catch (error) {
    console.log(error)
    res.status(500).json("Something goes wrong")
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
