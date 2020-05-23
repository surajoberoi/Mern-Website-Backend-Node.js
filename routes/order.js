const express = require("express");
const router = express.Router();

const {getUserbyId,pushOrderInPurchaseList} = require("../controllers/user");
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/authentication");
const {updateStock} = require("../controllers/product")
const {getOrderbyId, createOrder, getAllorders,getOrderStatus,updateStatus} = require("../controllers/order")


//params
router.param("userId",getUserbyId)
router.param("orderId",getOrderbyId)


// actual routes
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder) 


//read route
router.get("/order/all/:userId", isSignedIn,isAuthenticated,isAdmin,getAllorders)

//status of order
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus)
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus);


module.exports = router