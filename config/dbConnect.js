const mongoose=require('mongoose')
 module.exports= function offDb(){


mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(() => console.log('Connected!'));
}
