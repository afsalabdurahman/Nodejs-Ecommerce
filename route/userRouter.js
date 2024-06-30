let express=require('express')
var UserRouter=express.Router()



UserRouter.get("/",(req,res)=>{
 res.render("user/index.hbs")
  
})
UserRouter.get('/login',(req,res)=>{
    res.render("user/login.hbs",{log:true})
})
UserRouter.get('/register',(req,res)=>{
    res.render("user/register.hbs",{log:true})
})
UserRouter.get('/register/otp',(req,res)=>{
    res.render("user/otp.hbs",{log:true})
})
UserRouter.get('/login/resetpwd',(req,res)=>{
    res.render('user/resetpwd.hbs')
})
UserRouter.get('/cart',(req,res)=>{
    res.render('user/cart.hbs')
})
UserRouter.get('/products',(req,res)=>{
    res.render('user/products.hbs')
})
UserRouter.get('/wishlist',(req,res)=>{
    res.render('user/wishlist.hbs')
})
UserRouter.get('/cart/checkout',(req,res)=>{
    res.render('user/checkout.hbs')
})
module.exports=UserRouter;