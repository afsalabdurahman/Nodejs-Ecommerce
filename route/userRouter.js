let express=require('express')
var UserRouter=express.Router()



UserRouter.get("/",(req,res)=>{
 res.render("user/index.hbs")
  
})
UserRouter.get('/login',(req,res)=>{
    res.render("user/login.hbs",{log:true})
})
module.exports=UserRouter;