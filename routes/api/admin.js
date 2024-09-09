const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const Order = require("../../models/Order");
const Actor1 = require("../../models/Actor1");
const Admin = require("../../models/Admin");
require('dotenv').config();

const auth = require('../../middleware/auth')

//@route    POST api/admin/auth
//@desc     Test route
//@access   Public
router.post(
    "/auth",
    [
        check("numberPhone", "Please include a valid phone number").isMobilePhone(),
        check("password", "Password is required").exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() });
        }

        const { numberPhone, password } = req.body;
        try {
            let actor = await Admin.findOne({ numberPhone });

            if (!actor) {
                return res
                    .status(402)
                    .json({ errors: [{ msg: "Invalid Credentials 1" }] });
            }

            const isMatch = await bcrypt.compare(password, actor.password)
            if (!isMatch) {
                return res.status(403).json({ errors: [{ msg: 'Invalid Credentials 2' }] })
            }

            
            const payload = {
                actor1: {
                    id: actor.id,
                },
            };

            jwt.sign(
                payload,
                process.env.jwtSecret  || "mysecrettoken",
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server error");
        }

    }
);




//register
//@route    POST api/admin/register
//@desc     Register admin
//@access   Public
//firstName/lastName/birthday/professionalCardNumber/judicialCouncil/role
router.post(
    "/register",
    [
        check("name", "name is required").not().isEmpty(), //To be there and not empty  
        check("numberPhone", "Please include a valid phone number").isMobilePhone(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Please enter a password with 6 or more char").isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, numberPhone } = req.body;
        try {
            let actor1 = await Admin.findOne({ numberPhone });

            if (actor1) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Actor1 already exists" }] });
            }

            actor1 = new Admin({
                name, email, password, numberPhone
            });

            const salt = await bcrypt.genSalt(10);

            actor1.password = await bcrypt.hash(password, salt);

            await actor1.save(); // Await saving the actor1 document

            const payload = {
                actor1: {
                    id: actor1.id,
                },
            };

            jwt.sign(
                payload,
                process.env.jwtSecret  || "mysecrettoken",
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ error: err.message });
        }

    }
);




module.exports = router;
