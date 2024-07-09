const sharp = require('sharp');
const path=require('node:path')

const addProducts=(req,res)=>{
    res.render('admin/products.hbs',{admin:true})
    }




const uploaded=  async(req,res)=>{
     try {
        const imageData = [];
        const imageFiles = req.files;
        for(file of imageFiles){
            imagename=file.filename
         imagepath=path.join('public','upload')
 console.log(file,"crop")
fullpath=path.join(imagepath,imagename)
console.log(fullpath,"fullapath")
cropImage= await sharp(file.path).resize(580,320).toFile(imagepath)
console.log(cropImage,"croped")
if(cropImage){
    imageData.push(imagename)
}
        }
     } catch (error) {
     console.log(error,"error from try")
     }
    
        // console.log(req.body)
        // console.log(req.files,"files")
        
        res.send("img uploaded")
    }
module.exports={
    uploaded,
    addProducts
}