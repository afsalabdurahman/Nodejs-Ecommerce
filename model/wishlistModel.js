const mongoose = require("mongoose")
const Wishlist = new mongoose.Schema({
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', required: true,
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_schema', required: true,
    },
  

})
module.exports = mongoose.model("Wishlist", Wishlist)