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
    let lang = req.cookies.language;
    let current;
    let productType;
    let productId;
    let update;
    let deleteItem;
    let addCart;
    let enterInfo;
    let submit;
    let close;
    let name;
    let price;

    if (!lang || lang === 'en') {
        current = 'English';
        productId = 'Product Id: ';
        productType = 'Product type: ';
        update = 'update';
        deleteItem = 'delete';
        addCart = 'Add to Cart';
        enterInfo = 'Enter Product info';
        submit = 'Submit';
        close = 'Close';
        name = 'Name'
        price = 'Price'

    } else {
        current = "French"
        productId = 'Id du produit: ';
        productType = 'type de produit: ';
        update = 'mettre à jour';
        deleteItem = 'supprimer';
        addCart = 'Ajouter au panier';
        enterInfo = 'Entrez Info du Produit';
        submit = 'Soumettre';
        close = 'fermer'
        name = 'Nom'
        price = 'prix'
    }

    const renderItems = {
        products: products,
        productId: productId,
        productType: productType,
        update: update,
        deleteItem: deleteItem,
        addCart: addCart,
        enterInfo: enterInfo,
        submit:submit,
        close: close,
        name: name,
        price: price
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
    let lang = req.cookies.language;
    let current;
    let productType;
    let productId;
    let update;
    let deleteItem;
    let addCart;
    let enterInfo;
    let submit;
    let close;
    let name;
    let price;

    if (!lang || lang === 'en') {
        current = 'English';
        productId = 'Product Id: ';
        productType = 'Product type: ';
        update = 'update';
        deleteItem = 'delete';
        addCart = 'Add to Cart';
        enterInfo = 'Enter Product info';
        submit = 'Submit';
        close = 'Close';
        name = 'Name'
        price = 'Price'

    } else {
        current = "French"
        productId = 'Id du produit: ';
        productType = 'type de produit: ';
        update = 'mettre à jour';
        deleteItem = 'supprimer';
        addCart = 'Ajouter au panier';
        enterInfo = 'Entrez Info du Produit';
        submit = 'Soumettre';
        close = 'fermer'
        name = 'Nom'
        price = 'prix'
    }

    const renderItems = {
        products: products,
        productId: productId,
        productType: productType,
        update: update,
        deleteItem: deleteItem,
        addCart: addCart,
        enterInfo: enterInfo,
        submit:submit,
        close: close,
        name: name,
        price: price
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

async function showCartPage(req, res){
    let lang = req.cookies.language;
    let current;
    let yourCart;
    let confirm;
    let remove;

    if (!lang || lang === 'en') {
        current = 'English';
        yourCart = 'YOUR CART'
        confirm = 'Confirm Purchase'
        remove = 'Remove Item from Cart'

    } else {
        current = "French"
        yourCart = 'VOTRE PANIER'
        confirm = 'confirmer votre achat'
        remove = 'Enlever produit du panier'
    }

    const renderItems = {
        products: list,
        yourCart: yourCart,
        confirm: confirm,
        remove: remove

    }
    res.render("cart.hbs", renderItems);
}


/**
 * Handles the /cart endpoint. Shows the user's shopping cart.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function showCart(req, res){
    let lang = req.cookies.language;
    let current;
    let yourCart;
    let confirm;
    let remove;
    let alertMessage;

    if (!lang || lang === 'en') {
        current = 'English';
        yourCart = 'YOUR CART'
        confirm = 'Confirm Purchase'
        remove = 'Remove Item from Cart'
        alertMessage = 'You must be logged in to add to cart.'

    } else {
        current = "French"
        yourCart = 'VOTRE PANIER'
        confirm = 'confirmer votre achat'
        remove = 'Enlever produit du panier'
        alertMessage = 'Vous devrez ëtre connecté pour ajouter au panier'
    }

   if(!req.cookies['sessionId'] || req.cookies == null){
        res.status("400");
        res.render("error.hbs", {alertMessage: alertMessage})
    }
    else{

        if(req.body.addProduct){
            list.push({name: req.body.name, type: req.body.type, price: req.body.price});
        }
        res.cookie("shoppingCart", list, {expires: new Date(Date.now() + 300000)});
    
        const renderItems = {
            products: list,
            yourCart: yourCart,
            confirm: confirm,
            remove: remove
    
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
    let lang = req.cookies.language;
    let current;
    let deleteMessage;
    let backTocart;
    let shoppingMessage;

    if (!lang || lang === 'en') {
        current = 'English';
        deleteMessage = 'has been deleted from your cart!'
        backTocart = 'Come Back To Cart'
        shoppingMessage = 'Continue Shopping'
    } else {
        current = "French"
        deleteMessage = 'a été enlevé de votre panier!'
        backTocart = 'Revenez au panier'
        shoppingMessage = 'Continuez à Magasiner'
    }

    
    let name = req.body.name
    let index = list.findIndex(item => { return item.name === name; });
    list.splice(index, 1);

    let renderItems = {
        name: name,
        deleteMessage: deleteMessage,
        backTocart: backTocart,
        shoppingMessage: shoppingMessage
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
        let lang = req.cookies.language;
        let current;
        let orderConfirmed;
        let shoppingMessage;
        let backToHome;

        if (!lang || lang === 'en') {
            current = 'English';
            orderConfirmed = 'YOUR ORDER HAS BEEN CONFIRMED. THANK YOU FOR SHOPPING!'
            shoppingMessage = 'Continue Shopping'
            backToHome = 'Go Back to Home Page'
        } else {
            current = "French"
            orderConfirmed = 'VOTRE COMMANDE A ÉTÉ CONFIRMÉE. MERCI POUR MAGASINER!';
            shoppingMessage = 'Continuez à Magasiner'
            backToHome = "Retournez à la page d'accueil"
        }
    
        let cartList = req.cookies.shoppingCart;
        let userId = req.cookies.id;
        await sql.createOrder(cartList, userId);
        list = [];
        res.cookie("shoppingCart", null, {expires: new Date(Date.now())});

        res.render('submitCart.hbs', {orderConfirmed:orderConfirmed, shoppingMessage:shoppingMessage, backToHome:backToHome})
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
    submitCart,
    router,
    routeRoot
}
