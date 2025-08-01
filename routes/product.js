const express = require('express');
const {Product} = require('../models/product');
const auth = require('../middlewares/auth');

const productRouter = express.Router();

// get the products
productRouter.get('/api/products', auth, async (req, res) => {
    try {
        console.log(req.query.category);
        const products = await Product.find({category: req.query.category});
        res.json(products);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// get products according to search
productRouter.get('/api/products/search/:name', auth, async (req, res) => {
    try {
        // this will follow the search pattern
        const products = await Product.find({
            name: {$regex: req.params.name, $options: 'i'}
        });
        res.json(products);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// push the ratings of a product
productRouter.post('/api/rate-product', auth, async (req, res) => {
    try {
        const {id, rating} = req.body;
        let product = await Product.findById(id);

        for(let i = 0; i<product.ratings.length; i++) {
            if(product.ratings[i].userId == req.user) {
                product.ratings.splice(i, 1);
                break;
            }
        }
        const ratingSchema = {
            userId: req.user,
            rating
        };
        product.ratings.push(ratingSchema);
        product = await product.save();
        // send the response back
        res.json(product);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

productRouter.get('/api/deal-of-day', auth, async (req, res) => {
    try {
        // fetch all the products first
        let products = await Product.find({});
        // sort the products array based on total ratings
        products = products.sort((a, b) => {
            let aSum = 0;
            let bSum = 0;
            for(let i = 0; i<a.ratings.length; i++)
                aSum += a.ratings[i].rating;
            for(let i = 0; i<b.ratings.length; i++)
                bSum += b.ratings[i].rating;
            return aSum < bSum ? 1 : -1;
        });
        res.json(products[0]);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

module.exports = productRouter;