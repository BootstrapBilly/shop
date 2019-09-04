//!Imports
//Core node

//Custom
const User = require("../models/user");

//External
const bcrypt = require("bcryptjs");

//=Controller functions

exports.getSignUp = (req, res) => {

    res.render("auth/signup", 
    {
        pageTitle: "Sign Up",
        path: "/signup",
        isLoggedIn: req.session.isLoggedIn

    });

}

exports.postSignUp = (req, res) => {

    
    User.findOne({username : req.body.username})//check to see if the username already exists

    .then(user => {

        if(user) { //if a user with that username is found in the database, 

            return res.redirect("/signup")//redirect them to the signup page

        }

        //* If no existing username was found

        return bcrypt.hash(req.body.password, 12)//Encrypt the users password

        .then(hashedPassword => { //then with the hashed password

            const newUser = new User (//instantiate a new User object managed by mongoose

                {
                    username: req.body.username, //set the username supplied by the request
                    password: hashedPassword//Set the password to the encrypted password
                }
            )
                
                return newUser.save()//save the new user to the database with the mongoose method
                
                .then(response =>  res.redirect("/"))//then redirect the user to the home page

            })
        })

    //catch any possible errors
    .catch(err => console.log(err));

}

exports.getLogin = (req, res) => {

    let nooUser = req.flash("No-User-Found");
    let incorrecttPassword = req.flash("Incorrect-Password");

    if (nooUser.length > 0) { //if the array has anything inside it

        nooUser = nooUser[0]; //set message to the first element
    
      } else {
    
        nooUser = null; //otherwise set it to null
      }

      if (incorrecttPassword.length > 0) { //if the array has anything inside it

        incorrecttPassword = incorrecttPassword[0]; //set message to the first element
    
      } else {
    
        incorrecttPassword = null; //otherwise set it to null
      }


    res.render("auth/login", 
    {
        pageTitle: "Log In",
        path: "/login",
        isLoggedIn: req.session.isLoggedIn,
        noUser : nooUser,
        incorrectPassword : incorrecttPassword

    });
    
}

exports.postLogin = (req, res) => {

    User.findOne({username: req.body.username}) //search the database for the username

    .then(user => {
        
        if(!user) { //if there was no user found in the database
            
            req.flash("No-User-Found", "Your username was not found, please try again");

            return res.redirect("/login") //redirect them to the login page

        } 

           //*Otherwise if there was a user found 
            bcrypt.compare(req.body.password, user.password)//compare the given password with the password stored in the database //- Returns true if they match false if not
    
            .then(doMatch => {
    
                if(doMatch){
    
                    req.session.isLoggedIn = true; //add isLoggedIn cookie to the session
                    req.session.user = user;//Add the user as user cookie to the session

                    res.redirect("/");
    
                }
    
                else {

                    req.flash("Incorrect-Password", "The password you entered was incorrect, please try again");
                    res.redirect("/login")

                }
    
            }) 

    })
    
    .catch(err => console.log(err))

}

exports.getLogout = (req, res) => {

    //use the express session method to destroy the session and remove it from the database
    req.session.destroy((err) => {

        //console.log(err);
      
        res.redirect("/")
      
      })

}