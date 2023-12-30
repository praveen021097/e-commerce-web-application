const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
     mongoose.connect("mongodb+srv://praveen7523017052:king979398@cluster0.zvofn6n.mongodb.net/", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
     
      }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
      });
  
}

module.exports = connect;
