const bcrypt = require("bcrypt");
const User = require("../../model/userModel");
const ReturnOrders = require("../../model/ReturnOrderModel");
const Category = require("../../model/categoryMode");
const PDFDocument = require('pdfkit')
const ExcelJs = require('exceljs')
const fs = require('fs')
const User_schema = require("../../model/userModel");
const Product = require("../../model/productModel");
const { products, Cart } = require("../user/userController");
const UserCart = require("../../model/cartModel");
const { ObjectId } = require('mongoose').Types;
const CoupenModel = require('../../model/CoupenModel')
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
    const adminData = await User.findById(req.session.admin_id);
    console.log(req.session.admin_id, "loadHome");
    if (adminData) {
      res.render("admin/adminHome.hbs", { admin: adminData });
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
    const docCount = await UserCart.countDocuments();
    console.log(docCount, "count")

    let val = docCount / 3
    count = Math.ceil(val)
    const perPage = Math.round(count / 3)
    let Data = await UserCart.find({ orderStatus: { $in: ["Processing", "Cancelled", "Shipped", "Returned"] } }).sort({ _id: -1 }).skip((pages - 1) * perPage).limit(3).populate("ProductId").lean()

    res.render("admin/Orders.hbs", { Data, admin: true, count })

  } catch (error) {
    res.redirect('/error');
  }


}

const OrderDetails = async (req, res) => {
  console.log(req.query.id, "isss")
  id = req.query.id;
  const usercart = await UserCart.findById(req.query.id).populate("ProductId").lean()
  console.group(usercart)
  const ReturnStatus = await ReturnOrders.findOne({ OrderId: req.query.id }).lean()
  console.log(ReturnStatus, "retun stat")
  res.render('admin/OrderDetails.hbs', { admin: true, usercart, id, ReturnStatus })
}

const Cancel_Order = async (req, res) => {
  try {
    console.log(req.query.id, "qury id from cart")
    const prettyDate = new Date().toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',

      hour12: true,
    });
    const Data = await UserCart.updateOne({ _id: req.query.id }, {

      $set: {
        orderStatus: 'Cancelled',
        Date: prettyDate,
      }
    }, { upsert: true })

    res.redirect(`/admin/orderdetails?id=${req.query.id}`)

  } catch (error) {
    res.redirect('/error')
  }
}
const Shipped_Order = async (req, res) => {
  try {
    console.log(req.query.id, "qury id from cart")
    const prettyDate = new Date().toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',

      hour12: true,
    });
    const Data = await UserCart.updateOne({ _id: req.query.id }, {

      $set: {
        orderStatus: 'Shipped',
        Date: prettyDate,
      }
    }, { upsert: true })

    res.redirect(`/admin/orderdetails?id=${req.query.id}`)

  } catch (error) {
    res.redirect('/error')
  }
}
const ApproveReturn = async (req, res) => {

  console.log(req.query.id)
  const reqReturn = await UserCart.findByIdAndUpdate(
    { _id: req.query.id },
    { $set: { ReturnStatus: "ReturnApprove", orderStatus: "Returned" } },
    { upsert: true }
  );

  res.redirect('/admin/orders')
  console.log(req.query)
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
      let price = await Product.findOne({ name: req.body.Productlists })
      let c = price.price - (price.price * offerPer / 100);
      let discountprice = c.toFixed(0)
      let f = await Product.updateOne(
        { name: req.body.Productlists },  // Filter to find the document by product name
        { $set: { price: discountprice, offer: price.price } },    // Update operation to set the 'offer' field
        { upsert: true }                  // Option to create the document if it doesn't exist
      );

      console.log(f, "ffff")
    }


    num = Number(req.body.offerP)
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
          { $set: { price: offerValue, offer: null } } // Set price to the offer value and reset offer to 0
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
          { $set: { price: offerValue, offer: null } } // Set price to the offer value and reset offer to 0
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
    res.redirect('/admin/listoffers')
  }
  //Product offer inactive


}

const generateSalesReport = async (req, res) => {
  try {
    console.log(req.query, "qury")
    const { year, month, week, customStartDate, customEndDate } = req.query;
    let startDate, endDate;

    // Determine the date range based on the query parameters
    if (year) {
      startDate = new Date(`${year}-01-01`);
      endDate = new Date(`${year}-12-31`);
    } else if (month) {
      startDate = new Date(`${year}-${month}-01`);
      endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1) - 1);
    } else if (week) {
      const [year, weekNumber] = week.split('-');
      const firstDayOfYear = new Date(year, 0, 1);
      const daysOffset = (weekNumber - 1) * 7;
      startDate = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset));
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    } else {
      // Default to the current year if no filter is provided
      const currentYear = new Date().getFullYear();
      startDate = new Date(`${currentYear}-01-01`);
      endDate = new Date(`${currentYear}-12-31`);
    }

    // Fetch orders within the specified date range
    const orders = await UserCart.find({
      orderStatus: 'Shipped',
      //  createdAt: { $gte: startDate, $lte: endDate }
    }).populate("ProductId");
    console.log(orders, "ordersss")
    ///pdf Genertae



    men = orders.map((e) => {
      let productid = e.ProductId.category
      if (productid == "6699057c3cefcb99d7d7fe63") {
        return {
          productname: e.ProductId.name,
          productsize: e.size,
          productqunatity: e.quandity,
          productprice: e.ProductId.price,
          producttotal: e.TotalAmount
        }
      }
    })
    let total = 0
    m = [];
    men.map((e) => {
      if (e != undefined) {
        m.push(e)
        total += e.producttotal
      }
    })
    console.log(total)
    console.log(m, "mmmm")
    let women = orders.map((e) => {
      let productid = e.ProductId.category
      if (productid == "669951b01934f70cb7148e6e") {
        return {
          productname: e.ProductId.name,
          productsize: e.size,
          productqunatity: e.quandity,
          productprice: e.ProductId.price,
          producttotal: e.TotalAmount
        }
      }
    })
    w = []
    women.map((e) => {
      if (e != undefined) {
        w.push(e)
        total += e.producttotal
      }
    })
    console.log(total)
    kid = orders.map((e) => {
      let productid = e.ProductId.category
      if (productid == "669a10c1dfed884d9985a01c") {
        return {
          productname: e.ProductId.name,
          productsize: e.size,
          productqunatity: e.quandity,
          productprice: e.ProductId.price,
          producttotal: e.TotalAmount
        }
      }
    })
    k = []
    kid.map((e) => {
      if (e != undefined) {
        k.push(e)
        total += e.producttotal
      }
    })

    // if (orders.ProductId.category == "6699057c3cefcb99d7d7fe63") {
    //   men.name = orders.ProductId.name
    //   men.TotalAmount = orders.ProductId.TotalAmount
    //}

    // Process data to generate report
    console.log(total)
    //total sales count

    const salesCount = await UserCart.countDocuments({
      orderStatus: 'Shipped',
    });
    // total discount
    discountfind = await UserCart.find({
      orderStatus: "Shipped",

    })
    //end

    res.render("admin/saleReport.hbs", { m, w, k, total, salesCount, admin: true })
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).send('Server error');
  }
};

const PDFDow = (req, res) => {
  try {
    const { m, w, k, total } = req.body;

    // Parse the JSON strings back to objects
    const menData = JSON.parse(m || '[]');  // Default to an empty array if m is undefined
    const womenData = JSON.parse(w || '[]');
    const kidsData = JSON.parse(k || '[]');

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    const pdfFilePath = './saleReport.pdf';
    doc.pipe(fs.createWriteStream(pdfFilePath));

    // Title
    doc.fontSize(25).text('Sales Report', { align: 'center' });
    doc.moveDown(2);

    const tableHeaders = ["Product Name", "Size", "Quantity", "Price", "Total"];
    const tableColumnPositions = [50, 200, 300, 400, 500]; // X positions for each column
    const rowHeight = 20;

    // Add a table header
    const addTableHeader = () => {
      doc.fontSize(14).fillColor('black');
      tableHeaders.forEach((header, i) => {
        doc.text(header, tableColumnPositions[i], doc.y, { width: 100, align: 'left' });
      });
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Draw a line below the header
      doc.moveDown(0.5);
    };

    // Add a table row
    const addRow = (item) => {
      doc.fontSize(12).fillColor('black');
      doc.text(item.productname, tableColumnPositions[0], doc.y, { width: 150, align: 'left' });
      doc.text(item.productsize, tableColumnPositions[1], doc.y, { width: 100, align: 'left' });
      doc.text(item.productqunatity, tableColumnPositions[2], doc.y, { width: 100, align: 'left' });
      doc.text(`$${item.productprice}`, tableColumnPositions[3], doc.y, { width: 100, align: 'left' });
      doc.text(`$${item.producttotal}`, tableColumnPositions[4], doc.y, { width: 100, align: 'left' });
      doc.moveDown();
    };

    // Add a section to the PDF
    const addSectionToPDF = (sectionName, data) => {
      if (data.length > 0) {
        doc.moveDown(1);
        doc.fontSize(18).fillColor('blue').text(sectionName, { align: 'left' });
        doc.moveDown(0.5);
        addTableHeader();
        data.forEach(item => addRow(item));
        doc.moveDown(1);
      }
    };

    // Add each section
    addSectionToPDF('Men Dresses', menData);
    addSectionToPDF('Women Dresses', womenData);
    addSectionToPDF('Kids Dresses', kidsData);

    // Total Sales
    doc.fontSize(18).fillColor('black').text(`Total Sales: $${total}`, { align: 'left' });
    doc.moveDown(2);
    doc.end();

    // Download the PDF
    res.download(pdfFilePath);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Server error');
  }
}


module.exports = {
  PDFDow,
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
  Orders,
  loadAdminLogin,
  blockUser,
  verifyadminLogin,
  adminLogout,
  listUser,
  loadHome,
  Shipped_Order,
};
