let User_schema = require("../model/userModel");
const Product = require("../model/productModel");
const UserCart = require("../model/cartModel");

const Checkstatus = async (req, res, next) => {

    try {
        console.log(req, "working")
        console.log(req.query, "alllorders query")
        let add = ""
        console.log(req.session.user_id, "useriddd1111111")
        if (req.session.user_id) {
            console.log(req.session.user_id, "useriddd")
            userdetails = await User_schema.findById({ _id: req.session.user_id }).lean()
            if (req.query.id == "address2") {
                 add = userdetails.address2.address + " " + userdetails.location
                console.log(add, "add11111")
            } else {
                 add = userdetails.address + " " + userdetails.location
                console.log(add, "222")
            }


            const exist = await UserCart.find({})


            const Data = await UserCart.updateMany({ UserId: req.session.user_id, orderStatus: "Pending" }, {
                $set: {
                    orderStatus: 'Processing',
                    Date: new Date(),
                    address: add,
                    TotalAmount: req.session.totalPrice


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
