const mongoose = require("mongoose")
const ReturnOrders = new mongoose.Schema({
    OrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart', required: true,
    },
    Date: {
        type: String,

    },
    RefundAccholderName: {
        type: String
    },
    RefundAccName: {
        type: String
    },
    RefundAccNumber: {
        type: String
    },
    RefundAccIFSC: {
        type: String
    },

    ReturnReason: {
        type: String
    },
    ReturnOption: {
        type: String,
        enum: ["refund", "replacement"],

    }


})
module.exports = mongoose.model("ReturnOrders", ReturnOrders)