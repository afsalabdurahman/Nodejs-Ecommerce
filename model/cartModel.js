const mongoose = require("mongoose")
const Cart = new mongoose.Schema({
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', required: true,
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_schema', required: true,
    },
    quandity: {
        type: Number,

    },
    size: {
        type: String,

    },
    Date: {
        type: Date,
        default: Date.now,
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    payment: {
        type: Number,
        default: 0,
    },
    address: {
        type: String
    },
    TotalAmount: {
        type: Number,
    }

})
module.exports = mongoose.model("Cart", Cart)