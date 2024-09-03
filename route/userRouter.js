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
const Wallet = require("../model/WalletModel")
const Razorpay = require('razorpay');
const Coupens = require("../../e-commerce/model/CoupenModel")
const crypto = require('crypto');
const { AddCoupen } = require("../controller/admin/adminControlller");






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
//Whishlist
UserRouter.get('/profile/wishlist', userController.WishList)
UserRouter.get('/product/whishlist', userController.AddWishlist)
UserRouter.get('/deletewishlist', userController.DeleteWidhlist)

//profile
UserRouter.get('/profile', userController.Profile)
UserRouter.get('/profile/editprofile', userController.EditProfile)
UserRouter.post('/profile/posteditprofile', userController.Posteditprofile)

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
UserRouter.post('/profile/return', userController.ReturnProduct)
//sorting.....
UserRouter.get("/new-arrival", userController.products);
UserRouter.get('/search', userController.Search)
UserRouter.post('/products/filter', userController.Filters)
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

//RazorPay.....................
const razorpay = new Razorpay({
  key_id: process.env.RazorpayId,
  key_secret: process.env.RazorpayKey

});


//Razor///

UserRouter.post('/createOrder', async (req, res) => {
  console.log(process.env.RazorpayKey, "key")
  const { amount, currency, receipt } = req.body;
  console.log(req.body, "bodyy")
  const options = {
    amount: amount * 100, // amount in the smallest currency unit (e.g., paise for INR)
    currency: currency,
    receipt: receipt,
    // 1 for automatic capture, 0 for manual
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Razorpay verify
UserRouter.post('/verifyPayment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log(req.body, "vrifyyy")
  const hmac = crypto.createHmac('sha256', process.env.RazorpayId);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');
  1 ``
  if (generated_signature === razorpay_signature) {
    res.json({ status: "success" });
  } else {
    res.json({ status: "failure" });
  }
});

//Coupen update
UserRouter.get('/update/coupen', async (req, res) => {

  const coupon = await Coupens.findOne({
    code: req.query.code,
    usedCoupons: {
      $elemMatch: {
        userId: req.session.user_id,
        status: true
      }
    }
  });
  if (coupon) {
    res.status(400).json({ error: 'Invalid request parameter' });
  } else {




    const update = await Coupens.updateOne(
      { code: req.query.code }, // Query to find the document
      {
        $push: {
          usedCoupons: {
            userId: req.session.user_id,
            status: true
          }
        }
      }
    );
    res.json("updated")
    console.log(req.query.code, "quryyyy", req.session.user_id)
  }
})
// wallet..........

UserRouter.get('/profile/wallet', userController.Wallets)
UserRouter.get("/checkbalance", async (req, res) => {
  checkBalance = await Wallet.find({ userId: req.session.user_id })

  console.log(checkBalance[0].currentBalance, "balnce")
  console.log(req.query.amount, "quryy amt")
  console.log(checkBalance[0].currentBalance > req.query.amount, "comapre")
  if (checkBalance[0].currentBalance > req.query.amount) {
    res.status(200).json({ success: true });
  } else {
    return res.status(404).json({ failed: false });
  }
})
module.exports = UserRouter;
