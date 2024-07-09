const bcrypt = require("bcrypt");
const User = require("../../model/userModel");
const Product=require("../../model/productModel");
const { products } = require("../user/userController");





const loadAdminLogin = async (req, res) => {
   try {
    res.render("admin/login.hbs",{msg:"remove"});
  } catch (error) {
    console.log(error.message);
 
  }
};

const verifyadminLogin = async (req, res) => {
              try {
    const { email, password } = req.body;
console.log(req.body)
    const adminData = await User.findOne({ email: email });

    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (passwordMatch && adminData.isAdmin === 1) {
    
        req.session.admin_id = adminData._id;

        res.redirect("admin/home");
      } else {
        res.render("admin/login.hbs", {
          message: "Email and password are incorrect"
        });
      }
    } else {
      res.redirect("/admin"  );
    }
  } catch (error) {
    console.log(error.message);
  }
};

const adminLogout= async (req,res)=>{
 delete req.session.admin_id;
 res.redirect('/admin')

}

const loadHome=async(req,res)=>{
  try {
    const adminData = await User.findById(req.session.admin_id);
console.log(  req.session,"kkkk");
    if (adminData) {
      res.render("admin/adminHome.hbs", { admin: adminData });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error.message);

  }
}






module.exports = {
  loadAdminLogin,
  verifyadminLogin,
  adminLogout,

  
  loadHome

  

};
