//!Imports
//Core node

//Custom
const adminController = require("../controllers/adminController");

//External
const express = require("express");

//-File configuration

const router = express.Router();

//adding products
router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);

//Product management
router.get("/manage-products", adminController.getManageProducts);
router.get("/delete/:productID", adminController.getDeleteProduct);
//load modify page
router.get("/modify/:productID", adminController.getModifyProduct);
//update the product
router.post("/update-product", adminController.postModifyProduct);

module.exports = router;