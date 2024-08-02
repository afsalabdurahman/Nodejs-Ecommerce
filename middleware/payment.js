let User_schema = require("../model/userModel");
const Product = require("../model/productModel");
const UserCart = require("../model/cartModel");

const Checkstatus = async (req, res, next) => {

    try {
        console.log("working")
        console.log(req.session.user_id, "useriddd1111111")
        if (req.session.user_id) {
            console.log(req.session.user_id, "useriddd")
            userdetails = await User_schema.findById({ _id: req.session.user_id }).lean()

            let add = userdetails.address + " " + userdetails.location
            console.log(add, "userdetails")
            const Data = await UserCart.updateMany({ UserId: req.session.user_id }, {
                $set: {
                    orderStatus: 'Processing',
                    Date: new Date(),
                    address: add


                }
            }, { upsert: true })
            console.log(Data, "Dasttatta")
            next();
        } else {
            res.send("user not found")
        }
    } catch (error) {
        console.log(error, "this is error")



    }
}
module.exports = {
    Checkstatus
}
