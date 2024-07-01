
const express=require('express')
require("dotenv").config()
const app=express();
const hbs=require('express-handlebars')
var UserRouter=require('./route/userRouter')
const path=require('node:path')
const cors=require('cors')
const session=require('express-session')
const dbConnection=require('./config/dbConnect')

let port=process.env.port; 
dbConnection()

// app.use(session({secret:process.env.sessionSecret,cookie:{maxAge:60000}}))

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine set up...............................
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

 app.engine('hbs', hbs.engine({
   extname:'hbs',
   defaultLayout:'layout',
   layoutsDir:path.join(__dirname+'/views/layout/'),
   partialsDir:__dirname+'/views/partials'
 }))

 app.use(express.static(path.join(__dirname, 'public')));

 // Create a Simple Route....................
  app.use('/',UserRouter);


 app.listen(port,()=>{
    console.log(`Server Running on ${port}`)
 })



