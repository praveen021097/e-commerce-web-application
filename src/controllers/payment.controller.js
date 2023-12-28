require("dotenv").config({path:"src/configs/config.env"});
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

 exports.processPayment = async(req,res)=>{
    try {
        console.log("ji",process.env.STRIPE_SECRET_KEY)
        const myPayment = await stripe.paymentIntents.create({
            amount:req.body.amount,
            currency:"inr",
            metadata :{
                company:"e-commerce",
            }
        });
        
        return res.status(200).send({
            success:true,
            client_secret:myPayment.client_secret
        })
    } catch (err) {
        return res.status(500).send(err.message)
    }


 }

 exports.sendStripeApiKey = async(req,res)=>{
    try{
            res.status(200).send({stripeApiKey:process.env.STRIPE_API_KEY})
    }catch(err){
        return res.status(500).send("something went wrong!")
    }

 }