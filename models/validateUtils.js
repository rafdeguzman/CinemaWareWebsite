const validator = require('validator');
/** Check validity of name and type. 
 * 
 * @param {string} username Name must be a non-empty, alphabetical string (no spaces or numbers)
 * @returns true if it is valid, false otherwise
 */
function validateUsername(username) {
   return (typeof username === 'string' && username && validator.isAlphanumeric(username,'en-US'));
}
const types = ['dslr', 'video', 'webcam', 'camera'];

function validateProduct(type, price){
    if(types.includes(type) && price > 0)
        return true;
    else
        return false;
}
module.exports = {
    validateUsername,
    validateProduct,
    }
