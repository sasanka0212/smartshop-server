const express = require('express');
const adminRoute = express.Router();

// add admin middleware
const admin = require('../middlewares/admin');
const {Product} = require('../models/product');
const Order = require('../models/order');

adminRoute.post("/admin/add-product", admin, async (req, res) => {
    try {
        const {name, description, price, quantity, images, category} = req.body;
        // initialize product card
        let product = new Product({
            name, 
            description,
            price,
            quantity,
            images,
            category
        });
        product = await product.save(); // it returns _id, _version
        res.json(product);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
})

// get all products
// /admin/get-products
// admin is a middleware
adminRoute.get("/admin/get-products", admin, async (req, res) => {
    try {
        const product = await Product.find({});
        // send the results via res.json()
        res.json(product);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// delete a product
adminRoute.post("/admin/delete-product", admin, async (req, res) => {
    try {
        const {id} = req.body;
        // find the product by its id and delete
        let product = await Product.findByIdAndDelete(id);
        res.json(product);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

adminRoute.get("/admin/get-orders", admin, async (req, res) => {
    try {
        let orders = await Order.find({});
        res.json(orders);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// update order status
adminRoute.post("/admin/update-order-status", admin, async (req, res) => {
    try {
        const {id, status} = req.body;
        let order = await Order.findById(id);
        order.status = status;
        order = await order.save();
        res.json(order);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
}); 

// get user analytics
adminRoute.get("/admin/analytics", admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        let totalEarnings = 0;
        for(let i = 0; i<orders.length; i++) {
            for(let j = 0; j<orders[i].products.length; j++) {
                totalEarnings += orders[i].products[j].quantity * orders[i].products[j].product.price;
            }
        }
        let mobileEarnings = await fetchCategoryWiseProducts('Mobiles');
        let essentialsEarnings = await fetchCategoryWiseProducts('Essentials');
        let appliencesEarnings = await fetchCategoryWiseProducts('Appliances');
        let booksEarnings = await fetchCategoryWiseProducts('Books');
        let fashionEarnings = await fetchCategoryWiseProducts('Fashion');

        let earnings = {
            totalEarnings,
            mobileEarnings,
            essentialsEarnings,
            appliencesEarnings,
            booksEarnings,
            fashionEarnings
        };
        res.json(earnings);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

async function fetchCategoryWiseProducts(category) {
    let earnings = 0;
    let categoryOrders = await Order.find({'products.product.category': category});
    for(let i = 0; i<categoryOrders.length; i++) {
        for(let j = 0; j<categoryOrders[i].products.length; j++) {
            earnings += categoryOrders[i].products[j].quantity * categoryOrders[i].products[j].product.price;
        }
    }
    return earnings;
}

module.exports = adminRoute;