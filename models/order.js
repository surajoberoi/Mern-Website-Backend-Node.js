const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema; // ObjectID is a unique id given to all the documents in the database.

const ProductCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product",
    },
    name: String,
    count: Number,
    price: Number
});

const ProductCart = mongoose.model("ProductCart",ProductCartSchema)

const OrderSchema = new mongoose.Schema({
    products: [ProductCartSchema],//array of product inside the cart
    transaction_id: {},
    amount: {type: Number},
    address: String,
    status:{
        type: String,
        default: "Received",
        enum: ["Cancelled","Delivered","Shipped","Processing","Received"]
    },
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"         //reference to the schema from which we are going to pull the ObjectID
        }
    },{timestamps: true});

const Order = mongoose.model("Order",OrderSchema)

module.exports = {Order,ProductCart}