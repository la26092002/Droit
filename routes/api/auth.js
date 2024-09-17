const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Actor1 = require("../../models/Actor1");
require('dotenv').config();

// @route    POST api/auth
// @desc     Authenticate user and get token
// @access   Public
router.post(
  "/",
  [
    check("numberPhone", "Please include a valid phone number").isMobilePhone(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { numberPhone, password } = req.body;

    try {
      let actor = await Actor1.findOne({ numberPhone });
      if (!actor) {
        return res.status(400).json({ errors: [{ msg: "User does not exist" }] });
      }

      const isMatch = await bcrypt.compare(password, actor.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: "Incorrect password" }] });
      }

      const payload = {
        actor1: {
          id: actor.id,
          status: actor.status
        }
      };

      const msg = actor.status ? "You have a subscription" : "You don't have a subscription";
      const statusCode = actor.status ? 200 : 403;

      jwt.sign(
        payload,
        process.env.JWT_SECRET || "mysecrettoken",
        { expiresIn: '1h' }, // Token expiration (optional)
        (err, token) => {
          if (err) throw err;
          res.status(statusCode).json({
            token,
            msg,
            name: actor.name,
            numberPhone: actor.numberPhone,
            email: actor.email
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    POST api/register
// @desc     Register user
// @access   Public
router.post(
  "/register",
  [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("professionalCardNumber", "Professional card number is required").not().isEmpty(),
    check("judicialCouncil", "Judicial council is required").not().isEmpty(),
    check("role", "Role is required").not().isEmpty(),
    check("numberPhone", "Please include a valid phone number").isMobilePhone(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, numberPhone, judicialCouncil, role, professionalCardNumber } = req.body;

    try {
      let existingUserByPhone = await Actor1.findOne({ numberPhone });
      let existingUserByEmail = await Actor1.findOne({ email });

      if (existingUserByPhone || existingUserByEmail) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      let actor = new Actor1({
        firstName,
        lastName,
        email,
        password,
        numberPhone,
        judicialCouncil,
        role,
        professionalCardNumber
      });

      const salt = await bcrypt.genSalt(10);
      actor.password = await bcrypt.hash(password, salt);

      await actor.save();

      const payload = {
        actor1: {
          id: actor.id,
          status: actor.status
        }
      };

      
      //const statusCode = actor.status ? 200 : 403;

      jwt.sign(
        payload,
        process.env.JWT_SECRET || "mysecrettoken",
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            msg: "Registration successful",
            token
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
