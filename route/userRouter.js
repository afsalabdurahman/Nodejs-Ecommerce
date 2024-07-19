let express = require("express");
var UserRouter = express.Router();
let userController = require("../controller/user/userController");
var bodyParser = require("body-parser");
UserRouter.use(bodyParser.json());
UserRouter.use(bodyParser.urlencoded({ extended: false }));
UserRouter.use(bodyParser.json());
const passport = require("passport");
const config = require("../middleware/googleAuth");


//user Home
UserRouter.get("/", userController.loadHome);

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

UserRouter.get("/cart", userController.cart);
//Products
UserRouter.get("/products", userController.products);
UserRouter.get("/women", userController.Womens);
UserRouter.get("/kid", userController.Kids);
UserRouter.get("/wishlist", userController.wishlist);
UserRouter.get("/cart/checkout", userController.checkout);
UserRouter.get('/success', userController.GoogleLogin)


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
