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
const csrf = require("csurf");
const flash = require("connect-flash");



//-File configuration

const MONGODBURI = "mongodb://Billy:bjc123@billy-shard-00-00-qqthk.mongodb.net:27017,billy-shard-00-01-qqthk.mongodb.net:27017,billy-shard-00-02-qqthk.mongodb.net:27017/shopp?ssl=true&replicaSet=Billy-shard-0&authSource=admin&retryWrites=true&w=majority";

const server = express();

const store = new MongoDBStore({

    uri: MONGODBURI, //the database to connect to
    collection: "sessions" // The name of the collection to store them
  
  });

const csrfProtection = csrf(); //Intialise the csurf protection -> saves to session as default

server.set("view engine", "ejs");//set the templating engine to ejs

server.use(express.static(path.join(__dirname, 'public')));//Allow the html to connect to css pages

server.use(bodyParser.urlencoded({extended: false}));//Set up the body parser

//=Middleware

server.use(session({secret: "my secret", resave: false, saveUninitialized: false, store: store}));

server.use(flash());

server.use(csrfProtection); //checks the csrf token is valid when a new request is run

server.use((req, res, next) => { //store a specific user in the request object

  if(!req.session.user){//if there is no logged in user stored in the request

    return next();//move onto the next middleware
  }

  User.findById(req.session.user._id)//Otherwise find the user that is logged in
  .then(user => { //returns the user from the database
    req.user = user; //and set the user to the user stored in the request
    next();//move onto the next function
  })
  .catch(err => console.log(err))//catch any errors
})

server.use((req, res, next) => {

  res.locals.isAuthenticated = req.session.isLoggedIn; //set the cookies for every request which will be passed to every page that is rendered
  res.locals.csrfToken = req.csrfToken();//req.csrfToken() generates a csrf token for every request and stores it in the local variables which are passed into the views
  next();

})

server.use('/admin', adminRouter);
server.use(mainRouter);
server.use(authRouter);

//* Database connection

mongoose
  .connect(
    MONGODBURI, {useNewUrlParser: true}
  )
  .then(result => {
    server.listen(5000);
    console.log("\x1b[35m", "\nServer online")
  })
  .catch(err => {
    console.log(err);
  });
