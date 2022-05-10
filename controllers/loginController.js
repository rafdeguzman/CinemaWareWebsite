const express = require('express');
const router = express.Router();
const routeRoot = '/';

async function showLogin(req, res){
    const loginPageData = {
        'title': 'Login',
        'ignore': true,
        loginFields: [
            'username',
            'password'
        ],
        'buttonName': 'login'
    }
    res.render("login.hbs", loginPageData);
}

router.get('/login', showLogin);

module.exports = {
    router,
    routeRoot
}