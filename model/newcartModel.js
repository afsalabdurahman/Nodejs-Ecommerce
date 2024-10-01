const mongoose = require('mongoose');

// Schema for items in the cart
const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Refers to the Product model
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    size: {
        type: String,
        required: true,
        enum: ['Small', 'Medium', 'Large', 'XL'] // Available sizes
    },
    color: {
        type: String,

    },
    price: {
        type: Number,
        required: true
    },
    update: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Cancel',] // Available sizes
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Failed', "Completed"]
    },
    offerPersonatge: {
        type: Number
    }
});

// Cart Schema
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the User model
        required: true
    },
    items: [cartItemSchema], // Array of cart items
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    totalItems: {
        type: Number,
        required: true,
        default: 0
    },
    updatedAt: {
        type: String, default: () => new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
    }
});

// Pre-save hook to calculate total price and total items
cartSchema.pre('save', function (next) {
    // Calculate total price and total items
    this.totalPrice = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.totalItems = this.items.reduce((acc, item) => acc + item.quantity, 0);
    next();
});

const Cart1 = mongoose.model('Cart1', cartSchema);

module.exports = Cart1;
