const express = require('express');
const router = express.Router();
const routeRoot = '/';

async function showSignUp(req, res){
    const signUpPageData = {
        'title': 'Sign Up',
        'ignore': true,
        loginFields: [
            'firstname',
            'lastname',
            'username',
            'password'
        ],
        'buttonName': 'Create account'
    }
    res.render("signup.hbs", signUpPageData);
}

router.get('/signup', showSignUp);

module.exports = {
    router,
    routeRoot
} 