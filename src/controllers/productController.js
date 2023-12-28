const express = require("express");
const Product = require("../models/product.model");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
// get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const resultPerPage = 8;
        const totalPages = Math.ceil((await Product.find().countDocuments()) / resultPerPage);
        const totalProducts = await Product.find().countDocuments();
        const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);

        let products = await apiFeature.query;

        let filterProductCount = products.length;
        if (products.length === 0) {
            return res.status(200).send({ message: "no products" })
        }

        return res.status(200).send({ products, totalPages, totalProducts, resultPerPage, filterProductCount })
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
};
//get all products for admin
exports.getAllAdminProducts = async (req, res) => {
    try {
        const products = await Product.find().lean().exec();

        if (products.length === 0) {
            return res.status(200).send({ message: "no products" })
        }

        return res.status(200).send(products)
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
};
// post products --Admin
exports.createProduct = async (req, res, next) => {
    try {

        let images = [];
        if (typeof req.body.images === "string") {
            images.push(req.body.images)
        }
        else {
            images = req.body.images;
        }
        const imagesLinks = [];
        let result;
        for (let i = 0; i < images.length; i++) {
            result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            })
        };
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        })
        req.body.images = imagesLinks;
        req.body.userId = req.user.id;
        const product = await Product.create(req.body);
        return res.status(201).send({
            success: true,
            product,
        })
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
};

// // update product --Admin
exports.updateProduct = async (req, res, next) => {
    try {

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send("productNotFound")
        }
        //images start here
        let images = [];

        if (typeof req.body.images === "string") {
            images.push(req.body.images)
        }
        else {
            images = req.body.images;
        }

        if (images !== undefined) {
            for (let i = 0; i < product.images.length; i++) {
                await cloudinary.v2.uploader.destroy(product.images[i].public_id)
            }

            const imagesLinks = [];
            let result;
            for (let i = 0; i < images.length; i++) {
                result = await cloudinary.v2.uploader.upload(images[i], {
                    folder: "products",
                })
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                })
            }
            req.body.images = imagesLinks;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().exec();
        return res.status(201).send({ status: true, product })
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
};


// //get one products by id
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).lean().exec();
        return res.status(200).send(product)
    } catch (err) {
        return res.status(500).send({ err, message: "something went wrong!" })
    }
};

// //delete product 
exports.deleteProduct = async (req, res, next) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id).lean().exec();
        if (!product) {
            return res.status(404).send({ message: "product not found !" })
        }

        //delete images from cloudinary
        for (let i = 0; product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }
        return res.status(200).send({ isDeleted: true })
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
};

// create new review or update review

exports.createProductReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;
        const review = {
            userId: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        }

        const product = await Product.findById(productId);

        const isReviewed = product.reviews.find((rev) => rev.userId.toString() === req.user._id.toString())

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.userId.toString() === req.user._id.toString()) {
                    (rev.rating = rating), (rev.comment = comment);
                }

            })
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        let avg = 0;
        product.rating = product.reviews.forEach((rev) => {
            avg += rev.rating;
        }) / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        return res.status(200).send({
            success: true,
            product
        })


    } catch (err) {
        return res.status(500).send({
            message: 'something went wrong!'
        })
    }
}

//get All reviews 

exports.getAllReviews = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.productId);

        if (!product) {
            return res.status(404).send({ message: "product not found" });

        }

        return res.status(200).send({
            success: true,
            reviews: product.reviews,
        })
    } catch (err) {
        return res.status(500).send({ message: 'something went wrong!' })
    }

}

//delete review

exports.deleteReview = async (req, res) => {
    try {
        const product = await Product.findById(req.query.productId);
        if (!product) {
            return res.status(404).send({ message: "product not found" });
        }

        const reviews = product.reviews.find((rev) => rev._id.toString() !== req.query.id.toString())

        let avg = 0;
        product.reviews.forEach((rev) => {
            avg += rev.rating;
        })

        const ratings = avg / (product.reviews.length - 1);
        const numOfReviews = product.reviews.length - 1;

        await Product.findByIdAndUpdate(req.query.productId, { reviews, rating: ratings, numOfReviews }, {
            new: true,
            runValidators: true,

        })
        return res.status(201).send({ success: true, message: "review deleted!" })
    } catch (err) {
        return res.status(500).send({ message: 'something went wrong!' })
    }
}