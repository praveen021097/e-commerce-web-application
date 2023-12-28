const app = require("./index");
const connect = require("./configs/db");
require("dotenv").config({path:"src/configs/config.env"});
const cloudinary = require("cloudinary")

app.listen(process.env.PORT, async()=>{
    try{
        await connect();
        cloudinary.config({
            cloud_name:process.env.CLOUDINARY_NAME,
            api_key:process.env.CLOUDINARY_API_KEY,
            api_secret:process.env.CLOUDINARY_API_SECRET
        })
        console.log(`server is listening port ${process.env.PORT}`)
    }catch(err){
        console.log(err)
    }
});


