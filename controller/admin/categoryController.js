const Category = require("../../model/categoryMode");
const Product = require("../../model/productModel");

const { products } = require("../user/userController");

const categoryForm = (req, res) => {
  res.render("admin/category.hbs", { admin: true });
};
const postcategoryForm = async (req, res) => {
  try {
    let { name, description } = req.body;
    console.log(req.body, "bodyyyyyyyyyyyy");
    console.log(req.files[0].filename, "filessssssss");

    let image = req.files[0].filename;

    console.log(image, "imassssssssssssssge");
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    console.log(existingCategory, "exists");
    if (existingCategory) {
      res.render("admin/category.hbs", {
        msg: "Category already Exist",
        admin: true,
      });
    } else {
      const category = new Category({
        name: req.body.name,
        image: image,
        description: req.body.description,
        is_listed: true,
      });
      const categoryData = await category.save();
      res.redirect("/admin/listcategory");
    }
  } catch (error) {
    console.log(error);
  }
};

const listCategory = async (req, res) => {
  try {
    category = await Category.find().lean();

    res.render("admin/listCategory.hbs", { category, admin: true });
  } catch (error) {
    console.log(error.message);
  }
};

const editCategory = async (req, res) => {
  id = req.query.id;
  const categoryData = await Category.findById(id).lean();
  console.log(categoryData, "category data");
  res.render("admin/EditCategory.hbs", { categoryData, admit: true });
};

const newEditcategory = async (req, res) => {
  try {
    let fileData = req.files;
    let img = "";
    if (fileData.length != 0) {
      img = fileData[0].filename;
    }
    console.log(fileData, "failedate");
    console.log(req.body.name, "bodiessss");
    let id = req.body.category_id;

    //console.log(req.body)

    db = await Category.findOne();

    console.log(db, "dbbbbbb");
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
    });

    if (existingCategory && fileData.length == 0) {
      res.render("admin/Editcategory.hbs", { msg: "Category already exist" });
    } else {
      const categoryData = await Category.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            image: img,
            description: req.body.description,
          },
        }
      );
    }
    res.redirect("/admin/listcategory");
  } catch (error) {
    console.log(error);
  }
};

const unlistCategory = async (req, res) => {
  console.log(req.query.id, "parammssss");

  try {
    const id = req.query.id;
    const categoryvalue = await Category.findById(id);

    if (categoryvalue.is_listed) {
      const categoryData = await Category.updateOne(
        { _id: id },
        {
          $set: {
            is_listed: false,
          },
        }
      );
    } else {
      const categoryData = await Category.updateOne(
        { _id: id },
        {
          $set: {
            is_listed: true,
          },
        }
      );
    }

    res.redirect("/admin/listcategory");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  categoryForm,
  postcategoryForm,
  listCategory,
  editCategory,
  newEditcategory,
  unlistCategory,
};
