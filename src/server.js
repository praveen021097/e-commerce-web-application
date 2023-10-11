const app = require("./index");
const connect = require("./configs/db");
require("dotenv").config();


app.listen(process.env.PORT, async()=>{
    try{
        await connect();
        console.log(`server is listening port ${process.env.PORT}`)
    }catch(err){
        console.log(err)
    }
});


