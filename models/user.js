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
            productID: {type: Schema.Types.ObjectId, required:true}, // each item has a productID which is a special schema type ObjectID
            quantity: {type: Number, required: true}//each item has a quantity associated with it too
            }
        ]
        
    }

});

module.exports = mongoose.model("User", userSchema);