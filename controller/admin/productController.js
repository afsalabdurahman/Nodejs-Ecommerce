const sharp = require("sharp");
const path = require("node:path");
const Product = require("../../model/productModel");
const Category = require("../../model/categoryMode");

const ListOrders = require('../../model/OrderModel')
const { trusted } = require("mongoose");


// Add New product Page.......................................
const addProducts = async (req, res) => {
  console.log(req.session.admin_id, "add products")

  let categories = await Category.find({ is_listed: true }).lean();
  res.render("admin/Addproducts.hbs", { categories, admin: true });
};

// Post New products..........................................
const uploaded = async (req, res) => {
  try {

    console.log(req.body, "bodyy")
    if (req.files && req.body.name) {
      let is_crop = []
      let cropImage;
      if (req.body.imgdatas) {



        let cropheight = Math.round(parseFloat(req.body.imgdatas));

        let cropWidth = Math.round(parseFloat(req.body.imgdatas1));
        let x = Math.round(parseFloat(req.body.x));
        let y = Math.round(parseFloat(req.body.y));


        is_crop.push(cropheight)
        is_crop.push(cropWidth)
        is_crop.push(x)
        is_crop.push(y)

      }
      const imageData = [];
      const imageFiles = req.files;
      console.log(req.files, "reqfilesss")
      for (file of imageFiles) {
        imagename = file.filename;
        imagepath = path.join("public", "upload");
        console.log(file, "crop");
        const randomInteger = Math.floor(Math.random() * 20000001);
        const imgFileName = "cropped" + randomInteger + ".jpg";
        fullpath = path.join(imagepath, imagename);

        if (file.originalname == req.body.imgid) {



          cropImage = await sharp(file.path)
            .extract({ width: is_crop[0], height: is_crop[1], left: is_crop[2], top: is_crop[3] })
            .toFile(imagepath + "/" + imgFileName);
          console.log(cropImage, "croped ing")
        }
        else {
          cropImage = await sharp(file.path)
            .resize(400, 500)
            .toFile(imagepath + "/" + imgFileName);
        }

        if (cropImage) {
          imageData.push(imgFileName);
        }
      }
      console.log(imageData, "affter push")
      const listCategory = await Category.findOne({ name: req.body.category }).lean();
      const addProducts = new Product({
        name: req.body.name,
        description: req.body.description,
        brand: req.body.Brand,
        category: listCategory._id,
        price: req.body.price,
        stock: req.body.stock,
        size: req.body.size,
        color: req.body.color,
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
    console.log(req.files, "files", req.body, "bodyyyy")
    //croping img data
    let cropheight = Math.round(parseFloat(req.body.imgdatas));

    let cropWidth = Math.round(parseFloat(req.body.imgdatas1));
    let x = Math.round(parseFloat(req.body.x));
    let y = Math.round(parseFloat(req.body.y));
    //

    const image = [];
    id = req.body.product_id;
    let fileData = req.files.length;
    let product = await Product.findById(id).lean();
    const { name, description, Brand, category, price, stock, discount_price } =
      req.body;

    let is_crop = []
    console.log(product, "fromdb")
    console.log(price, "pro=icePosyion")
    if (req.body.imgdatas) {



      let cropheight = Math.round(parseFloat(req.body.imgdatas));

      let cropWidth = Math.round(parseFloat(req.body.imgdatas1));
      let x = Math.round(parseFloat(req.body.x));
      let y = Math.round(parseFloat(req.body.y));

      is_crop.push(cropheight)
      is_crop.push(cropWidth)
      is_crop.push(x)
      is_crop.push(y)
    }





    if (product) {
      const isEqual =
        product.name == name &&
        product.description == description &&
        product.brand == Brand &&
        product.price == price &&
        product.stock == stock &&
        product.discount_price == discount_price

      oldimg = await Product.findById(id).lean();
      if (fileData == 0 && oldimg.image.length == 0) {
        console.log(isEqual, "eqoal000")
        res.render("admin/Editproducts.hbs", {
          msg: "image is not found",
          admin: true,
        });


        console.log(isEqual, "eqoal11")
      } else if (isEqual) {
        res.render("admin/Editproducts.hbs", {
          msg: "Product Already Exisit",
          admin: true,
        });
      } else {
        // imgecrop.....................
        oldimg = await Product.findById(id).lean();
        console.log(oldimg, "oldimg")
        console.log(req.files, "files")


        const imageData = [];
        if (oldimg.image.length > 0) {
          oldimg.image.map((e) => {
            imageData.push(e)
          })
        }
        if (fileData > 0) {


          const imageFiles = req.files;
          for (file of imageFiles) {
            imagename = file.filename;
            imagepath = path.join("public", "upload");

            const randomInteger = Math.floor(Math.random() * 20000001);
            const imgFileName = "cropped" + randomInteger + ".jpg";
            fullpath = path.join(imagepath, imagename);

            if (is_crop.length > 0) {


              cropImage = await sharp(file.path)
                .extract({ width: is_crop[0], height: is_crop[1], left: is_crop[2], top: is_crop[3] })
                .toFile(imagepath + "/" + imgFileName);
            }
            else {
              cropImage = await sharp(file.path)
                .resize(400, 500)
                .toFile(imagepath + "/" + imgFileName);
            }


            if (cropImage) {
              imageData.push(imgFileName);
            }
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
              size: req.body.size,
              color: req.body.color,
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

const TopSelling = async (req, res) => {
  let data = await Product.find()
    .sort({ topSelling: -1 })  // Sort by topSelling in descending order
    .limit(10).lean()  // Limit the result to 10 products

  console.log(data);
  res.render("admin/topSelling.hbs", { data })
}
const TopCategory = async (req, res) => {
  let men = { C: "6699057c3cefcb99d7d7fe63", top: 0 }
  let women = {
    C: "669951b01934f70cb7148e6e", top: 0
  }
  let kid = { C: "669a10c1dfed884d9985a01c", top: 0 }


  let data = await ListOrders.find({
    items: { $elemMatch: { update: "Delivered" } }
  }).populate("items.productId").lean().limit(0);

  let count = await ListOrders.countDocuments({
    items: { $elemMatch: { update: "Deliverd" } }
  });

  console.log(data, "ordesssssrs")

  console.log(count, "counts+++++")

  data.map((e) => {
    e.items.map((item) => {
      console.log(item.productId.category)
      if (item.productId.category == men.C) {
        men.top = men.top + item.quantity
      } else if (item.productId.category == women.C) {
        women.top += item.quantity
      } else if (item.productId.category == kid.C) {
        kid.top += item.quantity
      }

    })
  })
  console.log(men, women, kid, "menssssss")
  res.render("admin/topCategory.hbs")
}

module.exports = {
  uploaded,
  TopCategory,
  TopSelling,
  addProducts,
  Listproducts,
  Editproduct,
  newlistedProduct,
  productDelete,
  productVisible,
};
