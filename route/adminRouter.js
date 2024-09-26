const express = require("express");
const adminRoute = express();
const adminController = require("../controller/admin/adminControlller");
const adminAuth = require("../middleware/adminAuth");
const productController = require("../controller/admin/productController");
const categoryController = require("../controller/admin/categoryController");
const multer = require("multer");
const storage = require("../multer/multer");
const productModel = require("../model/productModel");
var upload = multer({ storage: storage });

// LOGIN
adminRoute.get("/", adminAuth.isLogout, adminController.loadAdminLogin);
adminRoute.post("/", adminController.verifyadminLogin);
adminRoute.get("/logout", adminAuth.isLogin, adminController.adminLogout);

//home
adminRoute.get("/home", adminAuth.isLogin, adminController.loadHome);
adminRoute.post('/download-pdf', adminController.PDFDow)
adminRoute.post('/download-excel', adminController.ExcelDow)

// Product Management
adminRoute.get("/addproducts", adminAuth.isLogin, productController.addProducts);
adminRoute.post("/uploaded", upload.array("uploadimg", 4), productController.uploaded);
adminRoute.get("/listproducts", adminAuth.isLogin, productController.Listproducts);
adminRoute.get("/editproduct", adminAuth.isLogin, productController.Editproduct);
adminRoute.post(
  "/newlistproduct",
  upload.array("uploadimg", 4),
  productController.newlistedProduct
);
adminRoute.get("/delete", adminAuth.isLogin, productController.productDelete);
adminRoute.get("/visible", adminAuth.isLogin, productController.productVisible);
adminRoute.get('/removeimg', async (req, res) => {
  console.log(req.query, "quryyy")
  let result = await productModel.findByIdAndUpdate(req.query.id,
    { $pull: { image: req.query.name } },
    { new: true, useFindAndModify: false }

  )

  console.log(result, "result")
})

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
//Order Mangement
adminRoute.get('/orderdetails', adminAuth.isLogin, adminController.OrderDetails)
adminRoute.get('/cancel-order', adminAuth.isLogin, adminController.Cancel_Order)
adminRoute.get('/shipped-order', adminAuth.isLogin, adminController.Shipped_Order)
adminRoute.get('/orders/returnreq', adminAuth.isLogin, adminController.ApproveReturn)
adminRoute.get('/topselling', adminAuth.isLogin, productController.TopSelling)
adminRoute.get('/topcategory', adminAuth.isLogin, productController.TopCategory)
adminRoute.get('/deliver-order', adminAuth.isLogin, adminController.Delivered_Order)

//coupen management
adminRoute.get('/listcoupens', adminAuth.isLogin, adminController.ListCoupens)
adminRoute.get('/addcoupen', adminAuth.isLogin, adminController.AddCoupen)
adminRoute.post('/postcoupen', adminAuth.isLogin, adminController.PostCoupen)
adminRoute.get('/deletecoupen', adminAuth.isLogin, adminController.DeleteCoupen)
//Offer mangement
adminRoute.get('/listoffers', adminAuth.isLogin, adminController.ListOffers)
adminRoute.get('/addoffers', adminAuth.isLogin, adminController.AddOffers)
adminRoute.post('/postoffers', adminAuth.isLogin, adminController.PostOffers)

adminRoute.get('/deleteoffer', adminAuth.isLogin, adminController.DeleteOffer)


adminRoute.get('/inactiveoffer', adminAuth.isLogin, adminController.InActiveOffer)
///sales report
adminRoute.get('/salesreport', adminAuth.isLogin, adminController.generateSalesReport)

module.exports = adminRoute;
