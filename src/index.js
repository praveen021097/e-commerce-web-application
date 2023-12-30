const express = require("express");
const { register, login } = require("./controllers/auth.controller");
const userValidationCredential = require("./utils/validation");
const dotenv = require("dotenv");
const productRoute = require("./routes/product.route");
const userRoute = require("./routes/user.route");
const orderRoute = require("./routes/order.route");
const paymentRoute = require("./routes/payment.route")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require('cors');

dotenv.config({path:"src/configs/config.env"})

const app = express();
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload())
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1",paymentRoute)
app.post("/api/v1/register", userValidationCredential, register);
app.post("/api/v1/login", login);


module.exports = app;
