
const Category = require("../../model/categoryMode");
const Product = require("../../model/productModel");

const categoryForm= (req,res)=>{
   
    res.render('admin/category.hbs')
}
const postcategoryForm= async (req,res)=>{

    try {
        let { name, description } = req.body;
        console.log(req.body,"bodyyyyyyyyyyyy")
        console.log(req.files[0].filename,"filessssssss")
       
 let image=req.files[0].filename


      
      console.log(image,"imassssssssssssssge")
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
      });
      if (existingCategory) {
        res.send('allredy ecxist');
    } else {
        const category = new Category({
            name: req.body.name,
            image: image,
            description: req.body.description,
            is_listed:true
        });
        const categoryData = await category.save();
  
    
      }





    } catch (error) {
console.log(error)
    }
   
    res.send("done");
  
}


 const listCategory=async(req,res)=>{

    try {
        const categorydata = await Category.find();
        console.log(categorydata,"data from category")
        res.render("admin/listCategory.hbs", { categorydata });
      } catch (error) {
        console.log(error.message);
      }
    };


const editCategory=(req,res)=>{
    res.render('admin/EditCategory.hbs')
}
module.exports={
    categoryForm,
    postcategoryForm,
listCategory,
editCategory
}