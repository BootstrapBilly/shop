//!Imports
//Core node

//Custom
const authController = require("../controllers/authController");

//External
const express = require("express");

//-File configuration

const router = express.Router();

router.get("/signup", authController.getSignUp);
router.post("/signup", authController.postSignUp);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/logout", authController.getLogout);

module.exports = router;