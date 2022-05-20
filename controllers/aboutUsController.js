const express = require('express');
const router = express.Router();
const routeRoot = '/';

/**
 * Handles the / endpoint. Show the user the home page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function showAboutUs(req, res){
    res.render("about.hbs")
}

router.get('/about', showAboutUs);

module.exports = {
    showAboutUs,
    router,
    routeRoot
}