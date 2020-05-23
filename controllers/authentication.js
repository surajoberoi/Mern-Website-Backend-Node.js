const User = require("../models/user");
const {check, validationResult} = require('express-validator');
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

//SIGNUP ROUTE exported to "Authentication in routes"
exports.signup = (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
           error: errors.array()[0].msg,
           at_param: errors.array()[0].param
        })
    }

   const user = new User(req.body);     // "user" is the object of the model/class User which has all the schema
   user.save((err,user) => {            // saving the user to the DB
       if(err){
           return res.status(400).json({
               err: "Not able to save user in DB"
           });
       }
       res.json({
           name: user.name,
           email: user.email,
           id: user._id
       });
   });
};

//SIGNIN ROUTE exported to "Authentication in routes"
exports.signin = (req, res) => {

    const errors = validationResult(req)
    const {email, password} = req.body;

    if(!errors.isEmpty()){
        return res.status(422).json({
           error: errors.array()[0].msg,
           at_param: errors.array()[0].param
        });
    }
User.findOne({email}, (err,user) => {
    if(err || !user){      // same check appilied below for the same reason.. both do the same work !
        return res.status(400).json({
            error: "User email does not exist"
        })
    }
//  mongoDB findone method return null if it doesnt find anything so therefore changing code to user === null || "Rest Same"

    if(!user.authenticate(password)){
        return res.status(401).json({
        error: "Email and password do not match"
    });
    }


    // crete token.. using the signIn method using the "_id" from the user model
    const token = jwt.sign({_id:user._id},process.env.SECRET)
    // put token in user cookie
    res.cookie("token", token, {expire: new Date() + 9999 });

    // send response to front end

    const {_id, name, email, role} = user;
    return res.json({token, user: {_id, name, email, role } });
});
};


//SIGNOUT ROUTE exported to "Authentication in routes"
exports.signout = (req, res)=>{
    
    res.clearCookie("token")    // clearing the value set in the token
    res.json({
        message: "User signed out successfully"  // throwing response through Json in key: value pairs
    });
};


//protected routes "the route : can only be accessed if the it has the token of the already logged in user"
// That token should be with the Bearer in authorization
//auth: is a property which is added to the route , it contains the _id of the user logged in
// SECRET KEY : token cans be shared.. SECRET key is used to verify the tokens shared

exports.isSignedIn = expressJwt({           //REVISE
    secret : process.env.SECRET,
    userProperty: "auth"
})


// custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "Access Denied"
        })

    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role===0){
        return res.status(403).json({
            error: "Only Admin"
        })
    }
    next();
}





/* Route name and controller name has to be same at all costs.
 All the authentication methods are inside the authentication controller.
 understand use of exports */

 /* token creation and setting token in cookie
 Bearer Token :
*/
