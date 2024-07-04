const mongoose = require("mongoose");

const Category= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    is_listed:{
        type:Boolean,
        defalut:true
    },
    is_deleted:{
        type:Boolean,
        defalut:true
    },

});
module.exports=mongoose.model("Category",Category)