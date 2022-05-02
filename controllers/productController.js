const express = require('express');
const sql = require('../models/productsModel');
const router = express.Router();
const routeRoot = '/';

router.get('/cart', async (req, res) => {
    const list = req.cookies.shoppingCart;
    const renderItems = {
        list: list,

    }
    res.render("car.hbs", renderItems);
})