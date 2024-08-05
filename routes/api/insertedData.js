const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");

const JudicialCouncil = require("../../models/judicialCouncil");
const Role = require("../../models/Role");
require('dotenv').config();

//@route    POST /api/dataInserted/judicialCouncil
//@desc     Create a judicialCouncil
//@access   Public
router.post('/judicialCouncil', [[
    check("name", "name is required").not().isEmpty(),
    check("willaya", "willaya is required").not().isEmpty(),
]
], async (req, res) => {
    const errors = validationResult(req);//if there is error for checking it will store errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const newJudicialCouncil = new JudicialCouncil({
            name: req.body.name,
            willaya: req.body.willaya,
        })
        const judicialCouncil = await newJudicialCouncil.save();
        res.json(judicialCouncil);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server Error');
    }
});



//@route    GET /api/dataInserted/judicialCouncil
//@desc     Get all judicialCouncil
//@access   Public
router.get('/judicialCouncil', async (req, res) => {

    try {
        judicialCouncil = await JudicialCouncil.find().sort({ date: -1 });
        return res.status(200).json(judicialCouncil);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server Error');
    }
});



///////////////////////////////////


//@route    POST /api/dataInserted/Role
//@desc     Create a Role
//@access   Public
router.post('/Role', [[
    check("name", "name is required").not().isEmpty(),
]
], async (req, res) => {
    const errors = validationResult(req);//if there is error for checking it will store errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const newRole = new Role({
            name: req.body.name,
        })
        const role = await newRole.save();
        res.json(role);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server Error');
    }
});



//@route    GET /api/dataInserted/Role
//@desc     Get all Role
//@access   Public
router.get('/Role', async (req, res) => {

    try {
        role = await Role.find().sort({ date: -1 });
        return res.status(200).json(role);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server Error');
    }
});




module.exports = router;