//!Imports
//Core node

//Custom
const Product = require("../models/product");

//External

//=Controller functions

exports.getAddProduct = (req, res) => {

    res.render("admin/add-product", 
    {
        pageTitle: "Add Product",
        path: "/add-product",
        isLoggedIn: req.session.isLoggedIn

    });

}

exports.postAddProduct = (req, res) => {

    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product({

        title : title,
        imageUrl : imageUrl,
        description : description,
        price : price
    })

    product.save()

    .then(outcome => res.redirect("/"))

    .catch(err => console.log(err));
}

exports.getManageProducts = (req, res) => {

    Product.find()

    .then(products => {

        res.render("admin/manage-products", 
        {
            pageTitle: "Manage Products",
            path: "/manage-products",
            isLoggedIn: req.session.isLoggedIn,
            products: products
    
        });

    })

    .catch(err => console.log(err));


}

exports.getDeleteProduct = (req, res) => {

    const prodID = req.params.productID;

//call the findByIdAndRemove function supplied by mongoose
  Product.findByIdAndRemove(prodID)
  //Handle the promise
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/products');
    })
    .catch(err => console.log(err));

};

exports.getModifyProduct = (req, res) => {

const prodID = req.params.productID;

Product.findById(prodID)

.then(product => {

    res.render("admin/modify", {

        pageTitle: product.title,
        path: "/manage-products",
        product: product,
        isLoggedIn: req.session.isLoggedIn

    })
})

};

exports.postModifyProduct = (req, res) => {

    Product.findById(req.body._id)

    .then(product => {

        product.title =  req.body.title,
        product.imageUrl = req.body.imageUrl,
        product.description = req.body.description,
        product.price = req.body.price

        product.save()

        .then(result => res.redirect("/admin/manage-products"))
        .catch(err => console.log(err))
    })

    .catch(err => console.log(err));

}