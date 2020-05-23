const express = require("express");
const router = express.Router();

const {getUserbyId, getUser,updateUser, userPurchaseList} = require("../controllers/user");
const {isAuthenticated, isAdmin, isSignedIn} = require("../controllers/authentication");

router.param("userId", getUserbyId)

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser); // whenever there is "userId" in the url, it will first call getUserbyId function which is a middleware and then the getUser function. 
router.put("/user/:userId",isSignedIn, isAuthenticated, updateUser);
router.get("/orders/user/:userId",isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;
