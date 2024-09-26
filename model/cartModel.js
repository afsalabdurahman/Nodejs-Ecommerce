const mongoose = require("mongoose");
const Cart = new mongoose.Schema({
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User_schema",
    required: true,
  },
  quandity: {
    type: Number,
  },
  size: {
    type: String,
  },
  Date: {
    type: String,
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
    default: "Pending",
  },
  payment: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
  },
  TotalAmount: {
    type: Number,
  },
  Username: {
    type: String,
  },
  email: {
    type: String,
  },
  orderId: {
    type: String,
  },
  ReturnStatus: {
    type: String,
    enum: ["ReturnProcessing", "ReturnApprove"],

  },
  offer: {
    type: Number,
  },
  paymentMethod: {
    type: String,
    enum: ["wallet", "cod", "razorpay"]
  },
  offerAmount: {
    type: Number

  },
 
});
module.exports = mongoose.model("Cart", Cart);
