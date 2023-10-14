const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please Enter product name"] },
    description: { type: String, required: [true, "Please enter description"] },
    price: {
        type: Number,
        required: [true, "Please enter price"],
        masLength: [8, "Price cannot exceeded 8 characters "]
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: { type: String, required: true }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter product Category"]
    },
    stocks: {
        type: Number,
        required: [true, "Please enter product Stock"],
        maxLength: [4, "Stocks cannot exceed 4 characters"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            userId:{
                type: mongoose.Schema.ObjectId,
                ref:"user",
                required:true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    userId:{
        type: mongoose.Schema.ObjectId,
        ref:"user",
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model("product", productSchema);