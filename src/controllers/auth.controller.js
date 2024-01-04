const User = require("../models/user.model");
const cloudinary = require("cloudinary");

require("dotenv").config();
const { validationResult } = require('express-validator');

// register user
const register = async (req, res) => {

    try {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        })


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() })
        }
        const { name, email, password } = req.body;
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).send("user already exists!")
        }

        user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        });
        const token = await user.generateToken()

        return res.status(201).cookie('token', token, { expires: new Date(Date.now() + process.env.TOKEN_EXPIRE * 24 * 60 * 60 * 1000), httpOnly: true }).send({
            success: true,
            user,
            token
        })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}
//login user
const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message: "enter email and password !" })
        }
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ message: "wrong email or user not exists !" })
        }
     
        const match = await user.checkPassword(password);

        if (!match) {
            return res.status(400).send({ message: "wrong password!" })
        }
        const token = await user.generateToken()


        return res.status(201).cookie('token', token, { expires: new Date(Date.now() + process.env.TOKEN_EXPIRE * 24 * 60 * 60 * 1000), httpOnly: true }).send({
            success: true,
            user,
            token
        })
    } catch (err) {
        return res.status(500).send({ message:err.message })
    }
}
module.exports = { register, login }