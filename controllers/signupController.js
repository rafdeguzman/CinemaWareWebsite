const express = require('express');
const router = express.Router();
const routeRoot = '/';

/**
 * Handles the /signup endpoint. Shows user the sign up page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
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
    showSignUp,
    router,
    routeRoot
} 