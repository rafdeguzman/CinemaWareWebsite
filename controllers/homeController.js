const express = require('express');
const router = express.Router();
const routeRoot = '/';

testDatabase = [
    {}
]

function showHome(req, res){
    const renderItems = {
        list: testDatabase
    }
    res.render("allProducts.hbs", renderItems);
}

router.get('/', showHome);

module.exports = {
    showHome,
    router,
    routeRoot
}