const mongoose = require("mongoose");

const Product = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      brand:{
        type:String,
          required:true
        },
    
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',  required: true,
        },
      price:{
        type:Number, 
        required:true
      },
     
      stock:{
        type:Number, 
        required:true
      },
      discount_price:{
        type:Number, 
        required:true
      },
     
      image:[{
        type:String,
        required:true
    }],
      is_listed:{
        type:Boolean,
        default:true
    },
    isVisible:{
      type:Boolean,
      default:true
  }
 
});


module.exports = mongoose.model('Product', Product);