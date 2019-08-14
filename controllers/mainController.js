//!Imports
//Core node

//Custom
const Product = require("../models/product");

//External

//=Controller functions

exports.getSlash = (req, res) => {

    res.render("shop/slash", 
    {
        pageTitle: "Home",
        path: "/home",
        isLoggedIn: req.session.isLoggedIn

    });
    
}

exports.getProducts = (req, res) => {

    Product.find()

    .then(products => {

        console.log(products[0]);

        res.render("shop/products", 
        {
            pageTitle: "products",
            path: "/products",
            isLoggedIn: req.session.isLoggedIn,
            products: products
    
        });

    })
   
}

exports.getProductDetail = (req, res) => {

    const prodID = req.params.productID;

    Product.findById(prodID)

    .then(product => {

        res.render("shop/product-detail", 
        {
            pageTitle: product.title,
            path: "/products",
            isLoggedIn: req.session.isLoggedIn,
            product: product
    
        });

    })
   
}