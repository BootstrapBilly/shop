//!Imports
const mongoose = require("mongoose");

//-File config
const Schema = mongoose.Schema;

const userSchema = new Schema({

    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    cart: {//cart is an array of items and each user has a cart
        items: [//each item is an object with a productID and quantity
            {
            productID: {type: Schema.Types.ObjectId, ref: "Product", required:true}, // each item has a productID which is a special schema type ObjectID
            quantity: {type: Number, required: true}//each item has a quantity associated with it too
            }
        ]    
    }

});

userSchema.methods.addToCart = function(product) {

    const cartProductIndex = this.cart.items.findIndex(cartProduct => {//Search the cart for any items matching the product we are trying to insert (cartProduct)
        //returns a cart index if any cart productId (field in items array which is embedded in the cart) matches the _id of the product we are trying to insert
        //returns -1 if the product was not found in the cart
        return cartProduct.productID.toString() === product._id.toString();
    });

    let newQuantity = 1; //set the new quantity of the product to 1 (can only add 1 product at a time)
    const cartItems = [...this.cart.items];//store the current contents of the cart

    //! Product found in the cart
    if(cartProductIndex >= 0) { //if the index of the cart product is more than -1 (means it exists in the array/cart)

        newQuantity = this.cart.items[cartProductIndex].quantity + 1;//add 1 to the quantity of the cart item
        cartItems[cartProductIndex].quantity = newQuantity;//update the product in the items array with the new quantity

    }

    //! Product not found in the cart
    else { //if the cart does not contain the product

        cartItems.push({//push a new product into the cart

            productID: product._id, //set the productID to the new product id supplied by the parameter
            quantity: newQuantity//set the quantity to the new quantity

        });
    }

    //create an updated cart of cart items we just modified with the if else statement
    const updatedCart = {
        items: cartItems
    };

    //set the actual cart to the updated cart we just created
    this.cart = updatedCart;

    //save the new cart
    return this.save();

}

userSchema.methods.removeItemFromCart = function(_id) {

    const updatedCartItems = this.cart.items.filter(item => { //run a filter on the array of items, item is each index of the array

        //return an array containing everything that //!DOES NOT MATCH the _id being passed into the function by the controller
        //essentially removing the product id that was passed in from the array
        return item._id.toString() !== _id.toString(); 

    })

    this.cart.items = updatedCartItems;//update the cart by reassigning it to the new cart

    return this.save();//save the new cart to the database

}

userSchema.methods.clearCart = function() {

    this.cart = {items: []};//set the cart to an empty array
    return this.save(); //save the cart on the database

}


module.exports = mongoose.model("User", userSchema);