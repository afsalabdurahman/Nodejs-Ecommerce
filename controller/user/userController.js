let User_schema = require("../../model/userModel");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Product = require("../../model/productModel");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

loadHome = (req, res) => {
  if (req.session.user_id) {
    user = req.session.user_id
    res.render("user/index.hbs", { user: user });
  }
  else {
    res.render("user/index.hbs")
  }
};
// userData = (req, res) => {
//   if (req.session.user_id) {
//     userData=User_schema({_id:req.session.user_id})
//     res.redirect("/home");
//   }
//   res.redirect("/");
// };
login = (req, res) => {
  if (req.session.user_id) {
    res.redirect('/')
  } else {
    res.render("user/login.hbs", { log: true });
  }
};
let loginUser = async (req, res) => {
  try {


    email = req.body.email;
    const password = req.body.password
    console.log(password, "pass")
    existMail = await User_schema.findOne({ email: email })
    if (existMail) {
      const passwordMatch = await bcrypt.compare(password, existMail.password);
      req.session.user_id = existMail._id
      if (passwordMatch) {
        res.redirect('/')
      } else {
        res.render("user/login.hbs", { msg: "Password is not match" })
      }
    }
    else {
      res.render('user/login.hbs', { msg: "user not fount kindly register now" })
    }



  } catch (error) {
    console.log(error)

  }



}
register = (req, res) => {
  console.log(res.body);
  res.render("user/register.hbs", { reg: true });
};

getOtp = async (req, res) => {
  console.log(req.body);
  try {
    name = req.body.name;
    email = req.body.email;
    mobile = req.body.phoneNo;
    password = req.body.password;
    const existMail = await User_schema.findOne({ email: email });
    if (existMail) {
      res.render("user/login.hbs", { user: true });
    } else {
      req.session.userData = req.body;
      req.session.register = 1;
      req.session.email = email;
      otp = await generateOtp();
      req.session.otp = otp;
      console.log(otp);

      res.render("user/newOtp.hbs");
    }
  } catch (error) {
    console.log(error);
  }
};
checkotp = async (req, res) => {
  const userData = req.session.userData;
  console.log(req.session.otp, "sesion otp");
  fullOtp = req.body.one + req.body.two + req.body.three + req.body.four;
  console.log(fullOtp, "check otp");
  if (req.session.otp == fullOtp) {
    const secure_password = await securePassword(userData.password);
    const Userschema = new User_schema({
      name: userData.name,
      email: userData.email,
      mobile: userData.phoneNo,
      password: secure_password,
      image: "",
      isAdmin: 0,
      is_blocked: 1,
    });
    const dbUserdata = await Userschema.save();
    req.session.user_id = dbUserdata._id;
    console.log(req.session.user_id, "seion userid")
    res.rendirect("/");
  } else if ((req.session.opt = undefined)) {
    res.send("Session expaired");
  } else if (req.session.otp != fullOtp) {
    res.render("user/newOtp.hbs", { msg: "Please Enter Currect Otp" });
  } else {
    res.send("404 ");
  }
};
resentOtp = async (req, res) => {
  if (!userData) {
    res.status(400).json({ message: "Invalid or expired session" });
  } else {
    delete req.session.otp;
    otp = await generateOtp();
    req.session.otp = otp;
    console.log(otp, "new");
    res.render("user/newOtp.hbs", { msg: "please enter new otp" });
  }
};
resetpwd = (req, res) => {
  res.render("user/resetpwd.hbs");
};
cart = (req, res) => {
  res.render("user/cart.hbs");
};

const products = async (req, res) => {
  const products = await Product.find({
    $and: [
      { category: "6699057c3cefcb99d7d7fe63" },
      { is_listed: true }
    ]
  }).lean()
  console.log(products, "products")

  if (req.session.user_id) {
    user = req.session.user_id
    res.render("user/products.hbs", { user, products });
  }
  else {
    res.render("user/products.hbs", { products })
  }
};
const Womens = async (req, res) => {
  const products = await Product.find({
    $and: [
      { category: "669951b01934f70cb7148e6e" },
      { is_listed: true }
    ]
  }).lean()


  if (req.session.user_id) {
    user = req.session.user_id
    // const product_value = await Product.find({ category :})

    res.render("user/Products/women.hbs", { user, products });
  }
  else {
    res.render("user/Products/women.hbs", { products });
  }
};
const Kids = async (req, res) => {
  const products = await Product.find({
    $and: [
      { category: "669a10c1dfed884d9985a01c" },
      { is_listed: true }
    ]
  }).lean()
  if (req.session.user_id) {
    user = req.session.user_id


    res.render("user/Products/kid.hbs", { user, products, });
  }
  else {
    res.render("user/Products/kid.hbs", { products })
  }
};
wishlist = (req, res) => {
  res.render("user/wishlist.hbs");
};
checkout = (req, res) => {
  res.render("user/wishlist.hbs");
};
details = async (req, res) => {
  try {

    const id = req.query.id
    const productvalue = await Product.findById(id).lean();
    let Data = "";
    console.log(productvalue, "valueeeeeee")
    if (productvalue.category == "6699057c3cefcb99d7d7fe63") {
      Data = "6699057c3cefcb99d7d7fe63";
    } else if (productvalue.category == "669951b01934f70cb7148e6e") {
      Data = "669951b01934f70cb7148e6e"
    } else {
      Data = "669a10c1dfed884d9985a01c"
    }





    const Similar_product = await Product.find({ category: Data }).lean()
    let link = ""
    if (productvalue.category == "6699057c3cefcb99d7d7fe63") {
      link = "/products"
    } else if (productvalue.category == "669951b01934f70cb7148e6e") {
      link = '/women'
    } else {
      link = '/kid'
    }

    res.render("user/details.hbs", { productvalue, Similar_product, link });






  } catch (error) {
    console.log(error, "this is errrrr")
  }


};

const GoogleLogin = async (req, res) => {
  req.session.user_id = req.user._json
  console.log(req.session.user)
  if (req.user._json) {
    userData = {

      name: req.user._json.name,
      email: req.user._json.email
    }
    res.redirect("/");
  }


  else {
    res.send(not)
  }

}
const Logout = (req, res) => {
  req.session.destroy();
  res.redirect('/')
}
module.exports = {
  loadHome,
  login,
  register,
  details,
  Kids,
  Womens,
  GoogleLogin,
  Logout,
  // google,
  // registerOtp,
  checkotp,
  resetpwd,
  cart,
  products,
  wishlist,
  checkout,
  // userData,
  getOtp,
  resentOtp,
  loginUser
};

function generateOtp() {
  otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  return otp;
}
