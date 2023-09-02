const Enemy = require("../models/Enemy.model");
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

module.exports = router;
