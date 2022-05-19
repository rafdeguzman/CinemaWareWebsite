const express = require('express');
const { header } = require('express/lib/request');
const router = express.Router();
const routeRoot = '/';

/**
 * Handles the / endpoint. Show the user the home page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function showHome(req, res) {
    //const renderItems = {};
    let lang = req.cookies.language;
    let current;
    let description;
    let featItems;
    let shop;

    if (!lang || lang === 'en') {
        current = 'English';
        description = 'shop our newest cameras and more'; // default to English if not already set.
        featItems = 'featured items'
        shop = "shop now"
    } else {
        current = "French"
        description = 'magasinez nos caméras les plus récentes et encore';
        featItems = 'article en vedette'
        shop = "magasinez maintenant"

    }

    renderItems = {description:description, featItems:featItems, shop: shop}

    res.render("home.hbs", renderItems)
}

router.get('/', showHome);

router.post('/language', (request, response) => {
    const lang = request.body.language;
    if (lang) {
        response.cookie('language', lang);
    }
    response.redirect("/");
});


module.exports = {
    showHome,
    router,
    routeRoot
}