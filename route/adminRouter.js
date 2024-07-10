const express = require("express");
const adminRoute = express();
const adminController = require("../controller/admin/adminControlller");
const adminAuth = require("../middleware/adminAuth");
const productController=require("../controller/admin/productController")
const categoryController=require("../controller/admin/categoryController")
const multer  = require('multer')
const storage=require('../multer/multer')
  var upload = multer({ storage: storage });


// LOGIN
adminRoute.get("/",adminAuth.isLogout, adminController.loadAdminLogin);
adminRoute.post("/", adminController.verifyadminLogin);
adminRoute.get("/logout", adminController.adminLogout);

adminRoute.get('/home',adminAuth.isLogin,adminController.loadHome)

adminRoute.get('/addproducts',adminAuth.isLogin,productController.addProducts)
adminRoute.post('/uploaded',upload.array('uploadimg',4),productController.uploaded)


adminRoute.get('/category',adminAuth.isLogin,categoryController.categoryForm)
adminRoute.post('/addcategory',upload.array('image',1),categoryController.postcategoryForm)
adminRoute.get('/listcategory',categoryController.listCategory)
adminRoute.get('/editcategory',adminAuth.isLogin,categoryController.editCategory)




module.exports = adminRoute;
