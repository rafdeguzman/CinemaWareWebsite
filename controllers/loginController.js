const express = require('express');
const router = express.Router();
const routeRoot = '/';

/**
 * Handles the /login endpoint. Generates the login page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
function generateLoginPage(req, res){
    let lang = req.cookies.language;
    let current;
    let username;
    let password;
    let forgotPass;
    let title;

    if (!lang || lang === 'en') {
        current = 'English';
        title = 'login'; 
        username = 'username'
        password = "password"
        forgotPass = 'Forgot your password?'
    } else {
        current = "French"
        title = 'connexion'; 
        username = "nom d'utilisateur"
        password = "mot de passe"
        forgotPass = 'mot de passe oublié?'
    }
    const loginPageData = {
        'title': title,
        'ignore': 'true',
        loginFields: [{input:username,id:"usernameLogin",type:"text", name: "username"},{input:password,id:"passwordLogin",type:"password", name: "password"}],
        'buttonName': title,
        'forgotPass': forgotPass
    }
    res.render('login.hbs', loginPageData);
}
router.get('/login', generateLoginPage);

module.exports = {
    generateLoginPage,
    router,
    routeRoot
}