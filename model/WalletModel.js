const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentBalance: {
        type: Number,
        required: true,
        default: 0.0
    },
    transactions: [
        {

            date: { type: String, default: () => new Date().toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric'
            })},
            paymentStatus: {
                type: String,
                enum: ['Completed', 'Pending', 'Failed'],
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            debit: {
                type: Boolean,
                
            },
            credit: {
                type: Boolean,

            }
        }
    ]
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
