const Category = require("../../model/categoryMode");
const Product = require("../../model/productModel");
const { products } = require("../user/userController");



// Showing Category Fillup Form................................
const categoryForm = (req, res) => {
  res.render("admin/category.hbs", { admin: true });
};
// Posting Category Form........................................
const postcategoryForm = async (req, res) => {
  try {
    let { name, description } = req.body;
    let image = req.files[0].filename;



    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

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
    res.redirect('/error');
  }
};

//List of Categories............-.................
const listCategory = async (req, res) => {
  try {
    category = await Category.find().lean();
    res.render("admin/listCategory.hbs", { category, admin: true });
  } catch (error) {
    console.log(error.message);
  }
};


// Edit Category form............................................
const editCategory = async (req, res) => {
  id = req.query.id;
  const categoryData = await Category.findById(id).lean();
  console.log(categoryData, "category data");
  res.render("admin/EditCategory.hbs", { categoryData, admit: true });
};


// Post Category Form.............................................
const newEditcategory = async (req, res) => {
  try {
    let fileData = req.files;
    let img = "";
    if (fileData.length != 0) {
      img = fileData[0].filename;
    }
    let id = req.body.category_id;
    db = await Category.findOne();
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
    res.redirect('/error');
  }
};


// Unlisting Category...........................
const unlistCategory = async (req, res) => {
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
