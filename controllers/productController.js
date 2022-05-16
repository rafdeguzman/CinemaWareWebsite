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

// products array to be passed in to the view for rendering
let products = [];

async function createProduct(req, res){
    const renderItems = {
        products: products
    }
    try{
        const added = await sql.addProduct(req.body.name, req.body.type, req.body.price, req.body.image);
        if(added){
            populateProducts();
            res.render('products.hbs', renderItems);
        }            
    } catch(error){
        logger.error(error);
        throw new sql.DBConnectionError();
    }   
}

async function showProducts(req, res){
    const renderItems = {
        products: products
    }
    try{
        const product = await sql.getProducts();
        for(let i = 0; i < product[0].length; i++){
            if(!containsObject({name: product[0][i].name}, products))
                products.push({id: product[0][i].id, name: product[0][i].name, type: product[0][i].type, price: product[0][i].price, image: product[0][i].image});
            else
                logger.info('item already exists, not adding to array')
        }
        res.render('products.hbs', renderItems);
    } catch(error){
        logger.error(error)
    }
    res.render('products.hbs', renderItems)
}

async function populateProducts(){
    const renderItems = {
        products: products
    }
    try{
        const product = await sql.getProducts();
        for(let i = 0; i < product[0].length; i++){
            if(!containsObject({name: product[0][i].name}, products))
                products.push({id: product[0][i].id, name: product[0][i].name, type: product[0][i].type, price: product[0][i].price, image: product[0][i].image});
            else
                logger.info('item already exists, not adding to array')
        }
    } catch(error){
        logger.error(error)
    }
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].name === obj.name) {
            return true;
        }
    }
    return false;
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
async function deleteItemFromCart(req, res){
    
    let name = req.body.name
    let index = list.findIndex(item => { return item.name === name; });
    list.splice(index, 1);

    let renderItems = {
        name: name
    }
    res.render("removeCartItemSuccess.hbs", renderItems);
}

function updateProduct(req, res){
    
}

router.get('/products', showProducts);
router.post('/products', createProduct);
router.put('/products', updateProduct);

router.post('/cart', showCart);
router.delete('/cart/remove', deleteItemFromCart)

module.exports = {
    populateProducts,
    showCart,
    router,
    routeRoot
}