const express = require("express");

const Product = require("../models/product.model");
const Order = require("../models/order.model");

exports.newOrder =async(req,res,next)=>{
    try {
        const {
                shippingInfo,
                orderItems,
                paymentInfo,
                ItemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
        } =req.body;

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user:req.user._id
        })
        return  res.status(201).send({
            success:true,
            order
        })
    } catch (err) {
        return  res.status(500).send({message:"something went wrong!"})
    }
}

//get single order 
exports.getSingleOrder = async(req,res,next)=>{
    try {
        const order= await Order.findById(req.params.id).populate({path:"user",select:["name","email"]});

        if(!order){
            return res.status(404).send({message:"order not found with this id"});
        }

        return res.status(200).send({success:true,
        order,})
    } catch (err) {
        return res.status(500).send({message:"something went wrong!"})
    }
}

//get logged in user order
exports.myOrders = async(req,res,next)=>{
    try {
        const orders= await Order.find(req.user._id)

    

        return res.status(200).send({success:true,
        orders,})
    } catch (err) {
        return res.status(500).send({message:"something went wrong!"})
    }
}