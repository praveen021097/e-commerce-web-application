const express = require("express");
const { register, login } = require("./controllers/auth.controller");
const userValidationCredential = require("./utils/validation");
const productRoute = require("./routes/product.route");
const userRoute = require("./routes/user.route");
const orderRoute = require("./routes/order.route");
const cookieParser = require("cookie-parser")
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.post("/api/v1/register", userValidationCredential, register);
app.post("/api/v1/login", login);

//error middlewares

module.exports = app;
