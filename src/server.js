const app = require("./index");
const connect = require("./configs/db");
require("dotenv").config();
const cloudinary = require("cloudinary")

// uncaught error
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });

  connect()
  // Config

const server = app.listen(process.env.PORT, async()=>{
    try{
      
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

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });

