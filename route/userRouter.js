let express = require("express");
var UserRouter = express.Router();
let userController = require("../controller/user/userController");
var bodyParser = require("body-parser");
UserRouter.use(bodyParser.json());
UserRouter.use(bodyParser.urlencoded({ extended: false }));
UserRouter.use(bodyParser.json());
const passport = require("passport");
const config = require("../middleware/googleAuth");
const Paymentstatus = require('../middleware/payment')




//user Home
UserRouter.get("/", userController.loadHome);

//error
UserRouter.get("/error", (req, res) => {
  res.render('user/Error.hbs', { error: "err" })
});

//Login
UserRouter.post('/login', userController.loginUser)
UserRouter.get("/login", userController.login);
UserRouter.get("/register", userController.register);

UserRouter.get("/details", userController.details);

//OTP and LOgin
UserRouter.post("/login/otp", userController.getOtp);
UserRouter.post("/home", userController.checkotp);
UserRouter.get("/resentotp", userController.resentOtp);
UserRouter.get("/login/resetpwd", userController.resetpwd);
UserRouter.get('/logout', userController.Logout)

// UserRouter.get("/cart", userController.cart);
//Products
UserRouter.get("/products", userController.products);
UserRouter.get("/women", userController.Womens);
UserRouter.get("/kid", userController.Kids);
// UserRouter.get("/cart/checkout", userController.checkout);
UserRouter.get('/success', userController.GoogleLogin)

//profile
UserRouter.get('/profile', userController.Profile)
UserRouter.get('/profile/editprofile', userController.EditProfile)
UserRouter.post('/profile/posteditprofile', userController.Posteditprofile)
UserRouter.get('/profile/wishlist', userController.WishList)
UserRouter.get('/profile/cart', userController.Cart)
UserRouter.get('/profile/newcart', userController.NewCart)

UserRouter.get('/profile/address', userController.Address)

UserRouter.post('/profile/newadd', userController.NewAddress)
UserRouter.get('/profile/newadd', userController.DeleteAdd)

UserRouter.get('/profile/changepsw', userController.changePsw)
UserRouter.get('/postchangepsw', userController.postNewpass)
UserRouter.get('/profile/checkout', userController.Checkout)
UserRouter.get('/profile/allorders', Paymentstatus.Checkstatus, userController.AllOrders)
UserRouter.get('/profile/deletecart', userController.DeleteCart)
UserRouter.get('/forgetpsw', userController.ForgetPsw)
UserRouter.post('/postforgetpsw', userController.postforgetPsw)
UserRouter.post('/postnewpsw', userController.Newpassword)
UserRouter.post('/updatepsw', userController.Updatepsw)
UserRouter.get('/profile/delete', userController.DeleteProfile)
//sorting.....
UserRouter.get("/new-arrival", userController.products);
UserRouter.get('/search', userController.Search)
//Cart............
UserRouter.get("/cart/cancelorder", userController.CancelOrder)


UserRouter.get('/product/user-wish-list', userController.ProductUserWishlist)
// Google auth
UserRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
UserRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error", successRedirect: "/success" }),

);



module.exports = UserRouter;
