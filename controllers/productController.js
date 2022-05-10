const express = require('express');
const sql = require('../models/productModelMySql');
const router = express.Router();
const Handlebars = require('handlebars');
const logger = require('../logger');
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

// hardcoded products 
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

async function createProduct(req, res){
    const renderItems = {
        products: products
    }
    try{
        const added = sql.addProduct(req.body.name, req.body.type, req.body.price);
        if(added){
            products.push({name: req.body.name, type: req.body.type, price: req.body.price})
            res.render('products.hbs', renderItems);
        }            
    } catch(error){
        logger.error(error);
        throw new sql.DBConnectionError();
    }   
}

async function populateProducts(req, res){
    const renderItems = {
        products: products
    }
    try{
        const product = await sql.getProducts();
        for(let i = 0; i < product[0].length; i++){
            products.push({name: product[0][i].name, type: product[0][i].type, price: product[0][i].price});
        }
        res.render('products.hbs', renderItems);
    } catch(error){
        logger.error(error)
    }
    
    res.render('products.hbs', renderItems)
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

function updateProduct(req, res){
    
}

router.get('/products', populateProducts)
router.post('/products', createProduct)
router.post('/cart', showCart)
router.put('/products', updateProduct)

module.exports = {
    showProducts,
    showCart,
    router,
    routeRoot
}