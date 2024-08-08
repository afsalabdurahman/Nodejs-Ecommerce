const User = require("../model/userModel");
// Admin Authorization checking...........................
const isLogin = async (req, res, next) => {
  try {
    console.log(req.session.admin_id, "admin iddd")
    const adminData = await User.findOne({ _id: req.session.admin_id });
    if (adminData) {
      next();
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error.message);
  }
};
// Admin logout status checking.....................................
const isLogout = async (req, res, next) => {
  try {
    const adminData = await User.findOne({ _id: req.session.admin_id });

    if (req.session.admin_id && adminData.isAdmin == 1) {
      res.redirect("/admin/home");
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  isLogin,
  isLogout,
};
