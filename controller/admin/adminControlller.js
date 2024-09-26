const bcrypt = require("bcrypt");
const User = require("../../model/userModel");
const ReturnOrders = require("../../model/ReturnOrderModel");
const Category = require("../../model/categoryMode");
const PDFDocument = require('pdfkit')
const ExcelJs = require('exceljs')

const ListOrders = require('../../model/OrderModel')
const fs = require('fs')
const Coupens = require("../../model/CoupenModel")

const User_schema = require("../../model/userModel");
const Product = require("../../model/productModel");
const { products, Cart } = require("../user/userController");
const UserCart = require("../../model/cartModel");
const { ObjectId } = require('mongoose').Types;
const CoupenModel = require('../../model/CoupenModel')
const Wallet = require("../../model/WalletModel")
const OfferModel = require('../../model/OfferModel')
const mongo = require('mongoose')
mongo.set('strictPopulate', false);
//Admin Login Page.......................
const loadAdminLogin = async (req, res) => {
  try {
    res.render("admin/login.hbs", { msg: "remove" });
  } catch (error) {
    console.log(error.message);
  }
};
// Post admin Login details and checking Here....................
const verifyadminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const adminData = await User.findOne({ email: email });
    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (passwordMatch && adminData.isAdmin === 1) {
        req.session.admin_id = adminData._id;
        console.log(req.session.admin_id, "admin")
        res.redirect("admin/home");
      } else {
        res.render("admin/login.hbs", {
          message: "Email and password are incorrect",
        });
      }
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Admin Logout......................................
const adminLogout = async (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
};

//Admin Dash Board..............................

const loadHome = async (req, res) => {
  try {
    //Sales Data...........

    let Month = []
    let Year = []
    let Total = []


    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const SalesData = await ListOrders.find({
      items: { $elemMatch: { update: "Delivered" } }
    }).populate("items.productId").lean().limit(0);

    SalesData.forEach((e) => {
      const targetDate = new Date(e.deliveryDate);
      const targetMonthName = monthNames[targetDate.getMonth()];
      const targetYear = targetDate.getFullYear();

      // Calculate the total amount (assuming you have a property for the amount)
      const amount = e.items.reduce((sum, item) => sum + item.price, 0); // Adjust according to your data structure

      // Check if the month and year already exist in Graphdata
      const index = Month.indexOf(targetMonthName);
      if (index === -1) {
        // If not found, add it to Graphdata
        Month.push(targetMonthName);
        Year.push(targetYear);
        Total.push(amount);
      } else {
        // If found, update the total amount for that month
        Total[index] += amount;
      }
    });

    // Output the Graphdata object to verify
    console.log(Month, Year, Total);


    const adminData = await User.findById(req.session.admin_id);
    console.log(req.session.admin_id, "loadHome");
    if (adminData) {
      res.render("admin/adminHome.hbs", { admin: adminData, Month: Month, Year: Year, Total: Total });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// list User................................................
const listUser = async (req, res) => {
  const userData = await User.find().lean();
  res.render("admin/listUser.hbs", { userData: userData, admin: true });
};

// Block user.........................................
const blockUser = async (req, res) => {
  try {
    id = req.query.id;
    const uservalue = await User.findById(id);
    if (uservalue.is_blocked) {
      const userData = await User.updateOne(
        { _id: id },
        {
          $set: {
            is_blocked: 0,
          },
        }
      );

    } else {
      const userData = await User.updateOne(
        { _id: id },
        {
          $set: {
            is_blocked: 1,
          },
        }
      );
    }

    res.redirect("/admin/listuser");
  } catch (err) {
    res.redirect('/error');
  }
};



// All-orders........................
const Orders = async (req, res) => {
  try {

    console.log(req.query)
    console.log(req.session.admin_id, "Orders admin")
    num = req.query.pageNo
    pageno = Number(num)

    const pages = pageno || 1
    const docCount = await ListOrders.countDocuments();
    console.log(docCount, "count")

    let val = docCount / 3
    count = Math.ceil(val)
    const perPage = Math.round(count / 3)
    let Data1 = await ListOrders.find().populate("items.productId").lean()
    console.log(Data1, "data1111")
    // let Data = await UserCart.find({ orderStatus: { $in: ["Processing", "Cancelled", "Shipped", "Returned"] } }).sort({ _id: -1 }).skip((pages - 1) * perPage).limit(3).populate("ProductId").lean()
    let Data = await ListOrders.find().sort({ _id: -1 }).skip((pages - 1) * perPage).limit(3).populate("items.productId").populate("userId").lean()
    console.log(Data, "yfysfduyf")
    res.render("admin/Orders.hbs", { Data, admin: true, count })

  } catch (error) {
    console.log(error)
    res.redirect('/error');
  }


}

const OrderDetails = async (req, res) => {
  console.log(req.query.id, "isss")
  id = req.query.id;
  // const usercart = await UserCart.findById(req.query.id).populate("ProductId").lean()
  // console.group(usercart)
  const ReturnStatus = await ReturnOrders.findOne({ OrderId: req.query.id }).lean()
  console.log(ReturnStatus, "status return")
  let Data = await ListOrders.findOne(
    { "items._id": req.query.id }, // Match the document containing the item with the specific _id
    { "items.$": 1, "OrderId": 1, "shippingAddress": 1, "paymentMethod": 1, },
    // Project only the matching item in the array
  ).lean().populate("items.productId").populate("userId");

  console.log(Data, "data")
  res.render('admin/OrderDetails.hbs', { admin: true, id, Data, ReturnStatus })
}

const Cancel_Order = async (req, res) => {
  try {
    console.log(req.query, "quaryyy")
    let data = await ListOrders.updateOne(
      { "items._id": req.query.id }, // Match the order that contains the item with this ID
      { $set: { "items.$[element].update": "Cancelled" } }, // Update the price of the specific item
      { arrayFilters: [{ "element._id": req.query.id }] } // Use array filter to target the specific item
    )



    res.redirect(`/admin/orderdetails?id=${req.query.id}`)
  } catch (error) {

  }

}

const Shipped_Order = async (req, res) => {
  try {
    let data = await ListOrders.updateOne(
      { "items._id": req.query.id }, // Match the order that contains the item with this ID
      { $set: { "items.$[element].update": "Shipped" } }, // Update the price of the specific item
      { arrayFilters: [{ "element._id": req.query.id }] } // Use array filter to target the specific item
    )

    res.redirect(`/admin/orderdetails?id=${req.query.id}`)

  } catch (error) {
    res.redirect('/error')
  }
}

const Delivered_Order = async (req, res) => {
  try {
    console.log(req.query, "quryy++++++++++")
    let data = await ListOrders.updateOne(
      { "items._id": req.query.id }, // Match the order that contains the item with this ID
      { $set: { "items.$[element].update": "Delivered" } }, // Update the price of the specific item
      { arrayFilters: [{ "element._id": req.query.id }] } // Use array filter to target the specific item
    )
    //top selling.............
    let update_product = await Product.findByIdAndUpdate(req.query.pId, {
      $inc: {
        topSelling: req.query.qtyno
      }
    });
    //top category...............................







    res.redirect(`/admin/orderdetails?id=${req.query.id}`)

  } catch (error) {
    res.redirect('/error')
  }

}
const ApproveReturn = async (req, res) => {

  console.log(req.query.id, "idreturn")
  // const reqReturn = await UserCart.updateOne(
  //   { OrderId: req.query.id },
  //   { $set: { ReturnStatus: "Approved" } },
  //   { upsert: true }
  // );

  let updateOrderStatus = await ListOrders.updateOne(
    { "items._id": req.query.id }, // Match the order that contains the item with this ID
    { $set: { "items.$[element].update": "Approve Return" } }, // Update the price of the specific item
    { arrayFilters: [{ "element._id": req.query.id }] } // Use array filter to target the specific item
  )
  //update wallet..
  let findOrderPrice = await ListOrders.findOne(
    { "items._id": req.query.id },
    { "items.$": 1, "paymentMethod": 1, "userId": 1, } // This will return only the specific updated item from the items array
  );
  console.log(findOrderPrice, "orderprice")

  let update = 0
  //   let currentBalance = await Wallet.find()
  let Wuser = await Wallet.find({ userId: findOrderPrice.userId })
  console.log(Wuser, "wuser")

  if (findOrderPrice.paymentMethod == "RazorPay" && Wuser == null) {
    const exampleWallet = new Wallet({
      userId: findOrderPrice.userId, // Replace with an actual user ID from your User collection
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
  } else if (findOrderPrice.paymentMethod == "wallet" || findOrderPrice.paymentMethod == "RazorPay") {

    let newtransaction = {

      paymentStatus: 'Completed',
      amount: findOrderPrice.items[0].price,
      debit: true
    }

    let updateW = await Wallet.findOneAndUpdate({
      userId: findOrderPrice.userId
    }, {
      $push: { transactions: newtransaction },
      $inc: { currentBalance: +newtransaction.amount }
    },
      { new: true, upsert: true },
    )
  }




  res.redirect('/admin/orders')

}

const ListCoupens = async (req, res) => {
  const Coupendata = await CoupenModel.find({}).lean()
  console.log(Coupendata, "dataa from coupen")
  res.render('admin/listCoupen.hbs', { Coupendata })
}
const AddCoupen = (req, res) => {
  res.render('admin/AddCoupen.hbs')
}
const PostCoupen = async (req, res) => {
  try {
    console.log(req.body)
    let num = Number(req.body.minAmount)
    console.log(num, "number")
    const insertedData = new CoupenModel({
      name: req.body.name,
      description: req.body.description,
      code: req.body.code,
      minimumAmount: num,
      discount: req.body.discount,
      validity: req.body.validity,
      // usedCoupons: [{
      // userId: req.body.userId,
      // status: false,
      //}]

    })

    data = await insertedData.save()



    res.redirect('/admin/listcoupens')
  } catch (error) {
    console.log(error)
  }


}

const DeleteCoupen = async (req, res) => {

  const deletes = await CoupenModel.findByIdAndDelete(req.query.id)
  console.log(req.body)
  console.log(req.query, "qury")

  res.redirect('/admin/listcoupens')
}

const ListOffers = async (req, res) => {
  const Offerdata = await OfferModel.find().lean()
  console.log(Offerdata, "uegfkuge")
  res.render("admin/listOffers.hbs", { Offerdata, admin: true })
}
const AddOffers = async (req, res) => {
  let categories = await Category.find().lean();
  let product = await Product.find().lean()
  res.render('admin/AddOffers.hbs', { product, categories, admin: true })
}
const PostOffers = async (req, res) => {

  try {
    console.log(req.body, ' body from offer')
    let dynamic = req.body.Productlists
    console.log(req.body, "bodyyy")
    //  
    if (req.body.Productlists == 'choose') {
      dynamic = req.body.Categorylists
    } else {
      let offerPer = Number(req.body.offerP)
      // let price = await Product.findOne({ name: req.body.Productlists })
      // let c = price.price - (price.price * offerPer / 100);
      //let discountprice = c.toFixed(0)
      //}
      let f = await Product.updateOne(
        { name: req.body.Productlists },  // Filter to find the document by product name
        { $set: { discount_price: offerPer, offer: 1 } },    // Update operation to set the 'offer' field
        { upsert: true }                  // Option to create the document if it doesn't exist
      );

      console.log(f, "ffff")
    }


    let num = Number(req.body.offerP)
    const insertedData = new OfferModel({
      name: req.body.name,
      description: req.body.description,
      type: req.body.offertype,
      status: 1,
      typeName: dynamic,
      offerPercentage: num,
      validity: req.body.validity,


    })

    data = await insertedData.save()
    res.redirect('/admin/listoffers')

  } catch (error) {
    console.log(error)

  }
  console.log(req.body, "body....")
  //res.render()
}
const DeleteOffer = async (req, res) => {
  let find = await OfferModel.findById(req.query.id)
  console.log(find, "find......")
  if (find.type == 'Product') {

    // Step 1: Find the document
    let product = await Product.findOne({ name: find.typeName });

    if (product) {
      // Step 2: Ensure the offer value is a number
      let offerValue = Number(product.offer);

      if (!isNaN(offerValue)) {
        // Step 3: Update the document if the offer value is valid
        let update = await Product.updateOne(
          { name: find.typeName },
          { $set: { offer: 0 } } // Set price to the offer value and reset offer to 0
        );
      } else {
        console.error("Offer value is not a valid number:", product.offer);
      }
    } else {
      console.error("Product not found:", find.typeName);
    }


  }
  const deletes = await OfferModel.findByIdAndDelete(req.query.id)
  res.redirect('/admin/listoffers')
}
const InActiveOffer = async (req, res) => {
  ///product Offer..........
  let find = await OfferModel.findById(req.query.id)
  console.log(find, "find......")
  if (find.type == 'Product') {

    // Step 1: Find the document
    let product = await Product.findOne({ name: find.typeName });

    if (product) {
      // Step 2: Ensure the offer value is a number
      let offerValue = Number(product.offer);

      if (!isNaN(offerValue)) {
        // Step 3: Update the document if the offer value is valid
        let update = await Product.updateOne(
          { name: find.typeName },
          { $set: { offer: 0 } } // Set price to the offer value and reset offer to 0
        );
      } else {
        console.error("Offer value is not a valid number:", product.offer);
      }
    } else {
      console.error("Product not found:", find.typeName);
    }

  }





  data = await OfferModel.findById(req.query.id)
  if (data.status) {
    const InActive = await OfferModel.findByIdAndUpdate(req.query.id, { $set: { status: 0 } })
    res.redirect('/admin/listoffers')
  } else {
    const Active = await OfferModel.findByIdAndUpdate(req.query.id, { $set: { status: 1 } })
    let update = await Product.updateOne(
      { name: find.typeName },
      { $set: { offer: 1 } } // Set price to the offer value and reset offer to 0
    );
    res.redirect('/admin/listoffers')
  }
  //Product offer inactive


}

const generateSalesReport = async (req, res) => {
  try {

    //Date Range sep
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1)
    let Data;
    ///end


    if (Object.keys(req.query).length > 0) {
      if (req.query.range == "daily") {
        Data = { $gte: startOfDay };
      } else if (req.query.range == "monthly") {
        Data = { $gte: startOfMonth }
      } else if (req.query.range == "yearly") {
        Data = { $gte: startOfYear }
      } else if (req.query.rangefrom && req.query.to) {
        let fromDate = new Date(req.query.rangefrom); // Custom start date
        let toDate = new Date(req.query.to);
        Data = { $gte: fromDate, $lte: toDate };
      }
    } else {
      Data = { $gte: startOfMonth };
    }
    console.log(Data)

    let Sales = await ListOrders.find({ filterDate: Data, "items.update": "Delivered" }).populate("items.productId").lean();
    console.log(Sales, "++++Sales")
    let totalpriced = 0
    let totaldiscount = 0
    let count = 0
    Sales.map((e) => {
      e.items.map((e) => {
        count += 1;
        totalpriced = totalpriced + (e.price * e.quantity)
        totaldiscount += e.offerPersonatge
        console.log(totalpriced, "totalpr")
      })
    })
    console.log(totalpriced, "total", totaldiscount)
    //coupen discount
    let copendiscount = 0;
    let coupen = await Coupens.find()
    coupen.map((e) => {
      if (e.usedCoupons.length != 0) {
        copendiscount = copendiscount + (e.usedCoupons.length * e.discount)
        console.log(e.usedCoupons.length, "one", e.discount)
      }
    })
    console.log(copendiscount, "dic+coun++")
    res.render("admin/saleReport.hbs", { admin: true, Sales, totalpriced, totaldiscount, copendiscount, count })
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).send('Server error');
  }
};

const PDFDow = async (req, res) => {
  try {
    let data = await ListOrders.find({ "items.update": "Deliverd" }).populate("items.productId").lean();

    generatePDF(data);

    function generatePDF(data) {
      const doc = new PDFDocument();
      const pdfFilePath = './saleReport.pdf';

      doc.pipe(fs.createWriteStream(pdfFilePath));

      // Header for the PDF
      doc.fontSize(18).text('Order Summary', { align: 'center', underline: true });
      doc.moveDown(1);

      // Loop through the data to add details for each order
      data.forEach(order => {
        doc.fontSize(14).text(`Order ID: ${order.OrderId}`, { bold: true });
        doc.text(`Payment Method: ${order.paymentMethod}`);
        doc.moveDown(0.5);

        // Adding a table-like structure for the items
        doc.text('Items:', { underline: true });
        order.items.forEach(item => {
          doc.fontSize(12)
            .text(`Product Name: ${item.productId.name}`, { continued: true })
            .text(` | Unit Price: ${item.productId.price} | Quantity: ${item.quantity} | Total Price: ${item.quantity * item.productId.price}`, { align: 'right' });
          doc.text(`Discount Offer: ${item.offerPersonatge || 'N/A'}`);
          doc.moveDown(0.5);
        });
        doc.moveDown(1);
      });

      // Display the total at the end of the PDF
      doc.fontSize(16).text(`Total: ${req.body.total}`, { align: 'right' });

      doc.end();

      // Send the file to download
      res.download(pdfFilePath);
    }
  } catch (err) {
    console.log(err);
  }
};

const ExcelDow = async (req, res) => {
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet('Orders');
  let orders = await ListOrders.find({ "items.update": "Deliverd" }).populate("items.productId").lean();

  worksheet.columns = [
    { header: 'Order ID', key: 'OrderId', width: 20 },
    //{ header: 'User ID', key: 'userId', width: 20 },
    //{ header: 'Cart ID', key: 'cartId', width: 20 },
    //{ header: 'Total Amount', key: 'totalAmount', width: 15 },
    { header: 'Payment Method', key: 'paymentMethod', width: 15 },
    // { header: 'Status', key: 'status', width: 10 },
    // { header: 'Shipping Full Name', key: 'fullName', width: 20 },
    // { header: 'Shipping Address', key: 'address', width: 40 },
    // { header: 'City', key: 'city', width: 15 },
    // { header: 'Postal Code', key: 'postalCode', width: 10 },
    // { header: 'State', key: 'state', width: 15 },
    // { header: 'Product ID', key: 'productId', width: 20 },
    { header: 'Product Name', key: 'productName', width: 20 },
    { header: 'Product Price', key: 'productPrice', width: 20 },
    { header: 'Product Unit', key: 'productUnit', width: 20 },

    { header: 'Total Price', key: 'producttotalPrice', width: 20 },
    { header: 'Product Discount', key: 'productDiscount', width: 20 }
    // { header: 'Product Description', key: 'productDescription', width: 30 },
  ];

  orders.forEach(order => {
    order.items.forEach(item => {
      worksheet.addRow({
        OrderId: order.OrderId,
        userId: order.userId,
        cartId: order.cartId,
        //totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        fullName: order.shippingAddress.fullName,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        postalCode: order.shippingAddress.postalCode,
        state: order.shippingAddress.state,
        productId: item.productId._id,
        productName: item.productId.name,
        productPrice: item.productId.price,
        productUnit: item.quantity,
        producttotalPrice: item.productId.price * item.quantity,
        productDiscount: item.offerPersonatge,
      });
    });
  });


  const filePath = './orders.xlsx';
  await workbook.xlsx.writeFile(filePath);
  res.download(filePath);
  console.log("+++Excel")
  console.log(req.body, "mmmm")
}

module.exports = {
  PDFDow,
  ExcelDow,
  generateSalesReport,
  InActiveOffer,
  DeleteOffer,
  PostOffers,
  AddOffers,
  ListOffers,
  DeleteCoupen,
  PostCoupen,
  AddCoupen,
  ListCoupens,
  ApproveReturn,
  OrderDetails,
  Cancel_Order,
  Delivered_Order,
  Orders,
  loadAdminLogin,
  blockUser,
  verifyadminLogin,
  adminLogout,
  listUser,
  loadHome,
  Shipped_Order,
};
