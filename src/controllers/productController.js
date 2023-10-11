const express = require("express");
const Product = require("../models/product.model");
const ApiFeatures = require("../utils/apifeatures");
const router = express.Router();
// get All Products
router.get("", async (req, res) => {
    try {
        const apiFeature = new ApiFeatures(Product.find(),req.query).search(); 
        const products = await apiFeature.query;
        if(products.length==0){
            return res.status(200).send({products,message:"no products"})
        }
        // const products = await Product.find().lean().exec();
        return res.status(200).send(products)
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
});
// post products --Admin
router.post("", async (req, res) => {
    try {
        const product = await Product.create(req.body);
        return res.status(201).send(product)
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
});

// update product --Admin
router.patch("/:id", async (req, res, next) => {
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
});


//get one products by id
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean().exec();
        return res.status(200).send(product)
    } catch (err) {
        return res.status(500).send({ err, message: "something went wrong!" })
    }
});

//delete product 
router.delete("/:id", async (req, res) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id).lean().exec();
        return res.status(200).send(product)
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
});

module.exports = router;