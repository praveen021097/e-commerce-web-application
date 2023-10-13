const jwt = require("jsonwebtoken");
const User = require("../models/user.model")
require("dotenv").config();

const verifyToken =(token) => {

    return new Promise((resolve, reject) => {
    
        var decoded = jwt.verify(token, process.env.SECRET_KEY_TOKEN, (err, decoded) => {
            if (err) {
                reject(err)
            }
           
            resolve(decoded)
        })
       
    })
}

const authenticate = async (req, res, next) => {


    if (!req.headers.authorization) {
        console.log("hello")
        return res.status(400).send({ message: "authorization token not found!" })
    }
    if (!req.headers.authorization.startsWith("Bearer ")) {
        return res.status(400).send({ message: "authorization token not found!" })
    }

    // const token = req.headers.authorization.trim().split(" ")[1];
 const {token} = req.cookies;
    let decoded;
    try {
        decoded = await verifyToken(token);
        
    } catch (err) {
        return res.status(400).send({ message: "authentication token not found! 37" })
    }

    req.user = await User.findById(decoded.id);
    return next()
}

const authorizeRole = (...roles)=>{
        return (req,res,next)=>{
            console.log(roles)
               console.log(req.user.role)
                if(!roles.includes(req.user.role)){
                    return res.status(403).send({message:`Role ${req.user.role} is not allowed to access this resource!`})
                }
              return  next();
          

        }
}
module.exports = {authenticate,authorizeRole};