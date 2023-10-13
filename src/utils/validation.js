const { body, validationResult } = require('express-validator');
const User = require("../models/user.model")

const userValidationCredential = [
    body("name").not().isEmpty().isLength({ min: 4, max: 18 }).withMessage("name should not be less then 5 character"),
    body("email").isEmail().custom(async (value) => {
        const user = await User.findOne({ email: value });

        if (user) {
            throw new Error("email is already taken!")
        }
    }),
    
    body("password").isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character')
];

module.exports = userValidationCredential;