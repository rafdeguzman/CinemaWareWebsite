const express = require('express');
const sql = require('../models/productsModel');
const router = express.Router();
const Handlebars = require('handlebars');
const routeRoot = '/';

let list = [];

/**
 * Found on StackOverflow
 * https://stackoverflow.com/questions/45983078/how-to-pass-a-data-array-from-express-js-to-ejs-template-and-render-them
 */

 Handlebars.registerHelper('grouped_each', function(every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
});

let products = [
    { name: 'Canon EOS Rebel T7', type: 'dslr', price: 500 },
    { name: 'Canon EOS Rebel T6', type: 'dslr', price: 500 },
    { name: 'Canon EOS Rebel T5', type: 'dslr', price: 500 },
    { name: 'Logitech Video Camera', type: 'video', price: 500 },
    { name: 'KODAK Mini Shot 2', type: 'dslr', price: 500 },
    { name: 'Logitech Webcam', type: 'webcam', price: 500 },
    { name: 'RED CAMERA', type: 'video', price: 2500 },
    { name: 'Canon G16', type: 'camera', price: 500 },
];
async function showProducts(req, res){
    const renderItems = { 
        products: products
    };
    res.render("products.hbs", renderItems);
}
async function showCart(req, res){

    if(req.body.addProduct){
        list.push({name: req.body.name, type: req.body.type, price: req.body.price});
    }
    res.cookie("shoppingCart", list, {expires: new Date(Date.now() + 300000)});

    const renderItems = {
        products: list,
    }
    res.render("cart.hbs", renderItems);
}

router.get('/products', showProducts)
router.post('/cart', showCart)

module.exports = {
    showProducts,
    showCart,
    router,
    routeRoot
}