//!Imports
//Core node

//Custom
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

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

exports.addToCart = (req, res) => {

    const prodID = req.params.productID;//extract the product id from the request

    Product.findById(prodID)//find the product in the database using the id

    .then(product => {

        res.redirect("/products")//redirect the user back to products
        return req.user.addToCart(product);//add the product to the user's cart which is stored in the request object

    })

    .then(outcome => console.log("Added to cart"))

    .catch(err => console.log(err));
   
}

exports.getCart = (req, res) => {

    req.user //using the user stored in the request object(signed in)
    .populate("cart.items.productID")//populate the user's cart with full product info using the productID already stored within the cart rather than just product id
    .execPopulate()//Make the populate method return a promise so we can chain .then

    .then(user =>{ //then with the user's cart now containing full product info nested in productID thanks to the populate function
        
        const cartItems = user.cart.items;//then store the items in the cart

        res.render("shop/cart", { //render the cart page

            pageTitle: "cart",
            path: "/cart",
            isLoggedIn: req.session.isLoggedIn,
            cartItems: cartItems, //supply it with the cart item info

        })
    })

    .catch(err => console.log(err));

}

exports.removeFromCart = (req, res) => {

    const productID = req.params.productID;

    req.user.removeItemFromCart(productID);

    res.redirect("/cart");

}

exports.postOrder = (req, res) => {

    req.user //using the user stored in the request object(signed in)
    .populate("cart.items.productID")//populate the user's cart with full product info using the productID already stored within the cart rather than just product id
    .execPopulate()//Make the populate method return a promise so we can chain .then

    .then(user =>{ //then with the user's cart now containing full product info nested in productID thanks to the populate function
        
        const cartItems = user.cart.items
        .map(item => { //map the cartItems array to a new array containing the info we need

            return {

                //pull the product info from the productID stored in the array (the full details are stored inside productID because we used populate)
                productData: {...item.productID._doc}, //!the ...spread and ._doc is used get the full product details on the database
                quantity: item.quantity //pull the quantity stored in the array

            };
    
        });
        
        const order = new Order({ //create a new order by instantiating the order model

            products: cartItems,
            user: { //define the user
                username: req.user.username, //pull the username from the user stored in the request
                userId: req.user._id //pull the id from the _id user stored in the request
            }
        });

        return order.save() //save the order to the database

        .then(result => {

            req.user.clearCart();

        })

        .then(result => {

            res.redirect("/");

        })

        .catch(err => console.log(err));
    })
    
}

exports.getOrder = (req, res) => {

    Order.find({"user.userId" : req.user._id})
    
    .then(orders => {

        console.log(orders[0].products[0])

        res.render("shop/order", {
            pageTitle: "Orders",
            path: "/order",
            products: orders[0].products,
            isLoggedIn: req.session.isLoggedIn
        })

    })
    .catch(err => console.log(err));
}
