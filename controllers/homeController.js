const express = require('express');
const router = express.Router();
const routeRoot = '/';

function showHome(req, res){
    res.render("allProducts.hbs")
}

router.get('/', showHome);

module.exports = {
    showHome,
    showForm,
    router,
    routeRoot
}