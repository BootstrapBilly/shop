//!Imports
//Core node

//Custom
const mainController = require("../controllers/mainController");

//External
const express = require("express");

//-File configuration

const router = express.Router();

router.get("/", mainController.getSlash);
router.get("/products", mainController.getProducts);

router.get("/product-detail/:productID", mainController.getProductDetail);

router.get("/add-to-cart/:productID", mainController.addToCart);
router.post("/remove-from-cart/:productID", mainController.removeFromCart);
router.get("/cart", mainController.getCart);

router.post("/order", mainController.postOrder);
router.get("/order", mainController.getOrder);

module.exports = router;