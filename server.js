//!Imports
//Core node
const path = require("path");

//Custom
const mainRouter = require("./routes/mainRouter");
const authRouter = require("./routes/authRouter");
const adminRouter = require("./routes/adminRouter");
const User = require("./models/user");


//External
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require('mongoose');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);



//-File configuration

const MONGODBURI = "mongodb://Billy:bjc123@billy-shard-00-00-qqthk.mongodb.net:27017,billy-shard-00-01-qqthk.mongodb.net:27017,billy-shard-00-02-qqthk.mongodb.net:27017/shopp?ssl=true&replicaSet=Billy-shard-0&authSource=admin&retryWrites=true&w=majority";

const server = express();

const store = new MongoDBStore({

    uri: MONGODBURI, //the database to connect to
    collection: "sessions" // The name of the collection to store them
  
  });

server.use(session({secret: "my secret", resave: false, saveUninitialized: false, store: store}));

server.set("view engine", "ejs");//set the templating engine to ejs

server.use(express.static(path.join(__dirname, 'public')));//Allow the html to connect to css pages

server.use(bodyParser.urlencoded({extended: false}));//Set up the body parser

//=Middleware

server.use((req, res, next) => { //store a specific user in the request object

  User.findById("5d5426f2bf5dcf2cc42bda49")//find the fake user by id
  .then(user => { //returns the user from the database
    req.user = user; //create a new user to store in the request object and map it with the values we just pulled from the database
    next();//move onto the next function
  })
  .catch(err => console.log(err))//catch any errors
})

server.use('/admin', adminRouter);
server.use(mainRouter);
server.use(authRouter);

//* Database connection

mongoose
  .connect(
    MONGODBURI
  )
  .then(result => {
    server.listen(5000);
    console.log("connection established")
  })
  .catch(err => {
    console.log(err);
  });
