const express = require('express');
const router = express.Router();
const routeRoot = '/';

/**
 * Handles the / endpoint. Show the user the home page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
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