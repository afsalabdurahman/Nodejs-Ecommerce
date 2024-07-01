

loadHome=(req,res)=>{
    res.render("user/index.hbs")
}

login=(req,res)=>{
    res.render("user/login.hbs",{log:true})
}
register=(req,res)=>{
    res.render("user/register.hbs",{log:true})
}
registerOtp=(req,res)=>{
    res.render("user/otp.hbs",{log:true})
}
resetpwd=(req,res)=>{
    res.render('user/resetpwd.hbs')
}
cart=(req,res)=>{
    res.render('user/cart.hbs')
}
products=(req,res)=>{
    res.render('user/products.hbs')
}
wishlist=(req,res)=>{
    res.render('user/wishlist.hbs')
}
checkout=(req,res)=>{
    res.render('user/wishlist.hbs')
}


module.exports={
loadHome,
login,
register,
registerOtp,
resetpwd,
cart,
products,
wishlist,
checkout,



}