const mongoose = require('mongoose');
const ratingSchema = require('./rating');

const productSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    category: {
        type: String,
        required: true
    },
    ratings: [ratingSchema]
});

const Product = mongoose.model("Product", productSchema);

// to use that we export two things in destructured format
module.exports = { Product, productSchema };