//!Imports
const mongoose = require("mongoose");

//-File config
const Schema = mongoose.Schema;

const orderSchema = new Schema({

    products: [//Products is an array of objects containing the product data and the quantity of products in the cart
        { //! Its an array because one order may have many products

            productData: { //Product data contains all of the product details

                type: Object, 
                required: true
            }, 

            quantity: { //quanitity contains amount of items in the cart

                type: Number, 
                required: true       
            }
    }
],

    user: { //user stores all of the user details
        //! Its not an array because one only has one user

        username: { 

            type: String,
            required: true

        },

        userId: {

            type: Schema.Types.ObjectId,
            required: true,
            ref: "User" //userId refers to the user model

        }
    }

});

module.exports = mongoose.model("Order", orderSchema);