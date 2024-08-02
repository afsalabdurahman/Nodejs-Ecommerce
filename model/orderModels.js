const mongoose = require("mongoose")
const Orders = new mongoose.Schema({
    AllOrderProducts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart', required: true,
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
    price: {
        type: Number,
        require: true
    }

})
module.exports = mongoose.model("Order", Orders)