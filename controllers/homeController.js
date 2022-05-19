const express = require('express');
const router = express.Router();
const routeRoot = '/';

/**
 * Handles the / endpoint. Show the user the home page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function showHome(req, res){
    const renderItems = {
        recentlyViewed: [{
            name: 'Canon EOS Rebel T7',
            image: 'https://www.bhphotovideo.com/images/images1500x1500/canon_2727c002_eos_rebel_t7_dslr_1461734.jpg'
        }]
    };
    res.render("home.hbs", renderItems)
}

router.get('/', showHome);

module.exports = {
    showHome,
    router,
    routeRoot
}