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
    let currentPromotions;
    let title1;
    let message1;
    let link1;
    let title2;
    let message2;
    let link2;
    let title3;
    let message3;
    let link3;

    if (!lang || lang === 'en') {
        current = 'English';
        description = 'shop our newest cameras and more'; // default to English if not already set.
        recentItems = 'recently viewed items'
        shop = "shop now"
        currentPromotions = "Current Promotions"
        title1 = "Capture your Memories"
        message1 = "'Photos allow us to record life's greatest moments, so they can stay in our memories forever.' - Keo Tsang"
        link1 = "Visit Keo's Channel"
        title2 = "Premium Camera Hardware"
        message2 = "Get the latest cameras, lenses and more from us."
        link2 = "Shop Now"
        title3 = "The Meaning of Photography"
        message3 = "'Photography means something to me. What does it mean to you?' - Peter McKinnon"
        link3 = "Read more"
    } else {
        current = "French"
        description = 'magasinez nos caméras les plus récentes et encore';
        recentItems = 'articles récemment vus'
        shop = "magasinez maintenant"
        currentPromotions = "Promotions En Cours"
        title1 = "Capturez Vos Souvenirs"
        message1 = "'Les photos nous permettent d'enregistrer les plus grands moments de la vie, afin qu'ils puissent rester dans nos mémoires pour toujours.' - Kéo Tsang"
        link1 = "Visitez La Chaîne De Keo"
        title2 = "Prime Matériel De Caméra"
        message2 = "Obtenez les derniers appareils photo, objectifs et plus encore de notre part."
        link2 = "Magasinez Maintenant"
        title3 = "Le Sens De La Photographie"
        message3 = "« La photographie signifie quelque chose pour moi. Qu'est-ce que cela signifie pour vous ? » -Peter McKinnon"
        link3 = "en savoir plus"
    }

    const renderItems = {
        recentlyViewed: req.cookies['recentlyViewed'],
        description:description, recentItems:recentItems, shop: shop, currentPromotions:currentPromotions, title1:title1, title2:title2, title3:title3, message1:message1, message2:message2, message3:message3, link1:link1, link2:link2, link3:link3
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