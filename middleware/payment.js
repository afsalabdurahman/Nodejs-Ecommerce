let User_schema = require("../model/userModel");
const Product = require("../model/productModel");
const UserCart = require("../model/cartModel");
const Wallet = require('../model/WalletModel')

const Checkstatus = async (req, res, next) => {

    try {
        let tran = null
        //Amout use from Wallet
        console.log(req.query)
        if (req.query.WalletAmt) {
            b = Number(req.query.WalletAmt)
            let walletAmt = b.toFixed(2)
            let pretty = prettyDates()
            let newtransaction = {


                paymentStatus: 'Completed',
                amount: walletAmt,
                credit: true
            }

            let updateW = await Wallet.findOneAndUpdate({
                userId: req.session.user_id
            }, {
                $push: { transactions: newtransaction },
                $inc: { currentBalance: -walletAmt }
            },
                { new: true, upsert: true },
            )
        }


        //end......
        function generateOrderID() {
            const randomNumber = Math.floor(Math.random() * 9000) + 1000; // Generates a random number between 1000 and 9999
            const orderID = `OrderID#${randomNumber}`;
            return orderID;
        }    ////
        console.log(req, "working")
        console.log(req.query, "alllorders query")
        let add = ""
        let name = ""
        const userdata = await User_schema.findById(req.session.user_id)
        console.log(userdata, "userdatasss")
        console.log(req.session.user_id, "useriddd1111111")
        if (req.session.user_id) {
            console.log(req.session.user_id, "useriddd")
            userdetails = await User_schema.findById({ _id: req.session.user_id }).lean()
            if (req.query.id == "address2") {
                add = userdetails.address2.address + " " + userdetails.location
                console.log(add, "add11111")
                name = userdetails.address2.name
            } else {
                add = userdetails.address + " " + userdetails.location
                console.log(add, "222")
                name = userdetails.name
            }


            const exist = await UserCart.find({ orderStatus: "Pending" }).lean()
            console.log(exist, "existtttt")
            if (exist.length != 0) {

                ///date
                const prettyDate = new Date().toLocaleString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',

                    hour12: true,
                });
                ///
                if (req.query.info) {
                    tran = "wallet"
                }
                newOrderID = generateOrderID();
                const Data = await UserCart.updateMany({ UserId: req.session.user_id, orderStatus: "Pending" }, {
                    $set: {
                        orderStatus: 'Processing',
                        Date: prettyDate,
                        address: add,
                        Username: name,
                        email: userdata.email,
                        orderId: newOrderID,
                        paymentMethod: tran

                    }
                }, { upsert: true })
                console.log(Data, "Dasttatta")
                next();
            } else {
                next()
                // res.render("user/profile/AllOrders.hbs ", { user: true })
            }
        } else {
            res.send("user not found")
            // res.render("user/profile/AllOrders.hbs", { user })
        }

    } catch (error) {
        console.log(error, "this is error")



    }
}

function prettyDates() {
    return prettyDate = new Date().toLocaleString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',

        hour12: true,
    });
}


module.exports = {
    Checkstatus
}
