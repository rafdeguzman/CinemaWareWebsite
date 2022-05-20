const express = require('express');
const router = express.Router();
const routeRoot = '/';

/**
 * Handles the / endpoint. Show the user the home page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function showContactUs(req, res){
    res.render("contact.hbs")
}

router.get('/contact', showContactUs);

module.exports = {
    showContactUs,
    router,
    routeRoot
}