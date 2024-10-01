const Cart1 = require("../../model/newcartModel")
const Product = require("../../model/productModel")
let User_schema = require("../../model/userModel");
const Order = require("../../model/OrderModel");
const Wallet = require("../../model/WalletModel")
const Coupens = require("../../model/CoupenModel")
const PDFDocument = require('pdfkit')
const WishList = require("../../model/wishlistModel")
const fs = require('fs');
//const { Orders } = require("../admin/adminControlller");
const Cart = async (req, res) => {
    try {
        //offers prsonatge calcutae
        console.log(req.query, "offer added")
        let productss = await Product.findById(req.query.id)
        profit = productss.price - (req.query.price * req.query.quandity)
        let persontage = Math.abs(profit)
        if (!productss.isVisible) {
            req.query.id = null
        }
        //console.log(req.query, "qury to cart")
        // Ensure the user is logged in
        if (req.session.user_id) {

            let newcart = await Cart1.findOne({ userId: req.session.user_id });
            //check number of items
            if (newcart) {


                if (newcart.items.length > 5) {
                    res.redirect(`/details?msg=full&id=${req.query.id}`)
                }
            }
            // Decrease product stock based on the quantity added to the cart
            const productId = req.query.id;
            const quantityToDecrease = Number(req.query.quandity); // Ensure quantity is a number



            // Find the user's cart or create a new one

            if (!newcart) {
                // Create a new cart if one doesn't exist
                newcart = new Cart1({ userId: req.session.user_id, items: [], totalPrice: 0, totalItems: 0 });
            }

            // Check if the product with the same size and color already exists in the cart
            const existingItemIndex = newcart.items.findIndex(item =>
                item.productId.toString() === productId &&
                item.size === req.query.size &&
                item.color === req.query.color
            );
            //console.log(existingItemIndex, "exist items")

            if (existingItemIndex > -1) {
                // If item exists, update the quantity
                if (newcart.items[existingItemIndex].quantity + quantityToDecrease > 5) {

                    newcart.items[existingItemIndex].quantity = 5;


                } else {


                    newcart.items[existingItemIndex].quantity += quantityToDecrease;

                }
            } else {
                // Add a new item to the cart
                const cartItem = {
                    productId: productId,
                    quantity: quantityToDecrease,
                    size: req.query.size,
                    color: req.query.color,
                    price: req.query.price,
                    update: "Pending",
                    paymentStatus: "Pending",
                    offerPersonatge: persontage
                }


                newcart.items.push(cartItem);

            }
            //
            await newcart.save();

            // Fetch updated cart details and render the cart page
            const Datas = await Cart1.findOne({ userId: req.session.user_id })
                .populate('items.productId')
                .lean();
            //  console.log(Datas, "datasfor disony")

            const quantity = await Product.updateOne(
                { _id: productId },
                { $inc: { stock: -quantityToDecrease } }
            );


            res.render('user/Profile/Cart.hbs', { user, Datas });
        } else {
            res.status(404).send("User not found or not logged in");
        }
    } catch (error) {
        console.error("Error occurred in Cart controller:", error);
        res.status(500).send("An error occurred while processing your request.");
    }
};

//
const DeleteCart = async (req, res) => {
    console.log(req.query, "delete")
    const productId = req.query.id;
    const quantityToIncrease = Number(req.query.quandity);

    let userId = req.session.user_id;
    if (userId) {
        const cart = await Cart1.findOne({ userId });
        if (cart) {
            // Remove the item
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            await cart.save();

            //increase quantity of stock
            const quantity = await Product.updateOne(
                { _id: productId },
                { $inc: { stock: quantityToIncrease } }
            );

        }
    } else {
        res.send("user have no cart")
    }



    res.redirect('/profile/cartitems')
}
//show cart items
const Cartitems = async (req, res) => {
    let user = req.session.user_id

    if (user) {
        console.log(req.query.isvisible, "visible")
        let msg = {}
        if (req.query.isvisible) {
            msg.name = req.query.isvisible;
            msg.id = req.query.id

        }
        const Datas = await Cart1.findOne({ userId: req.session.user_id, })
            .populate('items.productId')
            .lean();
        console.log(Datas, "datas")
        res.render('user/Profile/Cart.hbs', { Datas, user, msg });
    } else {
        res.send("iusernot fond")
    }
}
//ajax quantity increase
const NewCart = async (req, res) => {
    let userId = req.session.user_id
    const cart = await Cart1.findOne({ userId });
    if (cart) {
        // Find the item in the cart
        const item = cart.items.find(item => item.productId.toString() === req.query.id);
        if (item) {
            // Update the quantity
            item.quantity = req.query.newqunadity;

            // Save the cart
            await cart.save();
            console.log('Cart updated successfully!');
            //decrease stock qty
            const quantityToDecrease = Number(req.query.newqunadity); // Ensure quantity is a number

            await Product.updateOne(
                { _id: req.query.id },
                { $inc: { stock: -1 } }
            );


        } else {
            console.log('Item not found in cart.');
        }
    } else {
        console.log('Cart not found.');
    }
}
//Ajax decrease quantity
const DecCart = async (req, res) => {
    try {
        let userId = req.session.user_id
        const cart = await Cart1.findOne({ userId });
        if (cart) {
            // Find the item in the cart
            const item = cart.items.find(item => item.productId.toString() === req.query.id);
            if (item) {
                // Update the quantity
                item.quantity = req.query.newqunadity;

                // Save the cart
                await cart.save();
                console.log('Cart updated successfully!');
                //decrease stock qty
                const quantityToDecrease = Number(req.query.newqunadity); // Ensure quantity is a number

                await Product.updateOne(
                    { _id: req.query.id },
                    { $inc: { stock: 1 } }
                );


            } else {
                console.log('Item not found in cart.');
            }
        } else {
            console.log('Cart not found.');
        }



    } catch (error) {
        res.status(404).send(error)
    }


}


//checkout 

const Checkout = async (req, res) => {
    try {
        //PayAgain....
        let payData = null
        let totalPriced;
        let subtotal;
        let discount;
        let t;
        let totalPriceTax;

        console.log(req.query, "+++qurey")
        if (req.query.paynow) {
            req.session.payNowId = req.query.paynow;
            payData = await Order.findOne({
                "items._id": req.query.paynow
            })
            console.log(payData, "paydata")
            totalPriced = payData.items[0].price * payData.items[0].quantity
            subtotal = totalPriced + 0;
            discount = 0
            t = subtotal - discount
            totalPriceTax = t.toFixed(2)
            console.log(totalPriced, "pricedd")

        }
        //payAgn end
        //coupen
        let coupenPrice = 0;
        if (req.query.coupen) {
            coupenPrice = req.query.coupen
        }


        if (payData == null) {


            data = await Cart1.findOne({ userId: user }).populate("items.productId")
            console.log(data, "data?????????")
            data.items.map((e) => {
                if (!e.productId.isVisible) {
                    console.log("not++")

                    res.redirect(`/profile/cartitems?isvisible=${e.productId.name}&id=${e.productId._id}`)
                }


            })



            totalPriced = data.totalPrice
            subtotal = totalPriced + 100;
            discount = 0
            t = subtotal - discount
            totalPriceTax = t.toFixed(2)
        }

        //scrach
        user = req.session.user_id
        userData = await User_schema.findById({ _id: user }).lean()
        let Scra = {}
        if (totalPriced > 1000) {

            let code = await Coupens.find({
            });
            code.map((e) => {
                console.log(e.minimumAmount, "minimum amount")
                if (e.minimumAmount < totalPriced && totalPriced < 2000) {
                    Scra.code = e.code
                    Scra.Coupendiscount = e.discount
                } else if (e.minimumAmount < totalPriced && totalPriced < 3000) {
                    Scra.code = e.code
                    Scra.Coupendiscount = e.discount
                } else if (e.minimumAmount < totalPriced && totalPriced > 3000) {
                    Scra.code = e.code
                    Scra.Coupendiscount = e.discount
                }
            })

        }

        res.render('user/Profile/checkout.hbs', { user, userData, totalPriced, totalPriceTax, Scra })
    } catch (error) {
        console.log(error, "err")
    }

}
const AllOrders = async (req, res) => {
    try {
        let newOrderId = generateOrderID()
        let paymentMethod;
        let totalAmount;
        let address;
        let cartId;


        if (req.session.payNowId != null) {
            console.log(req.session.payNowId, "idddddd++++++")

            let cart = await Order.findOne(
                { 'items._id': req.session.payNowId },
                { 'items.$': 1 }  // This will return only the matching item in the items array
            );


            //add to cart
            let newcart = new Cart1({ userId: req.session.user_id, items: [], totalPrice: 0, totalItems: 0 });

            // Add a new item to the cart
            const cartItem = {
                productId: cart.items[0].productId,
                quantity: cart.items[0].quantity,
                size: cart.items[0].size,
                color: req.query.color,
                price: cart.items[0].price,
                update: "Pending",
                paymentStatus: "Completed",
                offerPersonatge: cart.items[0].offerPersonatge
            }
            newcart.items.push(cartItem);

            await newcart.save();
            cartId = newcart._id

            //Orders.....
            //Delete Order Item
            await Order.updateOne(
                { 'items._id': req.session.payNowId },  // Match the order with the item
                { $pull: { items: { _id: req.session.payNowId } } }  // Remove the item from the array
            );


        }


        console.log(req.query, "007")
        let user = req.session.user_id
        if (user) {
            newOrderId = generateOrderID()
            paymentMethod = req.query.info
            totalAmount = req.query.amt
            address;
            adds = await User_schema.findOne({ _id: user })
            console.log(adds, "addsss")
            if (req.query) {


                if (req.query.add == "address2") {
                    address = {
                        fullName: adds.address2.name,
                        address: adds.address2.address,
                        city: adds.address2.city,
                        postalCode: adds.address2.zip,
                        state: adds.address2.state

                    }
                } else {
                    address = {
                        fullName: adds.name,
                        address: adds.address,
                        city: adds.location,
                        postalCode: adds.address2.zip,
                        state: adds.address2.state

                    }
                }
            }

            let cart = await Cart1.findOne({ userId: user })
            console.log(cart._id, "cart007")
            if (req.session.payNowId == null) {
                cartId = cart._id
                console.log("!!! working")
            }
            if (!cart) {
                res.send("user nothave cart")
            } else {
                const order = new Order({
                    userId: user,
                    OrderId: newOrderId,
                    totalAmount: totalAmount,
                    cartId: cartId,
                    paymentMethod: paymentMethod,
                    shippingAddress: address // Pass the shipping details (fullName, address, city, etc.)
                });
                await order.save();
            }

            ///Clear from cart......


            cart.items = [];
            cart.totalPrice = 0;
            cart.totalItems = 0;
            await cart.save();

            req.session.payNowId = null

            res.redirect('/profile/getallorders')
        } else {
            res.status(404).send("not found")
        }

    } catch (error) {
        console.log(error)
    }
}
const GetOrders = async (req, res) => {
    let user = req.session.user_id;
    let Datas = await Order.find({ userId: user }).sort({ _id: -1 }).populate("items.productId").lean()
    //let FailPayment = await Order.find({ userId: user, PaymentStatus: "Pending" }).sort({ _id: -1 }).populate("items.productId").lean()
    // Datas.FailPayment = FailPayment
    console.log(Datas, "+++++Datsa")
    res.render('user/Profile/AllOrders.hbs', { user, Datas })
}

//cancel cart items..

const CancelOrder = async (req, res) => {

    console.log(req.query, "cancelquey")
    let data = await Order.updateOne(
        { "items._id": req.query.id }, // Match the order that contains the item with this ID
        { $set: { "items.$[element].update": "Cancelled" } }, // Update the price of the specific item
        { arrayFilters: [{ "element._id": req.query.id }] } // Use array filter to target the specific item
    )

    // update wallet

    //update wallet..
    let findOrderPrice = await Order.findOne(
        { "items._id": req.query.id },
        { "items.$": 1, "paymentMethod": 1, } // This will return only the specific updated item from the items array
    );
    console.log(findOrderPrice, "orderprice")

    let update = 0
    //   let currentBalance = await Wallet.find()
    let Wuser = await Wallet.find({ userId: req.session.user_id })
    console.log(Wuser, "wuser")

    if (findOrderPrice.paymentMethod == "RazorPay" && Wuser == null) {
        const exampleWallet = new Wallet({
            userId: req.session.user_id, // Replace with an actual user ID from your User collection
            currentBalance: update,
            transactions: [
                {

                    paymentStatus: 'Completed',
                    amount: findOrderPrice.items[0].price,
                    debit: true
                }


            ]
        })
        // Save the example data to the database
        exampleWallet.save()
    } else if (findOrderPrice.paymentMethod == "Wallet" || findOrderPrice.paymentMethod == "RazorPay") {

        let newtransaction = {

            paymentStatus: 'Completed',
            amount: findOrderPrice.items[0].price,
            debit: true
        }

        let updateW = await Wallet.findOneAndUpdate({
            userId: req.session.user_id
        }, {
            $push: { transactions: newtransaction },
            $inc: { currentBalance: +newtransaction.amount }
        },
            { new: true, upsert: true },
        )
    }


    res.redirect('/profile/getallorders')


}




//genereate OrderId
function generateOrderID() {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000; // Generates a random number between 1000 and 9999
    const orderID = `OrderID#${randomNumber}`;
    return orderID;
}
////

const Invoice = async (req, res) => {
    try {
        console.log(req.query, "++qury")
        let data = await Order.findOne({
            _id: req.query.orderId
        }).populate("items.productId").lean();

        if (data && data.items) {
            // Filter items to only include those that are delivered
            data.items = data.items.filter(item => item.update === "Delivered");
        }

        console.log(data, "+++data", data.OrderId, "oderid")
        const doc = new PDFDocument();
        const pdfFilePath = './invoice.pdf';
        doc.pipe(fs.createWriteStream(pdfFilePath));
        doc.fontSize(18).text('Invoice', { align: 'center', underline: true });
        doc.fontSize(12).text(`Date:${data.deliveryDate}`, { align: 'right', underline: true });
        doc.moveDown(1);
        doc.fontSize(15).text('Seller info', { underline: true })
        doc.fontSize(13).text('Name:Lux and Co')
        doc.fontSize(13).text('Addres:Jp nagar Btm Layout,Bagalore')
        doc.moveDown(1);
        doc.fontSize(15).text('Buy info', { underline: true })
        doc.fontSize(13).text(`Name: ${data.shippingAddress.fullName}`)
        doc.fontSize(13).text(`Address: ${data.shippingAddress.address}, ${data.shippingAddress.city}, ${data.shippingAddress.postalCode}`)
        doc.moveDown(1.5);
        doc.fontSize(10).text(`Order ID: ${data.OrderId}`, { bold: true });
        doc.text(`Payment Method: ${data.paymentMethod}`);
        doc.moveDown(0.5);

        doc.text('Items:', { underline: true });
        data.items.forEach(item => {
            doc.fontSize(11)
                .text(`Product Name: ${item.productId.name}`, { continued: true })
                .text(` | Unit Price: ${item.productId.price} | Quantity: ${item.quantity} | Total Price: ${item.quantity * item.productId.price}`, { align: 'right' });
            doc.moveDown(0.5);
            doc.fontSize(15).text(`Discount Offer: ${item.offerPersonatge || 'N/A'}`, { align: 'right' });

        });

        doc.moveDown(1);

        doc.fontSize(16).text(`Total: ${data.items[0].price * data.items[0].quantity - data.items[0].offerPersonatge}`, { align: 'right' });

        doc.end();

        // Send the file to download
        res.download(pdfFilePath);

    } catch (error) {
        console.log(error)
    }




}

const Paynow = async (req, res) => {
    let data = await Order.findOne({
        "items._id": req.query.id
    })
    req.session.itemId = req.query.id
    res.redirect(`/profile/checkout?paynow=${req.query.id}`)
}
const DeleteWishlist = async (req, res) => {
    console.log(req.query, "<quryyy")
    let deleted = await WishList.deleteOne({ ProductId: req.query.id })
    res.status(200).json({ success: true, data: "sucess" })
}

module.exports = {
    Cart,
    DeleteWishlist,
    Paynow,
    Invoice,
    CancelOrder,
    GetOrders,
    AllOrders,
    Checkout,
    DeleteCart,
    Cartitems,
    NewCart,
    DecCart

}