const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    minimumAmount: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    validity: {
        type: String,
        required: true,
    },
    usedCoupons: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User_schema',
            },
            status: {
                type: Boolean,
                default: false,
            },
        },
    ],
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
