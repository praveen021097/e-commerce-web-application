const express = require("express");
const Product = require("../models/product.model");
const ApiFeatures = require("../utils/apifeatures");
const router = express.Router();
// get All Products
exports.getAllProducts =  async (req, res) => {
    try {
        const resultPerPage = 5;
        const totalPages =Math.ceil((await Product.find().countDocuments())/resultPerPage);
        const totalProducts = await Product.find().countDocuments();
        const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage); 
        const products = await apiFeature.query;
        if(products.length==0){
            return res.status(200).send({products,message:"no products"})
        }
        // const products = await Product.find().lean().exec();
        return res.status(200).send({products,totalPages,totalProducts})
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
};
// post products --Admin
 exports.createProduct = async (req, res,next) => {
    try {
        console.log("fhgfghfh",req.user.id)
        req.body.userId = req.user.id;
        const product = (await Product.create(req.body));
        return res.status(201).send(product)
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
};

// // update product --Admin
 exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(500).send("productNotFound")
        }
        product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().exec();
        return res.status(201).send({ status: true, product })
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
};


// //get one products by id
exports.getSingleProduct = async (req, res,next) => {
    try {
        const product = await Product.findById(req.params.id).lean().exec();
        return res.status(200).send(product)
    } catch (err) {
        return res.status(500).send({ err, message: "something went wrong!" })
    }
};

// //delete product 
 exports.deleteProduct = async (req, res,next) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id).lean().exec();
        return res.status(200).send(product)
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
};

// module.exports = router;