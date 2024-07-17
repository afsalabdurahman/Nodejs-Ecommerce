let express = require("express");
var UserRouter = express.Router();
let userController = require("../controller/user/userController");
var bodyParser = require("body-parser");
UserRouter.use(bodyParser.json());
UserRouter.use(bodyParser.urlencoded({ extended: false }));
UserRouter.use(bodyParser.json());
const passport = require("passport");
const config = require("../middleware/googleAuth");

UserRouter.get("/", userController.loadHome);

// UserRouter.post('/',userController.userData)
UserRouter.post('/login',userController.loginUser)

UserRouter.get("/login", userController.login);

UserRouter.get("/register", userController.register);

UserRouter.get("/details", userController.details);
// UserRouter.get('/login/otp',userController.registerOtp)

UserRouter.post("/login/otp", userController.getOtp);
UserRouter.post("/home", userController.checkotp);
UserRouter.get("/resentotp", userController.resentOtp);

UserRouter.get("/login/resetpwd", userController.resetpwd);

UserRouter.get("/cart", userController.cart);

UserRouter.get("/products", userController.products);
UserRouter.get("/women", userController.Womens);
UserRouter.get("/kid", userController.Kids);
UserRouter.get("/wishlist", userController.wishlist);
UserRouter.get("/cart/checkout", userController.checkout);

// Google auth
UserRouter.get("/success", (req, res) => res.send("welcome to route"));
UserRouter.get("/error", (req, res) => {
  res.send("Errrot");
});

UserRouter.get("/error", (req, res) => res.send("error logging in"));
// UserRouter.get('/auth/google',userController.google)
UserRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

UserRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    res.redirect("/success");
  }
);

module.exports = UserRouter;
