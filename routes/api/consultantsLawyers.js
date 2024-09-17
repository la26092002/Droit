const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");

//const Order = require("../../models/Order");
const Actor1 = require("../../models/Actor1");
require('dotenv').config();

//const auth = require('../../middleware/auth')

const authAdmin = require('../../middleware/authAdmin')




router.get("/get", async (req, res) => {
   console.log("hello")
});


//@route    Get api/consultantsLawyers/NotAuth
//@desc     Get All
//@access   Public
router.get("/NotAuth/", async (req, res) => {
    try {
        const {  id, numberPhone, professionalCardNumber, judicialCouncil, role, email } = req.query;

        // Build a dynamic query object
        let searchCriteria = {};

        if (id) {
            searchCriteria._id = id;
        }
        if (numberPhone) {
            searchCriteria.numberPhone = numberPhone;
        }
        if (professionalCardNumber) {
            searchCriteria.professionalCardNumber = professionalCardNumber;
        }
        if (judicialCouncil) {
            searchCriteria.judicialCouncil = judicialCouncil;
        }
        if (role) {
            searchCriteria.role = role;
        }
        if (email) {
            searchCriteria.email = email;
        }

        searchCriteria.status = true;


        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const startIndex = (page - 1) * limit;
        const total = await Actor1.countDocuments();
        //countDocuments(): A Mongoose method used to count the number of documents (records) in the collection corresponding to the Product model.


        // Find actors based on the search criteria
        const actors = await Actor1.find(searchCriteria).populate('role').populate('judicialCouncil').select('-password').skip(startIndex).limit(limit);
        if (!actors) {
            return res.status(400).json({ msg: "There is no users" });
        }

        res.json({
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            data: actors
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({ msg: "users not found" });
        }
        res.status(500).send("Server Error");
    }
});


//@route    Get api/consultantsLawyers/query
//@desc     Get consultantsLawyers by query
//@access   Public
router.get("/auth", authAdmin, async (req, res) => {
    try {
        const { status, id, numberPhone, professionalCardNumber, judicialCouncil, role, email } = req.query;

        // Build a dynamic query object
        let searchCriteria = {};

        if (id) {
            searchCriteria._id = id;
        }
        if (numberPhone) {
            searchCriteria.numberPhone = numberPhone;
        }
        if (professionalCardNumber) {
            searchCriteria.professionalCardNumber = professionalCardNumber;
        }
        if (judicialCouncil) {
            searchCriteria.judicialCouncil = judicialCouncil;
        }
        if (role) {
            searchCriteria.role = role;
        }
        if (email) {
            searchCriteria.email = email;
        }
        if (status !== undefined) {
            searchCriteria.status = status === 'true'; // Convert string 'true'/'false' to boolean
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        const total = await Actor1.countDocuments(searchCriteria);
        const actors = await Actor1.find(searchCriteria).populate('role').populate('judicialCouncil')
            .select('-password')
            .skip(startIndex)
            .limit(limit);

        if (!actors || actors.length === 0) {
            return res.status(400).json({ msg: "There are no users" });
        }

        res.status(200).json({
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            data: actors,
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({ msg: "Users not found" });
        }
        res.status(500).send("Server Error");
    }
});

//@route    PUT api/consultantsLawyers/subscribe/:query
//@desc     subscribe on a consultantsLawyers search by id and modify by status
//@access   Private
router.put('/auth/subscribe/:id', [
    authAdmin
], async (req, res) => {
    const errors = validationResult(req); // if there are errors, they will be stored
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const id = req.params.id;

        const status = req.body.status;


        // Build a dynamic query object
        let searchCriteria = {};

        if (id) {
            searchCriteria.id = id;
        }else{
            return res.status(404).json({ msg: 'id user not inserted' });
        }



        const actor1 = await Actor1.findById(searchCriteria.id).select('-password');

        if (!actor1) {
            return res.status(404).json({ msg: 'Actor1 not found' });
        }

        actor1.status = (status === 'true' || status === true);
        if (req.body.from && req.body.to) {
            const newData = {
                from: req.body.from,
                to: req.body.to
            };
            actor1.subscribes.unshift(newData);
        }

        await actor1.save();
        res.json({data:actor1});
    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;