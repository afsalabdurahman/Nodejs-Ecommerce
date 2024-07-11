
const Category = require("../../model/categoryMode");
const Product = require("../../model/productModel");

const { products } = require("../user/userController");

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

     

         category = await Category.find().lean()
       
        
        res.render("admin/listCategory.hbs", {category});
      } catch (error) {
        console.log(error.message);
      }
    };


const editCategory=async(req,res)=>{
  
  id=req.query.id
  const categoryData = await Category.findById(id).lean();
  console.log(categoryData,"category data")
    res.render('admin/EditCategory.hbs',{categoryData})
}




const newEditcategory=async(req,res)=>{

  try {
    console.log(req.files[0].filename,"filesss")
    let fileData=req.files
    console.log( req.body.name,"bodiessss")
let id=req.body.category_id

    //console.log(req.body)
    

db=await Category.findOne()

console.log(db,"dbbbbbb")
 const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') }
      
  });



 if(existingCategory&&fileData.length==0){

 res.send("chategory already exist")

 }else{
 
  const categoryData = await Category.findByIdAndUpdate(
    { _id:id },
    {
      $set: {
        name: req.body.name,
        image: req.files[0].filename,
        description: req.body.description
      },
    }
  );
}
res.redirect("/admin/listcategory")
 }
  
 



   catch (error) {
    console.log(error)
  }
 



}

module.exports={
    categoryForm,
    postcategoryForm,
listCategory,
editCategory,
newEditcategory
}