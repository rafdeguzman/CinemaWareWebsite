const express = require('express');
const router = express.Router();
const routeRoot = '/';

/**
 * Handles the /login endpoint. Generates the login page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
function generateLoginPage(req, res){
    const loginPageData = {
        'title': 'Login',
        'ignore': 'true',
        loginFields: [{input:"username",id:"usernameLogin",type:"text"},{input:"password",id:"passwordLogin",type:"password"}],
        'buttonName': 'login'
    }
    res.render('login.hbs', loginPageData);
}
router.get('/login', generateLoginPage);

module.exports = {
    generateLoginPage,
    router,
    routeRoot
}