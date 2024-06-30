let express=require('express')
var UserRouter=express.Router()



UserRouter.get("/",(req,res)=>{
 res.render("user/index.hbs")
  
})
module.exports=UserRouter;