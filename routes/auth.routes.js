const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Character = require("../models/Character.model");
const Enemy = require("../models/Enemy.model");
const Item = require("../models/Item.model");
const Consumable = require("../models/Consumable.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const { gearSum } = require("../controller/player.js");
const { initialGear } = require("../controller/player");

router.get("/", (req, res, next) => {
  res.json("All good in auth");
});

router.post("/signup", async (req, res) => {
  const payload = req.body;
  const salt = bcrypt.genSaltSync(13);
  const passwordHash = bcrypt.hashSync(payload.password, salt);
  try {
    const userExist = await Character.find({ name: payload.name });
    console.log(userExist);
    if (userExist.length > 0) {
      res.status(409).json({ message: "Name already in use" });
    } else {
      const newCharacter = await Character.create({ name: payload.name });
      const newGearedCharacter = await initialGear(newCharacter._id);
      await Character.findByIdAndUpdate(newCharacter._id, newGearedCharacter, {
        new: true,
      });
      await User.create({
        name: payload.name,
        password: passwordHash,
        character: newGearedCharacter,
      });
      res.status(201).json({ message: "User created" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const payload = req.body;
  try {
    const logginUser = await User.findOne({ name: payload.name });
    if (logginUser) {
      const passwordMatch = bcrypt.compareSync(
        payload.password,
        logginUser.password
      );
      if (passwordMatch) {
        const authToken = jwt.sign(
          { userId: logginUser._id },
          process.env.TOKEN_SECRET,
          {
            algorithm: "HS256",
            expiresIn: "7d",
          }
        );
        res.status(200).json({ token: authToken });
      } else {
        res.status(403).json({ errorMessage: "Invalid User/Password" });
      }
    } else {
      res.status(403).json({ errorMessage: "Invalid User/Password" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/verify", isAuthenticated, async (req, res) => {
  console.log(
    "here is after the middleware, what JWT is giving us",
    req.payload
  );
  const currentUser = await User.findById(req.payload.userId).populate(
    "character"
  );
  if (currentUser.character) {
    characterWithGear = await gearSum(currentUser.character._id);
    console.log("Your geared character is", characterWithGear);
    currentUser.character = characterWithGear;
    console.log(currentUser);
    currentUser.password = "****";
    res.status(200).json({ message: "Token is valid", currentUser });
  }
});

module.exports = router;
