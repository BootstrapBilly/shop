//!Imports
//Core node

//Custom
const adminController = require("../controllers/adminController");
const isAuth = require("../middleware/is-auth");

//External
const express = require("express");

//-File configuration

const router = express.Router();

//adding products
router.get("/add-product", isAuth, adminController.getAddProduct);
router.post("/add-product", isAuth, adminController.postAddProduct);

//Product management
router.get("/manage-products", isAuth, adminController.getManageProducts);
router.get("/delete/:productID", isAuth, adminController.getDeleteProduct);
//load modify page
router.get("/modify/:productID", isAuth, adminController.getModifyProduct);
//update the product
router.post("/update-product", isAuth, adminController.postModifyProduct);

module.exports = router;