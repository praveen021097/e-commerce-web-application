const mongoose = require("mongoose");

const connect = () => {
    return mongoose.connect("mongodb+srv://praveen7523017052:king979398@cluster0.zvofn6n.mongodb.net/")
}

module.exports = connect;
