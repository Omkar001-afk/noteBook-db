const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs"); //for adding hash value in password
var jwt = require("jsonwebtoken");
const jwt_sec = "helloworld";

//create a user using : Post "/api/auth/createuser" doesnt require auth
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //Bad request error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //user email exist or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "This email already exists" });
      }

      const salt = await bcrypt.genSaltSync(10); //for making password more secure adding (pass+hash+salt)
      // const hash = bcrypt.hashSync("B4c0//", salt);
      const sPass = await bcrypt.hash(req.body.password, salt);
      //create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: sPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      //generation of token for users
      const authToken = jwt.sign(data, jwt_sec);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error occured");
    }
  }
);
//Authentication a User using POST'/api/auth/login', No login required
router.post(
  "/login",
  [
    body("email", "Enter a vaild email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    //if any error occurs in login phase
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, jwt_sec);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error occured");
    }
  }
);
module.exports = router;
