const User = require("../models/user.model");

require("dotenv").config()
const { validationResult } = require('express-validator');


const register = async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() })
        }
        let user = await User.findOne({ email: req.body.email });
       
        if (user) {
            return res.status(400).send("user already exists!")
        }

        user = await User.create(req.body);
        const token =await user.generateToken()
       
       
    return res.status(201).cookie('token', token, {expires:new Date(Date.now() + process.env.TOKEN_EXPIRE * 24 * 60 * 60 * 1000), httpOnly: true }).send({
        success:true,
        user,
        token
    })
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
}

const login = async (req, res) => {
    try {

        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).send({message:"enter email and password !"})
        }
        let user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).send({ message: "wrong email or user not exists !" })
        }
        console.log("hihihi",req.body.password)
        const match =await  user.checkPassword(req.body.password);
       
        
        if (!match) {
            return res.status(400).send({ message: "wrong password!" })
        }
        const token =await  user.generateToken()
       
       
    return res.status(201).cookie('token', token, {expires:new Date(Date.now() + process.env.TOKEN_EXPIRE * 24 * 60 * 60 * 1000), httpOnly: true }).send({
        success:true,
        user,
        token
    })
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
}
module.exports = { register, login }