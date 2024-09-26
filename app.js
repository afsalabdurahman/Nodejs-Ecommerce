const Swal = require('sweetalert2')
const express = require('express')
const passport = require('passport');
require("dotenv").config()
const app = express();
const hbs = require('express-handlebars')

var UserRouter = require('./route/userRouter')
const path = require('node:path')
const cors = require('cors')
const session = require('express-session')
const dbConnection = require('./config/dbConnect')
var adminRouter = require('./route/adminRouter')
require('./middleware/googleAuth')
// var mailer = require('./config/mailer/mailer')

// mailer().then((r) => {
//   console.log(r)
// })
//Google auth


let port = process.env.port;
dbConnection()

app.use(session({
  secret: process.env.sessionSecret, resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}))

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine set up...............................
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// custom hbs for looping
const exhbs = hbs.create({})
exhbs.handlebars.registerHelper('repeat', function (n, block) {
  let accum = '';
  for (let i = 1; i <= n; ++i) {
    accum += block.fn(i);
  }
  return accum;
});


//custom hbs for if else........

exhbs.handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  if (arg1 == arg2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

//custome hbs for @index strat with 1
exhbs.handlebars.registerHelper('inc', function (value, options) {
  return parseInt(value) + 1;
});
// Arthimatic opration find discount price


exhbs.handlebars.registerHelper('applyDiscount', function (price, discount) {
  
  discountedPrice= price - (price * (discount / 100));
  return Math.round(discountedPrice); 
});

/////////

exhbs.handlebars.registerHelper()
app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname + '/views/layout/'),
  partialsDir: __dirname + '/views/partials'
}))


//jsonhbs for pdf..


exhbs.handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context);
});


////price*quadity custome hook

exhbs.handlebars.registerHelper('totalPrice', function (price, quantity) {
  return price * quantity;
});

///object id from id
exhbs.handlebars.registerHelper('getId', function (idObject) {
  if (typeof idObject === 'object') {
    return idObject._id || Object.values(idObject)[0];
  }
  return idObject;
});

//Is object is emty or not
exhbs.handlebars.registerHelper('isEmpty', function (obj, options) {
  if (Object.keys(obj).length === 0) {
    return options.fn(this); // Return the "true" block if the object is empty
  } else {
    return options.inverse(this); // Return the "else" block if the object is not empty
  }
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

// Create a Simple Route....................
app.use('/', UserRouter);
app.use("/admin", adminRouter);


app.listen(port, () => {
  console.log(`Server Running on ${port}`)
})



