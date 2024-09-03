const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    offerPercentage: {
        type: Number,
        required: true
    },

    validity: {
        type: String,
        required: true
    },

    status: {
        type: Number,
        default: 1,
    },

    type: {
        type: String,
        required: true
    },

    typeName: {
        type: String,
    }

})


module.exports = mongoose.model("Offer", offerSchema);