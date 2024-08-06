const bcrypt = require("bcrypt");
const User = require("../../model/userModel");
const Product = require("../../model/productModel");
const { products } = require("../user/userController");
const UserCart = require("../../model/cartModel");
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
    console.log(req.session, "kkkk");
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

    Data = await UserCart.find({ orderStatus: "Processing" }).populate("ProductId").lean()
    console.log(Data, "dats")
    res.render("admin/Orders.hbs", { Data })

  } catch (error) {
    console.log(error)
  }


}

module.exports = {
  Orders,
  loadAdminLogin,
  blockUser,
  verifyadminLogin,
  adminLogout,
  listUser,
  loadHome,
};
