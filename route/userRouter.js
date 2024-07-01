let express=require('express')
var UserRouter=express.Router()
let userController=require('../controller/user/userController')
var bodyParser = require('body-parser')
UserRouter.use(bodyParser.json());
UserRouter.use(bodyParser.urlencoded({ extended: false }))

UserRouter.get('/',userController.loadHome)

UserRouter.post('/',userController.userData)

UserRouter.get('/login',userController.login)

UserRouter.get('/register',userController.register)

UserRouter.get('/login/otp',userController.registerOtp)

UserRouter.post('/login/otp',userController.getOtp)

UserRouter.get('/login/resetpwd',userController.resetpwd)

UserRouter.get('/cart',userController.cart)

UserRouter.get('/products',userController.products)

UserRouter.get('/wishlist',userController.wishlist)
UserRouter.get('/cart/checkout',userController.checkout)

module.exports=UserRouter;