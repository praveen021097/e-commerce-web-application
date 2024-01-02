const app = require("./index");
const connect = require("./configs/db");
require("dotenv").config();
const cloudinary = require("cloudinary")
const port =process.env.PORT || 5050
// uncaught error
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });

  connect()
  // Config

const server = app.listen(port, async()=>{
    try{
      
        cloudinary.config({
            cloud_name:process.env.CLOUDINARY_NAME,
            api_key:process.env.CLOUDINARY_API_KEY,
            api_secret:process.env.CLOUDINARY_API_SECRET
        })
        console.log(`server is listening port ${port}`)
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

