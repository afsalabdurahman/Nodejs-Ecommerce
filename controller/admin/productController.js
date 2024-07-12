const sharp = require('sharp');
const path=require('node:path')
const Product=require('../../model/productModel')
const Category=require('../../model/categoryMode')





const addProducts=async(req,res)=>{
    let categories = await Category.find().lean();
    console.log(categories)
    res.render('admin/Addproducts.hbs',{categories,admin:true})
    }




const uploaded=  async(req,res)=>{
     try {
        
        console.log(req.body.categories,"namessssss")
        console.log(req.body.name,"$$$$$$$")

        const imageData = [];
        const imageFiles = req.files;
        for(file of imageFiles){
            imagename=file.filename
         imagepath=path.join('public','upload')
 console.log(file,"crop")
 const randomInteger = Math.floor(Math.random() * 20000001);
 const imgFileName = "cropped" + randomInteger + ".jpg";
fullpath=path.join(imagepath,imagename)
console.log(fullpath,"fullapath")
cropImage= await sharp(file.path).resize(200,200,{fit:"cover"}).toFile(imagepath+'/'+imgFileName)
console.log(cropImage,"croped")
if(cropImage){
    imageData.push(imgFileName)
}
        }
    
    // console.log(req.body,"body")
    // console.log(req.files,"file")
       

    console.log("data[0]", imageData,"dataimage[0]")
//   const { name, brand, stock, price,discount_price, description,image } = req.body;

   const addProducts = new Product({
      name:req.body.name,
      description:  req.body.description,
      brand:req.body.Brand,
    //   category:req.body.categories,
      price:req.body.price,
      stock:req.body.stock,
   
      discount_price:req.body.discount_price ,
     image:imageData
    });  
    
     await addProducts.save()
     
     
     res.send("img uploaded")
    } catch (error) {
        console.log(error,"error from try")
        }


    }

const Listproducts=async(req,res)=>{
try {

  const  listproduct=await Product.find().lean()
    // console.log(listproduct,"listtttt")
    
        res.render('admin/Listproducts.hbs',{listproduct}) 



} catch (error) {
console.log(error)
}

}

const Editproduct=async(req,res)=>{
 try {
    
    // console.log(req.body,"bodysss")
    id=req.query.id

    const productData = await Product.findById(id).lean();
    console.log(productData,"dataproduct")
    let categories = await Category.find().lean();

    res.render('admin/Editproducts.hbs',{productData,categories})
 } catch (error) {
    console.log(error)
    
 }
  
}
const newlistedProduct=async(req,res)=>{

try {
   const image=[]
    console.log(req.body,"body")
    id=req.body.product_id
    let fileData=req.files.length
    console.log(req.files.length,"filess")
let product=await Product.findById(id).lean();

console.log(product,"product")
console.log(req.body,"body")

const {name,description,Brand,category,price,stock,discount_price}=req.body;

if(product){

    const isEqual = (
        product.name==name&&
        product.description == description &&
        
         product.brand == Brand&&
         
          product.price==price&&
         product.stock==stock&&
         product.discount_price==discount_price&&
       fileData==0
        
      );

      console.log(isEqual,"eqial")
if(isEqual){
   
        res.send("imagealredy exist")
    }
else{

// imgecrop
const imageData = [];
const imageFiles = req.files;
for(file of imageFiles){
    imagename=file.filename
 imagepath=path.join('public','upload')
console.log(file,"crop")
const randomInteger = Math.floor(Math.random() * 20000001);
const imgFileName = "cropped" + randomInteger + ".jpg";
fullpath=path.join(imagepath,imagename)
console.log(fullpath,"fullapath")
cropImage= await sharp(file.path).resize(200,200,{fit:"cover"}).toFile(imagepath+'/'+imgFileName)
console.log(cropImage,"croped")
if(cropImage){
imageData.push(imgFileName)
}
}
//end




    
    const updateProductData = await Product.findByIdAndUpdate(
        { _id:id },
        {
          $set: {
            name: name,
            brand: Brand,
            category: category,
            stock: stock,
            price: price,
            discount_price: discount_price,
            description: description,
            image: imageData
          },
        }
      );
      await updateProductData.save()

res.redirect('/admin/listproducts')

}

    }
    
    else{res.send("product not found in database") }







    
} catch (error) {
    console.log(error)
    
}
}


 

module.exports={
    uploaded,
    addProducts,
    Listproducts,
    Editproduct,
    newlistedProduct
   
}