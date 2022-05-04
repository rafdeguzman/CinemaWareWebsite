const express = require('express');
const { response } = require('../app');
const sql = require('../models/productsModel');
const router = express.Router();
const routeRoot = '/';

async function showCart(req, res){

    let list = req.cookies.shoppingCart;
    if(!list){
        list = [];
    }
    if(req.body.addItem){
        list.push({name: req.body.name, type: req.body.type, price: req.body.price});
    }
    res.cookie("shoppingCart", list, {expires: new Date(Date.now() + 300000)});
    const renderItems = {
        list: list,
    }
    res.render("cart.hbs", renderItems);
}

router.get('/cart', showCart);

module.exports = {
    showCart,
    router, 
    routeRoot
}