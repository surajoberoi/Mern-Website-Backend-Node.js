const express = require("express");
const router = express.Router();


const {getProductById,createProduct,getProduct,photo,deleteProduct,updateProduct,getAllproducts,getAllUniqueCategories} = require("../controllers/product");
const {getUserbyId} = require("../controllers/user");
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/authentication");


//Params
router.param("userId",getUserbyId);
router.param("productId", getProductById);


//create route
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin, createProduct)
//Read and middleware router
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//delete route
router.delete("/product/:productId/:userId", isSignedIn,isAuthenticated,isAdmin,deleteProduct)

//update route
router.put("/product/:productId/:userId", isSignedIn,isAuthenticated,isAdmin,updateProduct)

//listing all products route
router.get("/products",getAllproducts)

router.get("/products/categories", getAllUniqueCategories)

module.exports = router;