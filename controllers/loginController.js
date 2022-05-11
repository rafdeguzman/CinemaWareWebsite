const express = require('express');
const router = express.Router();
const routeRoot = '/';

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
    router,
    routeRoot
}