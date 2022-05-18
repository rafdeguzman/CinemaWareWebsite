const express = require('express');
const router = express.Router();
const routeRoot = '/';

async function showHome(req, res){
    const renderItems = {};
    res.render("home.hbs", renderItems)
}

router.get('/', showHome);

module.exports = {
    showHome,
    router,
    routeRoot
}