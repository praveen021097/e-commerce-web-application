const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// userSchema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    resetPasswordToken:{type:String,required:false},
    resetPasswordExpire:{type:Date,required:false}
}, {
    versionKey:false,
    timestamps:true
}) 

// user model
userSchema.pre("save",async function(next){
    console.log(this)
    const hashPassword = await bcrypt.hash(this.password,10);
    this.password = hashPassword;
      return next()
})

userSchema.methods.checkPassword=async function(password){
    console.log(password)
    return bcrypt.compareSync(password,this.password);
}
userSchema.methods.generateToken= function (){
    return jwt.sign({id:this._id},process.env.SECRET_KEY_TOKEN,{
        expiresIn:process.env.TOKEN_EXPIRE * 24 * 60 * 60 * 1000,
    });
}

//Generate Reset password token

userSchema.methods.getResetPasswordToken =function (){
        const resetToken = crypto.randomBytes(20).toString("hex");

        //hashing ans adding resetPasswordToken in userSchema 
        this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        return resetToken;
}

module.exports = mongoose.model("user",userSchema);