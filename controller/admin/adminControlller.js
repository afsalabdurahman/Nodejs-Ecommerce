const bcrypt = require("bcrypt");
const User = require("../../model/userModel");
// const sharp = require('sharp');


const loadAdminLogin = async (req, res) => {
  try {
    res.render("admin/login.hbs");
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

        res.render("admin/adminHome.hbs",{admin:true} );
      } else {
        res.render("admin/login.hbs", {
          message: "Email and password are incorrect"
        });
      }
    } else {
      res.render("admin/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const addProducts=(req,res)=>{
res.render('admin/addProducts.hbs',{admin:true})
}


const uploaded=  (req,res)=>{
    console.log(req.body)
    res.send("img uploaded")
}

module.exports = {
  loadAdminLogin,
  verifyadminLogin,
  loadHome,
  addProducts,
  uploaded

  

};
