const mongoose = require('mongoose');
const Cart1 = require('../model/newcartModel')
// Order Schema
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the User model
        required: true
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart1', // Refers to the Cart1 model (your cart schema)
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Refers to the Product model
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        update: {
            type: String,
            required: true,
            enum: ['Pending', 'Processing', 'Cancelled', 'Return', 'Deliverd', 'Approve Return', 'Shipped'] // Available sizes
        },
        offerPersonatge: {
            type: Number
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ['Pending', 'Processing', 'Failed', "Completed"]
}}],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'RazorPay', 'COD', 'Wallet'],
        required: true
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        state: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['Pending', 'Faild', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    orderedAt: {
        type: String, default: () => new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        })

    },
    filterDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate:
    {
        type: String, default: () => new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
    }
    ,
    OrderId: {
        type: String,
    },
    PaymentStatus: {
        type: String,
        enum: ['Pending', 'Completed'],

    }
});

// Pre-save hook to set total amount from cart
orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const Cart1 = mongoose.model('Cart1');

        // Find the cart by its ID
        const cart = await Cart1.findById(this.cartId);

        if (!cart) {
            return next(new Error('Cart not found'));
        }
        this.items = cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
            update: item.update,
            offerPersonatge: item.offerPersonatge,
            paymentStatus:item.paymentStatus
        }));


        // Set total amount from the cart
        this.totalAmount = cart.totalPrice;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;