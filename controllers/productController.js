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
    let isAdmin = await adminLoggedIn(req, res);
    const renderItems = {
        products: products,
        'isAdmin': isAdmin
    }
    try{
        const added = await sql.addProduct(req.body.name, req.body.type, req.body.price, req.body.image);
        if(added){
            populateProducts();
            res.render('products.hbs', renderItems);
            res.redirect('/products');
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
    try{
        const updated = await sql.updateProduct(req.body.id, req.body.name, req.body.type, req.body.price, req.body.image);
        if(updated){
            logger.info('Product updated successfully');
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
    try{
        const deleted = await sql.deleteProduct(req.body.id);
        if(deleted){
            logger.info('Product deleted');
            res.redirect('/products');
        }
    }catch(error){
        logger.error(error);
        throw new sql.DBConnectionError();
    }

}

async function adminLoggedIn(req, res){
    if(req.cookies['id'] == '1')  // if id is 1 that means logged in as admin
        return true;
    else return false;
}

/**
 * Handles the /products endpoint. Shows user all products from the products page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function showProducts(req, res){
    products = [];
    let isAdmin = await adminLoggedIn(req, res);
    const renderItems = {
        products: products,
        'isAdmin': isAdmin
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

async function showCartPage(req, res){
    const renderItems = {
        products: list,
    }
    res.render("cart.hbs", renderItems);
}

let recentlyViewedItems = [];
async function addToRecentlyViewedItems(req, res){
    if(req.body.addProduct && !containsObject({name: req.body.name, image: req.body.image}, recentlyViewedItems)){
        if(recentlyViewedItems.length > 2){ // if there are more than 3 products in recently viewed, 
            recentlyViewedItems = recentlyViewedItems.reverse() // reverse the array to get first item
            recentlyViewedItems.pop(); // pop the item from the array
            recentlyViewedItems.push({name: req.body.name, image: req.body.image});
        }else{
            recentlyViewedItems.push({name: req.body.name, image: req.body.image});
        }
        
    }
    res.cookie("recentlyViewed", recentlyViewedItems);
}



/**
 * Handles the /cart endpoint. Shows the user's shopping cart.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function showCart(req, res){
 
    addToRecentlyViewedItems(req, res);     // add to recentlyViewedItems when adding to cart

   if(!req.cookies['sessionId'] || req.cookies == null){
        res.render("error.hbs", {alertMessage: "You must be logged in to add to cart."})
    }
    else{
        if(req.body.addProduct){
            list.push({name: req.body.name, type: req.body.type, price: req.body.price});
        }
        res.cookie("shoppingCart", list, {expires: new Date(Date.now() + 300000)});
    
        const renderItems = {
            products: list,
        }
        res.render("cart.hbs", renderItems);
    }
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
 * remove all the cart item.
 */
 async function deleteAllItemFromCart(){
    
    list = [];
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

router.get('/cart', showCartPage);
router.post('/cart', showCart);
router.delete('/cart/remove', deleteItemFromCart);
router.get('/cart/buy', submitCart)

module.exports = {
    populateProducts,
    updateProduct,
    showCart,
    deleteItemFromCart,
    addToRecentlyViewedItems,
    submitCart,
    deleteAllItemFromCart,
    router,
    routeRoot
}
