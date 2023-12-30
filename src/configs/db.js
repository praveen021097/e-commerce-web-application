const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
     mongoose.connect(`${process.env.MONGO_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
     
      }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
      });
  
}

module.exports = connect;
