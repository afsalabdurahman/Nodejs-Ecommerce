let User_schema = require("../../model/userModel");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Product = require("../../model/productModel");
const Wishlist = require("../../model/wishlistModel");
const UserCart = require("../../model/cartModel");
const Orders = require("../../model/orderModels");
const { request } = require("../../route/adminRouter");




//PassWord Dcrypt..................................
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

//Loading Home Page........................................
loadHome = (req, res) => {
  if (req.session.user_id) {
    user = req.session.user_id;
    res.render("user/index.hbs", { user: user });
  } else {
    res.render("user/index.hbs");
  }
};

// Login Page..................................................
login = (req, res) => {
  if (req.session.user_id) {
    res.redirect("/");
  } else {
    res.render("user/login.hbs", { log: true });
  }
};

// Post Login Data.............................................
let loginUser = async (req, res) => {
  try {
    email = req.body.email;
    const password = req.body.password;
    existMail = await User_schema.findOne({ email: email });
    console.log(existMail, "existmail")
    if (existMail) {
      const passwordMatch = await bcrypt.compare(password, existMail.password);
      req.session.user_id = existMail._id;
      if (passwordMatch) {
        if (existMail.is_blocked) {
          res.redirect("/");
        } else {
          res.render("user/login.hbs", { msg: "User is Blocked ,Kidly Contact" });
        }

      } else {
        res.render("user/login.hbs", { msg: "Password is not match" });
      }
    } else {
      res.render("user/login.hbs", {
        msg: "User is not register yet, Kindly Register now!",
      });
    }
  } catch (error) {
    res.redirect('/error');
  }
};
// User Register Page      ....................................................
register = (req, res) => {
  console.log(res.body);
  res.render("user/register.hbs", { reg: true });
};
//  Post Register and Get OTP page...............................
getOtp = async (req, res) => {
  if (req.session.user_id) {
    res.redirect('/')
  } else {


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
      res.redirect("/error")
    }
  }
};
// Post OTP Details and Cheking ....................................
checkotp = async (req, res) => {
  const userData = req.session.userData;
  fullOtp = req.body.one + req.body.two + req.body.three + req.body.four;
  console.log(fullOtp, "OTP")
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
    res.redirect("/");
  } else if ((req.session.opt = undefined)) {
    res.send("Session expaired");
  } else if (req.session.otp != fullOtp) {
    res.render("user/newOtp.hbs", { msg: "Please Enter Correct OTP or Wait 30 minits after regenerate new OTP" });
  } else {
    res.redirect('/error')
  }
};

// Resent OTP page and Redirect to OTP page............................
resentOtp = async (req, res) => {

  const userData = req.session.userData;
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

// Reset Password..................--------.....................
resetpwd = (req, res) => {
  res.render("user/resetpwd.hbs");
};

// Cart Page .........................................
const cart = (req, res) => {
  res.render("user/cart.hbs");
};

// men product sort
const getSortedProducts = async (sortCriteria, pageno, count) => {
  const sortOptions = {
    lowprice: { price: 1 },
    highprice: { price: -1 },
    Az: { name: 1 },
  };
  const perPage = Math.round(count / 8)
  const pages = pageno || 1
  const sortOption = sortOptions[sortCriteria] || { _id: -1 };
  console.log(pageno, perPage, "page no ,perpage")
  return await Product.find({
    $and: [{ category: "6699057c3cefcb99d7d7fe63" }, { is_listed: true }],
  }).skip((pages - 1) * 8).limit(8).sort(sortOption).lean();
};


//men Products................
const products = async (req, res) => {
  if (req.query) {
    console.log(req.query.pageNo, "qury")
    let pageNumber = Number(req.query.pageNo)
    console.log(pageNumber, "page number")


    const docCount = await Product.countDocuments({
      $and: [{ category: "6699057c3cefcb99d7d7fe63" }, { is_listed: true }]
    });


    console.log(docCount, "count from doc")

    const products = await getSortedProducts(req.query.id, pageNumber, docCount);
    const renderOptions = { products };
    renderOptions.value = req.query.id

    let val = docCount / 8
    renderOptions.count = Math.ceil(val)
    console.log(renderOptions, "products")
    if (req.session.user_id) {
      renderOptions.user = user;
      renderOptions.value = req.query.id
      console.log(renderOptions, "from user")
    }

    res.render("user/products.hbs", renderOptions);
  }
};


// Womens Product Page...................................
///sort
const womenSortedProducts = async (sortCriteria, pageno, count) => {
  const sortOptions = {
    lowprice: { price: 1 },
    highprice: { price: -1 },
    Az: { name: 1 },
  };
  const perPage = Math.round(count / 8)
  const pages = pageno || 1
  const sortOption = sortOptions[sortCriteria] || { _id: -1 };
  console.log(pageno, perPage, "page no ,perpage")
  return await Product.find({
    $and: [{ category: "669951b01934f70cb7148e6e" }, { is_listed: true }],
  }).skip((pages - 1) * perPage).limit(8).sort(sortOption).lean();
};
///
const Womens = async (req, res) => {
  console.log("working")
  if (req.query) {
    console.log(req.query.pageNo, "qury")
    let pageNumber = Number(req.query.pageNo)
    console.log(pageNumber, "page number")


    const docCount = await Product.countDocuments({
      $and: [{ category: "669951b01934f70cb7148e6e" }, { is_listed: true }]
    });


    console.log(docCount, "count from doc")

    const products = await womenSortedProducts(req.query.id, pageNumber, docCount);
    const renderOptions = { products };
    renderOptions.value = req.query.id

    let val = docCount / 8
    renderOptions.count = Math.ceil(val)
    console.log(renderOptions, "products")
    if (req.session.user_id) {
      renderOptions.user = user;
      renderOptions.value = req.query.id
      console.log(renderOptions, "from user")
    }

    res.render("user/Products/women.hbs", renderOptions);
  }
};




// const Womens = async (req, res) => {
//   const products = await Product.find({
//     $and: [{ category: "669951b01934f70cb7148e6e" }, { is_listed: true }],
//   }).lean();

//   if (req.session.user_id) {
//     user = req.session.user_id;
//     res.render("user/Products/women.hbs", { user, products });
//   } else {
//     res.render("user/Products/women.hbs", { products });
//   }
// };

// Kids Product Page..........................................
const Kids = async (req, res) => {
  const products = await Product.find({
    $and: [{ category: "669a10c1dfed884d9985a01c" }, { is_listed: true }],
  }).lean();
  if (req.session.user_id) {
    user = req.session.user_id;
    res.render("user/Products/kid.hbs", { user, products });
  } else {
    res.render("user/Products/kid.hbs", { products });
  }
};

//Serach Product

const Search = async (req, res) => {
  try {
    const searchQuery = req.query.name;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    console.log(searchQuery, "name");

    const products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },

      ]
    }).lean();

    if (req.session.user_id) {
      user = req.session.user_id;
      res.render("user/Products/Search.hbs", { user, products });
    } else {
      res.render("user/Products/Search.hbs", { products });
    }


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching for products' });
  }
};


// Whish list.........................................


// Chekout Page........................................
checkout = (req, res) => {
  res.render("user/wishlist.hbs");
};

// Each products Details(Dynamically arrange)...................
details = async (req, res) => {
  try {


    console.log(req.query, "qury msg about quandity")

    let msg = {}
    let count = await UserCart.countDocuments({ $and: [{ UserId: req.session.user_id }, { orderStatus: "Pending" }] })
    if (count >= 5) {
      msg.message = "Cart is Full "
    }


    const id = req.query.id;
    const productvalue = await Product.findById(id).lean();
    let Data = "";
    console.log(productvalue.stock, "stock")
    if (productvalue.stock <= 0) {
      const updateVisibility = await Product.updateOne(
        { _id: id },
        { $set: { isVisible: false } }
      );

    } else {
      const updateVisibility = await Product.updateOne(
        { _id: id },
        { $set: { isVisible: true } }
      );
    }


    if (productvalue.category == "6699057c3cefcb99d7d7fe63") {
      Data = "6699057c3cefcb99d7d7fe63";
    } else if (productvalue.category == "669951b01934f70cb7148e6e") {
      Data = "669951b01934f70cb7148e6e";
    } else {
      Data = "669a10c1dfed884d9985a01c";
    }

    const Similar_product = await Product.find({ category: Data }).lean();
    let link = "";
    if (productvalue.category == "6699057c3cefcb99d7d7fe63") {
      link = "/products";
    } else if (productvalue.category == "669951b01934f70cb7148e6e") {
      link = "/women";
    } else {
      link = "/kid";
    }
    if (req.session.user_id) {


      user = req.session.user_id;
      res.render("user/details.hbs", { user, productvalue, Similar_product, link, msg, });
    } else {
      res.render("user/details.hbs", { productvalue, Similar_product, link })
    }

  } catch (error) {
    console.log(error, "this is errrrr");
  }
};

// Google Auth....for Login............................................................
const GoogleLogin = async (req, res) => {
  req.session.user_id = req.user._json;

  if (req.user._json) {
    userData = {
      name: req.user._json.name,
      email: req.user._json.email,
    };
    res.redirect("/");
  } else {
    res.send(not);
  }
};


// Logout Page.................................
const Logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};




//User-Profile............................
const Profile = async (req, res) => {
  try {
    if (req.session.user_id) {
      let user_id = req.session.user_id
      let user = await User_schema.findById(user_id).lean()

      res.render("user/Profile/profile.hbs", { user })

    } else (
      res.redirect('/')
    )






  } catch (error) {
    console.log(error)
  }



}
const EditProfile = async (req, res) => {
  try {

    if (req.session.user_id) {
      let user_id = req.session.user_id
      let user = await User_schema.findById(user_id).lean()



      res.render('user/Profile/EditProfile.hbs', { user })
    }
    else {
      res.redirect('/')
    }
  } catch (error) {
    console.log(error)
  }

}
const Posteditprofile = async (req, res) => {

  console.log(req.body, "bodysssssssssssssss", req.files, "files")
  const usernew = await User_schema.findByIdAndUpdate({ _id: req.session.user_id }, {
    $set: {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      gender: req.body.gender,
      location: req.body.location,
      address: req.body.address,
      dob: req.body.dob


    },

  }, { upsert: true }).lean()
  console.log(req.session.user_id, "usersessionid", usernew, "userNew")


  res.json({ name: "working" })

}


const WishList = (req, res) => {
  res.render('user/Profile/WishList.hbs', { user: true })
}
const Cart = async (req, res) => {
  try {
    console.log(req.query, "newqundityyyyyy")

    let Amount = req.query.price * req.query.quandity
    // console.log(Amount, "amtttt")
    user = req.session.user_id
    if (req.session.user_id && req.query.id) {


      let Product_in_Cart = await UserCart.findOne({ $and: [{ ProductId: req.query.id }, { UserId: req.session.user_id }, { orderStatus: "Pending" }, { size: req.query.size }] })
      //  console.log(Product_in_Cart, "incart")
      if (Product_in_Cart == null) {

        const Insert_into_Cart = new UserCart({
          ProductId: req.query.id,
          UserId: req.session.user_id,
          size: req.query.size,
          quandity: req.query.quandity,
          TotalAmount: Amount,
          orderStatus: "Pending"
        })

        const quantity = await Product.updateOne(
          { _id: req.query.id },
          { $inc: { stock: -req.query.quandity } }
        );
        //  console.log(quantity, "qundity")
        const insertedData = await Insert_into_Cart.save();
      }


      let count = await UserCart.countDocuments({ $and: [{ UserId: req.session.user_id }, { orderStatus: "Pending" }] })
      console.log(count, "count")
      if (count < 5) {

        let Datas = await UserCart.find({ $and: [{ UserId: req.session.user_id }, { orderStatus: "Pending" }] }).limit(5)
          .populate('ProductId')
          .lean()
        const totalPrice = Datas.reduce((sum, product) => sum + product.TotalAmount, 0);
        req.session.totalPrice = totalPrice
        console.log("Total Price:", totalPrice);
        res.render('user/Profile/Cart.hbs', { user, Datas, totalPrice })


      } else {
        res.redirect(`/details?id=${req.query.id}`)
      }
    }
    if (req.session.user_id) {

      let Datas = await UserCart.find({ $and: [{ UserId: req.session.user_id }, { orderStatus: "Pending" }] }).limit(5)
        .populate('ProductId')
        .lean()
      // console.log(Datas, "BbbbDtassa")

      const totalPrice = Datas.reduce((sum, product) => sum + product.ProductId.price, 0);
      req.session.totalPrice = totalPrice
      // console.log("Total Price:", totalPrice);
      res.render('user/Profile/Cart.hbs', { user, Datas, totalPrice })
    } else {
      res.send("user not found")
    }



  } catch (error) {
    console.log(error)
  }



}
const NewCart = (req, res) => {
  console.log(req.query, "new cart")
}


const Address = async (req, res) => {
  try {
    console.log(req.session.user_id)
    if (req.session.user_id) {
      user = req.session.user_id
      let add = await User_schema.findById({ _id: req.session.user_id }).lean()
      console.log(add, "adddddd")

      res.render('user/Profile/add.hbs', { user, add })
    } else {
      res.send("user not found")
    }
  } catch (error) {
    console.log(error)
  }

}
const NewAddress = async (req, res) => {
  try {
    console.log("post is working")
    console.log(req.query, "bodyyyyyy")

    const usernew = await User_schema.findByIdAndUpdate(
      req.session.user_id,  // Directly use the user ID
      {
        $set: {
          'address2': {  // Set the entire address2 object
            name: req.body.name,
            state: req.body.state,
            phone: req.body.mobile,
            city: req.body.city,
            zip: req.body.zip,
            address: req.body.address,
            email: req.body.email
          }
        }
      },
      { new: true, upsert: true }  // Return the updated document and upsert if it doesn't exist
    ).lean();

    console.log(usernew, "post request");

    if (req.body.id == "007") {
      res.redirect(`/profile/checkout?total=${req.body.price}`)
    } else {


      res.json({ msg: "success" })
      res.redirect("/profile/address")
    }

  } catch (error) {
    console.log(error)
  }
}
const DeleteAdd = async (req, res) => {
  try {
    console.log(req.query)
    if (req.session.user_id) {
      const usernew = await User_schema.findByIdAndUpdate(
        req.session.user_id,  // Directly use the user ID
        {
          $set: {
            'address2': {  // Set the entire address2 object
              name: null,

            }
          }
        },
        { new: true, upsert: true }  // Return the updated document and upsert if it doesn't exist
      ).lean();
    }
    res.redirect(`/profile/checkout?total=${req.query.price}`)
  } catch (error) {
    console.log(error);

  }
}
// const ChngeAddInCheckout = (req, res) => {
//   try {

//   } catch (error) {
//     console.log(error)
//   }
// }

const changePsw = (req, res) => {
  let msg = {}
  if (req.query.msg == "error") {
    msg.message = "invalid current Password"
  }

  res.render('user/Profile/changePsw.hbs', { user: true, msg })
}
const postNewpass = async (req, res) => {
  try {
    console.log(req.query, "quryyy")
    const password = req.query.newpss;
    console.log(req.query.currentpass, "cureennt pasw")

    if (req.session.user_id) {
      Existuser = await User_schema.findById(req.session.user_id);
      console.log(Existuser.password, "exise pswuser")
      const passwordMatch = await bcrypt.compare(req.query.currentpass, Existuser.password);
      console.log(passwordMatch, "matchinf")

      if (passwordMatch) {
        console.log("if match")

        const passwordHash = await bcrypt.hash(password, 10);

        console.log(passwordHash, "hashnew pass word")
        const updateNewPassword = await User_schema.updateOne(
          { email: Existuser.email },
          {
            $set: { password: passwordHash }
          }
        );
        res.json({ msg: "success" })
        // res.render('user/Profile/paswordChanged.hbs')
      } else {
        res.json({ error: "not match" })
      }


    } else {
      res.redirect('/error')
    }
  } catch (error) {
    res.redirect('/error')
  }

}

const Checkout = async (req, res) => {
  try {
    console.log(req.query, "quryyyyyy")
    user = req.session.user_id
    userData = await User_schema.findById({ _id: user }).lean()
    console.log(userData, "data from user")
    console.log(user, "user")
    let totalPrice = Number(req.query.total)
    let subtotal = totalPrice + 100;
    let discount = subtotal * 5 / 100
    let totalPriceTax = subtotal - discount
    console.log(subtotal, totalPriceTax, discount, "sub,", "finaltax", "discount,",)

    res.render('user/Profile/checkout.hbs', { user, userData, totalPrice, totalPriceTax })
  } catch (error) {
    res.redirect('/error')
  }
}
const AllOrders = async (req, res) => {
  try {
    console.log(req.query, "alllorders query")
    user = req.session.user_id
    if (user) {
      const Data = await UserCart.find({
        $and: [
          { UserId: user },
          { orderStatus: { $in: ["Processing", "Cancelled", "Shipped"] } }
        ]
      }).sort({ _id: -1 }).populate("ProductId").lean();
      console.log(Data, "datass from checkout")
      // Data1 = await User_schema.findById({ _id: user }).lean()

      res.render('user/Profile/AllOrders.hbs', { user, Data, })

    }


  } catch (error) {
    res.redirect('/error')
  }

}
const DeleteCart = async (req, res) => {
  console.log(req.query, "deklete")
  console.log(req.query.quandity, "qundity")


  const deletedCartItem = await UserCart.findOneAndDelete({ ProductId: req.query.id });
  console.log(deletedCartItem)
  const quantity = await Product.updateOne(
    { _id: req.query.id },
    { $inc: { stock: req.query.quandity } }
  );

  res.redirect('/profile/cart')
}

//user wishlist cart
const ProductUserWishlist = async (req, res) => {



  try {
    console.log(req.query.user_id)
    if (req.session.user_id) {

      const existProduct = await Product.findById({ _id: req.query.id });
      if (existProduct) {
        const existWishlist = await Wishlist.findOne({ ProductId: req.query.id, UserId: req.session.user_id })
        console.log(existWishlist, "Wishlist")
        if (!existWishlist) {


          const Wishlists = new Wishlist({
            ProductId: req.query.id,
            UserId: req.session.user_id


          });
          let Wishli = await Wishlists.save();

          res.redirect("/products")
        } else {
          res.send("already Exist")
        }

      } else {
        res.redirect('/error')
      }





      res.send("updated")
    } else {
      res.send("user not found")
    }

  } catch (error) {
    console.log(error)
  }


}


const ForgetPsw = (req, res) => {
  res.render('user/Profile/forgetpsw.hbs')
}
const postforgetPsw = async (req, res) => {
  try {
    email = req.body.email
    existMail = await User_schema.findOne({ email: email });
    if (existMail) {
      req.session.email = email
      otp = await generateOtp();
      req.session.otp = otp;
      console.log(otp);

      res.render("user/restOtp.hbs");
    } else {
      res.send("Kindly register ")
    }

  } catch (error) {
    res.redirect('/error')
  }

  console.log(req.body)
}
const Newpassword = async (req, res) => {
  try {
    fullOtp = req.body.one + req.body.two + req.body.three + req.body.four;
    console.log(fullOtp, "OTP")
    console.log(req.session.email, "emsilssssssss")
    if (req.session.otp == fullOtp) {
      res.render('user/Profile/forgetpsw1.hbs')
    } else {
      "wrong otp"
    }
  } catch (error) {
    console.log(error)
  }
}

const Updatepsw = async (req, res) => {
  try {
    const password = req.body.password;
    existMail = await User_schema.findOne({ email: email });
    console.log(password, "passwordssss", existMail)
    if (existMail) {
      const passwordHash = await bcrypt.hash(password, 10);
      const updateNewPassword = await User_schema.updateOne(
        { email: email },
        {
          $set: { password: passwordHash }
        }
      );
      console.log(updateNewPassword)
      res.redirect("/login")
    } else {
      res.send("no user")
    }


  } catch (error) {
    res.redirect('/error')

  }
}


const DeleteProfile = async (req, res) => {
  user = req.session.user_id
  const userData = await User_schema.updateMany({ _id: user }, { $unset: { address2: 1 } })
  console.log("eorking")
  res.redirect("/profile/address")
}

const CancelOrder = async (req, res) => {

  try {
    console.log(req.query.id, "qury id from cart")
    const prettyDate = new Date().toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',

      hour12: true,
    });
    const Data = await UserCart.updateOne({ _id: req.query.id }, {

      $set: {
        orderStatus: 'Cancelled',
        Date: prettyDate,
      }
    }, { upsert: true })

    res.redirect('/profile/allorders')

  } catch (error) {
    res.redirect('/error')
  }

}

module.exports = {
  CancelOrder,
  postNewpass,
  DeleteProfile,
  ForgetPsw,
  NewAddress,
  Updatepsw,
  Newpassword,
  postforgetPsw,
  loadHome,
  login,
  register,
  details,
  AllOrders,
  Posteditprofile,
  changePsw,
  Checkout,
  DeleteCart,
  NewCart,
  Address,
  Kids,
  Womens,
  GoogleLogin,
  Logout,
  checkotp,
  resetpwd,
  cart,
  products,
  checkout,
  getOtp,
  resentOtp,
  loginUser,
  Profile,
  EditProfile,
  WishList,
  Cart,
  ProductUserWishlist,
  DeleteAdd,
  Search,
};

function generateOtp() {
  otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  return otp;
}
