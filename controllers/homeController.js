const express = require('express');
const router = express.Router();
const { header } = require('express/lib/request');
const routeRoot = '/';

/**
 * Handles the / endpoint. Show the user the home page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function showHome(req, res){
    let lang = req.cookies.language;
    let current;
    let description;
    let recentItems;
    let shop;

    if (!lang || lang === 'en') {
        current = 'English';
        description = 'shop our newest cameras and more'; // default to English if not already set.
        recentItems = 'recently viewed items'
        shop = "shop now"
    } else {
        current = "French"
        description = 'magasinez nos caméras les plus récentes et encore';
        featItems = 'articles récemment vus'
        shop = "magasinez maintenant"

    }

    const renderItems = {
        recentlyViewed: req.cookies['recentlyViewed'],
        description:description, recentItems:recentItems, shop: shop
    };
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