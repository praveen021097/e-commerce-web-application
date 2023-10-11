const express = require("express");
const productController = require("./controllers/productController");
const app = express();
app.use(express.json());
app.use("/products",productController);
//error middlewares

module.exports = app;
