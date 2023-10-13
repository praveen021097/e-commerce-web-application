
const User = require("../models/user.model");
const { body, validationResult } = require('express-validator');
const sendEmail = require("../utils/sendEmail")
//get all users
exports.getAllUsers = async (req, res,next) => {
    try {
        const users = await User.find().lean().exec();
        return res.status(200).send(users)
    } catch (err) {
        return res.status(500).send({ err, message: "something went wrong" })
    }
}

// router.post("", body("name").not().isEmpty().isLength({ min: 4, max: 18 }).withMessage("name should not be less then 5 character"), body("email").isEmail().custom(async (value) => {
//     const user = await User.findOne({ email: value });
    
//     if (user) {
//         throw new Error("email is already taken!")
//     }
// }), body("password").isLength({ min: 8 })
//     .withMessage('Password must be at least 8 characters long')
//     .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)
//     .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'),
//      async (req, res) => {
//         try {

//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).send({ errors: errors.array() })
//             }

//            const user = await User.create(req.body);
//            console.log("hi")
//             return res.status(201).send(user)
//         } catch (err) {
//             return res.status(500).send({ err, message: "something went wrong" })
//         }
//     })

exports.deleteUser =  async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id).lean().exec();
        return res.status(200).send(user)
    } catch (err) {
        return res.status(500).send({ err, message: "something went wrong" })
    }
}
exports.getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean().exec();
        return res.status(200).send(user)
    } catch (err) {
        return res.status(500).send({ err, message: "something went wrong" })
    }
}

exports.updateUser =  async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().exec();
        return res.status(202).send(user)
    } catch (err) {
        return res.status(500).send({ err, message: "something went wrong" })
    }
}

//logout user
exports.logout = async(req,res,next)=>{
    try{
           await res.cookie("token",null,{expires:new Date( Date.now()),
                httpOnly:true,

            })
            return res.status(200).send({
                success:true,
                message:"logged out"
            })
    }catch(err){
            return res.status(500).send({message:"something went wrong!"})
    }
}

exports.forgotPassword = async(req,res,next)=>{
    
            const user = await User.findOne({email:req.body.email});
            if(!user){
                return res.status(404).send({message:"user not found!"})
            }
            const resetToken = user.getResetPasswordToken();
            await user.save({validateBeforeSave:false});
            const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
            const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nif you have not requested this mail please ignore it`
       try{
                await sendEmail({
                    email:user.email,
                    subject:"e-commerce password recovery ",
                    message:message
                })
                return res.status(200).send({message:`Email send to ${user.email} successfully!`})
       }catch(err){
            user.resetPasswordToken=undefined;
            user.resetPasswordExpire=undefined;

            await user.save({validateBeforeSave:false});
            return res.status(500).send({message:err.message})
        }
}