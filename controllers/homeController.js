const express = require('express');
const { route } = require('../app');
const router = express.Router();
const routeRoot = '/';
function showHome(request, response) {
    response.render('home.hbs');
}
router.get('/', (req,res)=>{
    res.render('home.hbs');
});

router.get('/product', generateProduct);

router.get('/login', generateLoginPage);

router.get('/signup', generateSignUpPage);

function generateSignUpPage(req, res){
    const signupPageData = {
        'title': 'Sign Up',
        'ignore': true,
        loginFields:[
            'firstname',
            'lastname',
            'username',
            'password'
        ],
        'buttonName': 'Create account'
    }
    res.render('login.hbs', signupPageData)
}

function generateLoginPage(req, res){
    const loginPageData = {
        'title': 'Login',
        'ignore': 'true',
        loginFields: [{input:"username",id:"usernameLogin"},{input:"password",id:"passwordLogin"}],
        'buttonName': 'login'
    }
    res.render('login.hbs', loginPageData);
}


function generateProduct(req, res){
    const productPageData = {
        products:[

        ],
        formFields:[    
            "name",
            "description"
        ],
        helpers:{
            formNames
        }
    }
    res.render('home.hbs', productPageData);
}

function formNames(name){
    //extract words from field
    words = name.split('_');
    formName = '';
    //for each word, add it to a string with caps on first letter
    words.forEach(word => {
        formName += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
    });
    return formName;
}

function handleInput(req, res){
    for(const [property, value] of Object.entries(req.body)){
        //logs the value
        console.log(value);
    }
}

module.exports = {
    showHome,
    router,
    routeRoot
}
