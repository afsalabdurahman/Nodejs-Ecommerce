const express = require("express");
const adminRoute = express();
// const multer=require('../middleware/adminAuth')
const adminController = require("../controller/admin/adminControlller");
const adminAuth = require("../middleware/adminAuth");
const multer  = require('multer')



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })
  var upload = multer({ storage: storage });


// LOGIN
adminRoute.get("/",adminAuth.isLogout, adminController.loadAdminLogin);
adminRoute.post("/", adminController.verifyadminLogin);
adminRoute.get("/logout", adminController.adminLogout);

adminRoute.get('/home',adminAuth.isLogin,adminController.loadHome)

adminRoute.get('/addproducts',adminController.addProducts)
adminRoute.post('/uploaded',upload.array('uploadimg',4),adminController.uploaded)




module.exports = adminRoute;
