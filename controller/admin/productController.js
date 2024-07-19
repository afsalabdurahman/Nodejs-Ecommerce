const sharp = require("sharp");
const path = require("node:path");
const Product = require("../../model/productModel");
const Category = require("../../model/categoryMode");
const { trusted } = require("mongoose");


// Add New product Page.......................................
const addProducts = async (req, res) => {
  let categories = await Category.find({ is_listed: true }).lean();
  res.render("admin/Addproducts.hbs", { categories, admin: true });
};

// Post New products..........................................
const uploaded = async (req, res) => {
  try {
    if (req.files && req.body.name) {

      const imageData = [];
      const imageFiles = req.files;
      for (file of imageFiles) {
        imagename = file.filename;
        imagepath = path.join("public", "upload");
        console.log(file, "crop");
        const randomInteger = Math.floor(Math.random() * 20000001);
        const imgFileName = "cropped" + randomInteger + ".jpg";
        fullpath = path.join(imagepath, imagename);

        cropImage = await sharp(file.path)
          .resize(700, 750, { fit: "cover" })
          .toFile(imagepath + "/" + imgFileName);

        if (cropImage) {
          imageData.push(imgFileName);
        }
      }
      const listCategory = await Category.findOne({ name: req.body.category }).lean();
      const addProducts = new Product({
        name: req.body.name,
        description: req.body.description,
        brand: req.body.Brand,
        category: listCategory._id,
        price: req.body.price,
        stock: req.body.stock,
        discount_price: req.body.discount_price,
        image: imageData,
      });

      await addProducts.save();
      res.redirect("/admin/listproducts");
    } else {
      let categories = await Category.find({ is_listed: true }).lean();
      res.render("admin/Addproducts.hbs", {
        categories,
        msg: "Fillup all field",
      });
    }
  } catch (error) {
    console.log(error, "error from try");
  }
};

// List Products.................................
const Listproducts = async (req, res) => {
  try {
    const listproduct = await Product.find().lean();
    res.render("admin/Listproducts.hbs", { listproduct, admin: true });
  } catch (error) {
    console.log(error);
  }
};

// Edit Product Page....................................
const Editproduct = async (req, res) => {
  try {
    id = req.query.id;

    const productData = await Product.findById(id).lean();
    console.log(productData, "dataproduct");
    let categories = await Category.find().lean();
    res.render("admin/Editproducts.hbs", {
      productData,
      categories,
      admin: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//Post Edited Products................................
const newlistedProduct = async (req, res) => {
  try {
    const image = [];
    id = req.body.product_id;
    let fileData = req.files.length;
    let product = await Product.findById(id).lean();
    const { name, description, Brand, category, price, stock, discount_price } =
      req.body;
    if (product) {
      const isEqual =
        product.name == name &&
        product.description == description &&
        product.brand == Brand &&
        product.price == price &&
        product.stock == stock &&
        product.discount_price == discount_price &&
        fileData == 0;
      if (isEqual) {
        res.render("admin/Editproducts.hbs", {
          msg: "Product already exisit",
          admin: true,
        });
      } else {
        // imgecrop.....................
        const imageData = [];
        const imageFiles = req.files;
        for (file of imageFiles) {
          imagename = file.filename;
          imagepath = path.join("public", "upload");
          console.log(file, "crop");
          const randomInteger = Math.floor(Math.random() * 20000001);
          const imgFileName = "cropped" + randomInteger + ".jpg";
          fullpath = path.join(imagepath, imagename);
          console.log(fullpath, "fullapath");
          cropImage = await sharp(file.path)
            .resize(700, 750, { fit: "cover" })
            .toFile(imagepath + "/" + imgFileName);
          console.log(cropImage, "croped");
          if (cropImage) {
            imageData.push(imgFileName);
          }
        }
        //..Stroing in db
        const listCategory = await Category.findOne({
          name: req.body.category,
        }).lean();
        const updateProductData = await Product.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name: name,
              brand: Brand,
              category: listCategory._id,
              stock: stock,
              price: price,
              discount_price: discount_price,
              description: description,
              image: imageData,
            },
          }
        );
        await updateProductData.save();

        res.redirect("/admin/listproducts");
      }
    } else {
      res.send("product not found in database");
    }
  } catch (error) {
    console.log(error);
  }
};

// Product Delete from list.........................
const productDelete = async (req, res) => {
  let id = req.query.id;
  const productvalue = await Product.findById(id);
  if (productvalue.is_listed) {
    const productData = await Product.updateOne(
      { _id: id },
      {
        $set: {
          is_listed: false,
        },
      }
    );
  } else {
    const productData = await Product.updateOne(
      { _id: id },
      {
        $set: {
          is_listed: true,
        },
      }
    );
  }

  res.redirect("/admin/listproducts");
};

// Product Visibility in list.......................
const productVisible = async (req, res) => {
  let id = req.query.id;
  const productvalue = await Product.findById(id);
  if (productvalue.isVisible) {
    const productData = await Product.updateOne(
      { _id: id },
      {
        $set: {
          isVisible: false,
        },
      }
    );
  } else {
    const productData = await Product.updateOne(
      { _id: id },
      {
        $set: {
          isVisible: true,
        },
      }
    );
  }

  res.redirect("/admin/listproducts");
};

module.exports = {
  uploaded,
  addProducts,
  Listproducts,
  Editproduct,
  newlistedProduct,
  productDelete,
  productVisible,
};
