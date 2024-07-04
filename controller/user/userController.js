let User_schema=require('../../model/userModel')
// let maile=require('../../config/mail2')
const bcrypt = require("bcrypt");
const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  };
  




let otp=require('../../config/mailer')

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
 
// registerOtp=(req,res)=>{
//     console.log(req.body)
//     try{

    
//     name=req.body.name;
//     email=req.body.email;
//     phonNo=req.body.phoneNo;
//     password=req.body.password;
    
    
//     res.render("user/otp.hbs",{log:true})
// }catch (err){
//     console.log(err)
// }
// }
// getOtp= async(req,res)=>{
//     console.log(req.body)
//     try{
//         name= req.body.name;
//         email= req.body.email;
//         mobile= req.body.phoneNo;
//         password=req.body.password;
// const existMail=await User_schema.findOne({email:email})
// if(existMail){
//  res.redirect('/login')
// }else{
//     req.session.userData = req.body;
//     req.session.register = 1;
//     req.session.email = email;
//     data=maile.sentVerificationMail(req,req.session.email)
//   console.log(data)
//   res.render('user/otp.hbs')}
  
// }

//         // const Userschema= new User_schema({
//         //     name: req.body.name,
//         //     email: req.body.email,
//         //     mobile: req.body.phoneNo,
//         //     password:req.body.password,
//         //     image:'',
//         //     isAdmin: 0,
//         //     is_blocked: 1,
//         //   });
//         //   Userschema.save();


   
//     catch (err){
//         console.log(err)
//     }
// }
getOtp= async(req,res)=>{

    
    console.log(req.body)
  try {
    name= req.body.name;
        email= req.body.email;
        mobile= req.body.phoneNo;
         password=req.body.password;
         const existMail=await User_schema.findOne({email:email})
         if(existMail){
            res.render('user/login.hbs',{user:true})
         }else{
            req.session.userData = req.body;
              req.session.register = 1;
                 req.session.email = email;
                otp().then((e)=>{
                    console.log(e,"otp")
                    req.session.otp=e
                })
                
               
               res.render('user/otp.hbs')}
         }
   catch (error) {
    console.log(error)
  }
  

    res.render('user/otp.hbs')
}
checkotp= async(req,res)=>{


   const userData=req.session.userData
   console.log(req.session.otp,"sesion otp")
   fullOtp=req.body.one+req.body.two+req.body.three+req.body.four
    console.log(fullOtp,"check otp")
    if(req.session.otp==fullOtp){
        const secure_password = await securePassword(userData.password);
     const Userschema= new User_schema({
         name: userData.name,
         email: userData.email,
         mobile: userData.phoneNo,
         password:secure_password,
         image:'',
         isAdmin: 0,
         is_blocked: 1,
       });
     const dbUserdata= await Userschema.save();
     req.session.user_id = dbUserdata._id;
     console.log(dbUserdata)
     res.render('user/index.hbs',{user:userData})
    }

else if(req.session.opt=undefined){
    res.send("Session expaired")

} else if(req.session.otp!=fullOtp){
    res.send("wrong otp")
}
    else {
        res.send("404 ")
    }
}
resentOtp=(req,res)=>{
if(!userData){
    res.status(400).json({ message: "Invalid or expired session" });
}else

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
details=(req,res)=>{
    res.render('user/details.hbs')
}

module.exports={
loadHome,
login,
register,
details,
// registerOtp,
checkotp,
resetpwd,
cart,
products,
wishlist,
checkout,
userData,
getOtp,
resentOtp



}

generateOtp= async()=>{
    try {
        const otp = `${Math.floor(1000+Math.random()*9000)}`
    } catch (error) {
        
    }
}