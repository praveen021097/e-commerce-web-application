const express = require("express");

const Product = require("../models/product.model");
const Order = require("../models/order.model");

exports.newOrder = async (req, res, next) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            userId:req.user._id
          
        })
        return res.status(201).send({
            success: true,
            order
        })
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
}

//get single order admin
exports.getSingleOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
      
        if (!order) {
            return res.status(404).send({ message: "order not found with this id" });
        }

        return res.status(200).send({
            success: true,
            order,
        })
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
}

//get logged in user order
exports.myOrders = async(req, res, next) => {
    try {
        
        const orders = await Order.find({userId:req.user._id})

        return res.status(200).send({
            success: true,
            orders,
        })
    } catch (err) {

        return res.status(500).send({ message: "something went wrong!" })
    }
}

//get All orders admin

exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().lean().exec();
        let totalAmount = 0;
        orders.forEach((order) => {
            totalAmount += order.totalPrice
        });

        return res.status(200).send({
            success: true,
            totalAmount,
            orders,
        })
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
}

//update order status admin
exports.updateOrderStatus = async (req, res, next) => {
    try {

        const order = await Order.find({_id:req.params.id}).lean().exec();
        if (order.orderStatus === "Delivered") {
            return res.status(400).send({ message: "you have already delivered this order" })
        }

        order.orderItems.forEach(async (ord) => {
            
            await updateStock(ord.product, order.quantity);
        })
        

        order.orderStatus = req.body.status;
        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();

        }
        await order.save({ validateBeforeSave: false });

        return res.status(200).send({ success: true })
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
}

//update stack admin

async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false })
}

//delete order admin
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById({_id:req.params.id}).lean().exec();
        
        if (!order) {
            return res.status(404).send({ message: "order not found with this id" });
        }
        await Order.findByIdAndDelete({_id:req.params.id});
        return res.status(200).send({
            success: true,
            
        })
    } catch (err) {
        return res.status(500).send({ message: "something went wrong!" })
    }
}