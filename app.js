
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
//const mail=require('./config/mailer');

//  mail().then  ((s)=>{
//    console.log("Send seucce")
//  }).catch((e)=>{
//    console.log(e)
//  })

//Google auth


let port = process.env.port;
dbConnection()

app.use(session({
  secret: process.env.sessionSecret, resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 300000 }
}))

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine set up...............................
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname + '/views/layout/'),
  partialsDir: __dirname + '/views/partials'
}))

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

// Create a Simple Route....................
app.use('/', UserRouter);
app.use("/admin", adminRouter);

app.listen(port, () => {
  console.log(`Server Running on ${port}`)
})



