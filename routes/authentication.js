var express = require("express");
var router = express.Router();
const {check, validationResult} = require('express-validator');
const {signout, signup, signin, isSignedIn} = require("../controllers/authentication")


router.post("/signup",[
    check("name").isLength({min:3}).withMessage('must be at least 3 chars long'),
    check("email").isEmail().withMessage('Invalid Email'),
    check("password").isLength({min:3}).withMessage('must be at least 3 chars long')
], signup);


router.post("/signin",[
    check("email").isEmail(),
    check("password").isLength({min:1}).withMessage('password field is required')
], signin);



router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req,res) => {
    res.json(req.auth);
})



module.exports = router;


/*since signout method has been moved to "Controller folder"
we need to import the controller file here to access the signout 
method */

