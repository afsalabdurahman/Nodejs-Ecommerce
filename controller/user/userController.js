

loadHome=(req,res)=>{
    
    res.render("user/index.hbs")
}
userData=(req,res)=>{
    console.log(req.body)
    res.redirect('/')
}
login=(req,res)=>{
    res.render("user/login.hbs",{log:true})
}
register=(req,res)=>{
    console.log(res.body)
    res.render("user/register.hbs",{log:true})
}
registerOtp=(req,res)=>{
    try{

    
    name=req.body.name;
    email=req.body.email;
    phonNo=req.body.phoneNo;
    password=req.body.password;
    
    res.render("user/otp.hbs",{log:true})
}catch (err){
    console.log(err)
}
}
getOtp=(req,res)=>{
    res.redirect('/login/otp')
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
userData,
getOtp



}