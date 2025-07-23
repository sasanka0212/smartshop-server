const mongoose = require('mongoose');
const { productSchema } = require('./product');

const userSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate: {
            validator: (value) => {
                //reqular expression used for email validation
                const re = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
                return value.match(re);
            },
            message: "Please enter valid email address",
        },
    },
    password: {
        required: true,
        type: String,
         validate: {
            validator: (value) => {
                return value.length > 6;
            },
            message: "Please enter valid password",
        },
    },
    address: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "user",
    },
    cart: [
        {
            product: productSchema,
            quantity: {
                type: Number,
                required: true,
            },
        }
    ]
});

// Creating a model in JavaScript according to the Schema
const User = mongoose.model("User", userSchema);

module.exports = User;