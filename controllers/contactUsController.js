const express = require('express');
const router = express.Router();
const routeRoot = '/';

/**
 * Handles the / endpoint. Show the user the home page.
 * @param {*} req The request object.
 * @param {*} res The response object.
 */
async function showContactUs(req, res){
    let lang = req.cookies.language;
    let name;
    let emailAddress;
    let copyMsg;
    let send;
    let technicalSupport;
    let salesQuestions;
    let press;
    let bugReport;

    if (!lang || lang === 'en') {
        name = "Name"
        emailAddress = "Email Address"
        copyMsg = "Send me a copy of this message"
        send = "Send"
        technicalSupport = "Technical Support"
        salesQuestions = "Sales Questions"
        press = "Press"
        bugReport = "Bug Report"

    } 
    else {
        name = "Nom"
        emailAddress = "Addresse e-mail"
        copyMsg = "Envoye-moi une copie de ce message"
        send = "Envoyer"
        technicalSupport = "Assistance technique"
        salesQuestions = "Questions de vente"
        press = "Presse"
        bugReport = "rapport de bug"

    }

    res.render("contact.hbs", {name:name, emailAddress:emailAddress, copyMsg:copyMsg, send:send, technicalSupport:technicalSupport, salesQuestions:salesQuestions, press:press, bugReport:bugReport})
}

router.get('/contact', showContactUs);

module.exports = {
    showContactUs,
    router,
    routeRoot
}