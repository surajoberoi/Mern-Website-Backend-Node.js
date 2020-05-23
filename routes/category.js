const express = require("express");
const router = express.Router();

const {getCategoryById,createCategory,getCategory,getAllCategory,updateCategory,removeCategory} = require("../controllers/category");
const {getUserbyId} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/authentication");

//params
router.param("userId",getUserbyId);     //addition of user Id in url because of PARAM
router.param("categoryId",getCategoryById);


//actual routes (create)
router.post("/category/create/:userId",isSignedIn, isAuthenticated, isAdmin, createCategory)

// read routes
router.get("/category/:categoryId", getCategory)
router.get("/Allcategories", getAllCategory)


//update (MOST OF THE TIMMES THE CREATE AND UPDATE ROUTES ARE ALMOST THE SAME)
router.put("/category/:categoryId/:userId",isSignedIn, isAuthenticated, isAdmin, updateCategory)


//delete
router.delete("/category/:categoryId/:userId",isSignedIn, isAuthenticated, isAdmin, removeCategory)



module.exports = router;


/*
whenever we write ":getCategoryId" or ":userId" out program gets to know that it has to execute the 
middleware mentioned in the "router.param"
*/