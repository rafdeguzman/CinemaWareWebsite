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

/**
 * Handles the /products endpoint. Adds a product to the database.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
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

/**
 * Handles the /products/update endpoint. Update the information of a product in the database.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function updateProduct(req, res){
    const renderItems = {
        products: products
    }
    try{
        const updated = await sql.updateProduct(req.body.id, req.body.name, req.body.type, req.body.price, req.body.image);
        if(updated){
            res.redirect('/products');
        }            
    } catch(error){
        logger.error(error);
        throw new sql.DBConnectionError();
    }   
}

/**
 * Handles the /products/delete endpoint. Deletes a product from the database.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function deleteProduct(req, res){
    const renderItems = {
        products: products
    }
    try{
        const deleted = await sql.deleteProduct(req.body.id);
        if(deleted){
            res.redirect('/products');
        }
    }catch(error){
        logger.error(error);
        throw new sql.DBConnectionError();
    }

}

/**
 * Handles the /products endpoint. Shows user all products from the products page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function showProducts(req, res){
    products = [];
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
    products = [];
    const renderItems = {
        products: products
    }
    try{
        const product = await sql.getProducts();
        for(let i = 0; i < product[0].length; i++){
            if(!containsObject({name: product[0][i].id}, products))
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

/**
 * Handles the /cart endpoint. Shows the user's shopping cart.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function showCart(req, res){
 
   if(!req.cookies['sessionId']){
        res.redirect("/products");
    }
 
    if(req.body.addProduct){
        list.push({name: req.body.name, type: req.body.type, price: req.body.price});
    }
    res.cookie("shoppingCart", list, {expires: new Date(Date.now() + 300000)});

    const renderItems = {
        products: list,
    }
    res.render("cart.hbs", renderItems);
}

/**
 * Handles the /cart/remove endpoint. Shows the user that a cart item has been removed.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function deleteItemFromCart(req, res){
    
    let name = req.body.name
    let index = list.findIndex(item => { return item.name === name; });
    list.splice(index, 1);

    let renderItems = {
        name: name
    }
    res.render("removeCartItemSuccess.hbs", renderItems);
}

/**
 * Handles the /cart/buy endpoint. Shows the user that their order was successful.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function submitCart(req, res){
    try{
        let cartList = req.cookies.shoppingCart;
        let userId = req.cookies.id;
        await sql.createOrder(cartList, userId);
        list = [];
        res.cookie("shoppingCart", null, {expires: new Date(Date.now())});

        res.render('submitCart.hbs', null)
    } catch (e) {
        logger.info(e);
        throw new sql.DBConnectionError();
    }
}

router.get('/products', showProducts);
router.post('/products', createProduct);
router.post('/products/update', updateProduct);
router.post('/products/delete', deleteProduct);

router.post('/cart', showCart);
router.delete('/cart/remove', deleteItemFromCart);
router.get('/cart/buy', submitCart)

module.exports = {
    populateProducts,
    updateProduct,
    showCart,
    deleteItemFromCart,
    submitCart,
    router,
    routeRoot
}
