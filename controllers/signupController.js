const express = require('express');
const router = express.Router();
const routeRoot = '/';

/**
 * Handles the /signup endpoint. Shows user the sign up page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function showSignUp(req, res){
    let lang = req.cookies.language;
    let current;
    let username;
    let password;
    let firstName;
    let lastName
    let title;

    if (!lang || lang === 'en') {
        current = 'English';
        title = 'Sign Up'; 
        username = 'username'
        password = "password"
        firstName = 'first name'
        lastName = 'last name'
    } else {
        current = "French"
        title = 'créer votre compte'; 
        username = "nom d'utilisateur"
        password = "mot de passe"
        firstName = 'prénom'
        lastName = 'nom de famille'
    }

    const signUpPageData = {
        'title': title,
        'ignore': true,
        'firstName': firstName,
        'lastName': lastName,
        'username': username,
        'password': password,
        'buttonName': title
    }
    res.render("signup.hbs", signUpPageData);
}

router.get('/signup', showSignUp);

module.exports = {
    showSignUp,
    router,
    routeRoot
} 