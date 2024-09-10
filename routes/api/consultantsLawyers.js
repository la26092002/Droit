const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const Order = require("../../models/Order");
const Actor1 = require("../../models/Actor1");
require('dotenv').config();

//const auth = require('../../middleware/auth')

const authAdmin = require('../../middleware/authAdmin')


//@route    Get api/consultantsLawyers/:query
//@desc     Get consultantsLawyers by query
//@access   Public
router.get("/:query", authAdmin
    , async (req, res) => {
        try {
            const query = req.params.query;

            // Extract parameters using regex
            const IdMatch = query.match(/id=(\w+)/);
            const numberPhoneMatch = query.match(/numberPhone=(\w+)/);
            const professionalCardNumberMatch = query.match(/professionalCardNumber=(\w+)/);
            const judicialCouncilMatch = query.match(/judicialCouncil=(\w+)/);
            const roleMatch = query.match(/role=(\w+)/);
            const emailMatch = query.match(/email='([^']+)'/);

            // Build a dynamic query object
            let searchCriteria = {};

            if (IdMatch) {
                searchCriteria.id = IdMatch[1];
            }
            if (numberPhoneMatch) {
                searchCriteria.numberPhone = numberPhoneMatch[1];
            }
            if (professionalCardNumberMatch) {
                searchCriteria.professionalCardNumber = professionalCardNumberMatch[1];
            }
            if (judicialCouncilMatch) {
                searchCriteria.judicialCouncil = judicialCouncilMatch[1];
            }
            if (roleMatch) {
                searchCriteria.role = roleMatch[1];
            }
            if (emailMatch) {
                searchCriteria.email = emailMatch[1];
            }

            // Find actors based on the search criteria
            const actors = await Actor1.find(searchCriteria).select('-password');
            if (!actors) {
                return res.status(400).json({ msg: "There is no users" });
            }

            res.json(actors);
        } catch (err) {
            console.error(err.message);
            if (err.kind == "ObjectId") {
                return res.status(400).json({ msg: "users not found" });
            }
            res.status(500).send("Server Error");
        }
    });



    //@route    Get api/consultantsLawyers
//@desc     Get All
//@access   Public
router.get("/", authAdmin
    , async (req, res) => {
        try {
            // Find actors based on the search criteria
            const actors = await Actor1.find().select('-password');
            if (!actors) {
                return res.status(400).json({ msg: "There is no users" });
            }

            res.json(actors);
        } catch (err) {
            console.error(err.message);
            if (err.kind == "ObjectId") {
                return res.status(400).json({ msg: "users not found" });
            }
            res.status(500).send("Server Error");
        }
    });








module.exports = router;
