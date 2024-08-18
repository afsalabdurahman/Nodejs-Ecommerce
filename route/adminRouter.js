const express = require("express");
const adminRoute = express();
const adminController = require("../controller/admin/adminControlller");
const adminAuth = require("../middleware/adminAuth");
const productController = require("../controller/admin/productController");
const categoryController = require("../controller/admin/categoryController");
const multer = require("multer");
const storage = require("../multer/multer");
var upload = multer({ storage: storage });

// LOGIN
adminRoute.get("/", adminAuth.isLogout, adminController.loadAdminLogin);
adminRoute.post("/", adminController.verifyadminLogin);
adminRoute.get("/logout", adminAuth.isLogin, adminController.adminLogout);

//home
adminRoute.get("/home", adminAuth.isLogin, adminController.loadHome);


// Product Management
adminRoute.get("/addproducts", adminAuth.isLogin, productController.addProducts);
adminRoute.post(
  "/uploaded",
  upload.array("uploadimg", 4),
  productController.uploaded
);
adminRoute.get("/listproducts", adminAuth.isLogin, productController.Listproducts);
adminRoute.get("/editproduct", adminAuth.isLogin, productController.Editproduct);
adminRoute.post(
  "/newlistproduct",
  upload.array("uploadimg", 4),
  productController.newlistedProduct
);
adminRoute.get("/delete", adminAuth.isLogin, productController.productDelete);
adminRoute.get("/visible", adminAuth.isLogin, productController.productVisible);


//Add Category
adminRoute.get("/category", adminAuth.isLogin, categoryController.categoryForm);
adminRoute.post(
  "/addcategory",
  upload.array("image", 1),
  categoryController.postcategoryForm
);
adminRoute.get("/listcategory", adminAuth.isLogin, categoryController.listCategory);
adminRoute.get(
  "/editcategory",
  adminAuth.isLogin,
  categoryController.editCategory
);
adminRoute.post(
  "/editcategory",
  upload.array("image", 1),
  categoryController.newEditcategory
);
adminRoute.get("/unlist", adminAuth.isLogin, categoryController.unlistCategory);

//User Management
adminRoute.get("/listuser", adminAuth.isLogin, adminController.listUser);
adminRoute.get("/block", adminAuth.isLogin, adminController.blockUser);
adminRoute.get("/orders", adminAuth.isLogin, adminController.Orders)

adminRoute.get('/orderdetails', adminAuth.isLogin, adminController.OrderDetails)
adminRoute.get('/cancel-order', adminAuth.isLogin, adminController.Cancel_Order)
adminRoute.get('/shipped-order', adminAuth.isLogin, adminController.Shipped_Order)
module.exports = adminRoute;
