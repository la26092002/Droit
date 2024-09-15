const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Company = require("../../models/Company");
require('dotenv').config();

const authAdmin = require('../../middleware/authAdmin')

//@route    POST api/company
//@desc     Test route
//@access   Public
router.post(
    "/",
    [
        check("name", "name is required").not().isEmpty(),
        check("firstPersonName", "firstPersonName is required").not().isEmpty(),
        check("email", "email is required").not().isEmpty(),
        check("numberPhone", "numberPhone is required").isMobilePhone(),
        check("message", "message is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() });
        }

        const { name, firstPersonName, email, numberPhone, message } = req.body;
        try {

            const newCompany = new Company({
                name, firstPersonName, email, numberPhone, message
            })
            const company = await newCompany.save();
            res.json(company);

        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server error");
        }

    }
);



//@route    GET /api/company
//@desc     Get all company
//@access   Public
router.get('/', authAdmin, async (req, res) => {

    try {
        company = await Company.find().sort({ date: -1 });
        return res.status(200).json(company);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server Error');
    }
});



module.exports = router;