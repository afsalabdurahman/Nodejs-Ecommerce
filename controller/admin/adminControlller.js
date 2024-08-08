const bcrypt = require("bcrypt");
const User = require("../../model/userModel");
const User_schema = require("../../model/userModel");
const Product = require("../../model/productModel");
const { products } = require("../user/userController");
const UserCart = require("../../model/cartModel");
const { ObjectId } = require('mongoose').Types;
const mongo = require('mongoose')
mongo.set('strictPopulate', false);
//Admin Login Page.......................
const loadAdminLogin = async (req, res) => {
  try {
    res.render("admin/login.hbs", { msg: "remove" });
  } catch (error) {
    console.log(error.message);
  }
};
// Post admin Login details and checking Here....................
const verifyadminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const adminData = await User.findOne({ email: email });
    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (passwordMatch && adminData.isAdmin === 1) {
        req.session.admin_id = adminData._id;
        console.log(req.session.admin_id, "admin")
        res.redirect("admin/home");
      } else {
        res.render("admin/login.hbs", {
          message: "Email and password are incorrect",
        });
      }
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Admin Logout......................................
const adminLogout = async (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
};

//Admin Dash Board..............................

const loadHome = async (req, res) => {
  try {
    const adminData = await User.findById(req.session.admin_id);
    console.log(req.session.admin_id, "loadHome");
    if (adminData) {
      res.render("admin/adminHome.hbs", { admin: adminData });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// list User................................................
const listUser = async (req, res) => {
  const userData = await User.find().lean();
  res.render("admin/listUser.hbs", { userData: userData, admin: true });
};

// Block user.........................................
const blockUser = async (req, res) => {
  try {
    id = req.query.id;
    const uservalue = await User.findById(id);
    if (uservalue.is_blocked) {
      const userData = await User.updateOne(
        { _id: id },
        {
          $set: {
            is_blocked: 0,
          },
        }
      );

    } else {
      const userData = await User.updateOne(
        { _id: id },
        {
          $set: {
            is_blocked: 1,
          },
        }
      );
    }

    res.redirect("/admin/listuser");
  } catch (err) {
    console.log(error);
  }
};

const Orders = async (req, res) => {
  try {
    console.log(req.session.admin_id, "Orders admin")


    let Data = await UserCart.find({ orderStatus: { $in: ["Processing", "Cancelled"] } }).populate("ProductId").lean()
    // let userData = await User.findById(new ObjectId('66977111bb6bfb89608e910a')).lean();
    // Data.user = userData;
    console.log(":data:Data", Data)
    res.render("admin/Orders.hbs", { Data, admin: true })

  } catch (error) {
    console.log(error)
  }


}

const OrderDetails = async (req, res) => {
  console.log(req.query.id, "isss")
  const usercart = await UserCart.findById(req.query.id).lean()
  console.group(usercart)
  res.render('admin/OrderDetails.hbs', { admin: true, })
}


module.exports = {
  OrderDetails,
  Orders,
  loadAdminLogin,
  blockUser,
  verifyadminLogin,
  adminLogout,
  listUser,
  loadHome,
};
