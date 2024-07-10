const sharp = require('sharp');
const path=require('node:path')
const Product=require('../../model/productModel')

const addProducts=(req,res)=>{
    res.render('admin/products.hbs',{admin:true})
    }




const uploaded=  async(req,res)=>{
     try {
        console.log(req.body,"namessssss")
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
module.exports={
    uploaded,
    addProducts
}