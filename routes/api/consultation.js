const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Consultation = require("../../models/Consultation");
require('dotenv').config();

//@route    POST api/consultation
//@desc     Test route
//@access   Public
router.post(
    "/",
    [
        check("name", "name is required").not().isEmpty(),
        check("email", "email is required").not().isEmpty(),
        check("numberPhone", "numberPhone is required").isMobilePhone(),
        check("contentName", "contentName is required").not().isEmpty(),
        check("message", "message is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() });
        }

        const { name, email, numberPhone, contentName, message } = req.body;
        try {


            const newConsultation = new Consultation({
                name, email, numberPhone, contentName, message
            })
            const consultation = await newConsultation.save();
            res.json(consultation);

            
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server error");
        }

    }
);



module.exports = router;