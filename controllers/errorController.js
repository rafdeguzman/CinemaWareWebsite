const express = require('express');
const router = express.Router();
const routeRoot = '/';
function handleError(request, response) {
    response.status(404);
    response.send('Invalid URL entered.  Please try again.');
}
router.all('*', handleError);  // Make sure this route is added to the app last!
module.exports = {
    handleError,
    router,
    routeRoot
}