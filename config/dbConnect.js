const mongoose = require('mongoose');

connectDb=()=>{
    try{
        connect=mongoose.connect("mongodb://localhost:27017/e-commerce")
        console.log("Database Connected")
    }catch (err){
        console.log(err)
    }
}
module.exports=connectDb;