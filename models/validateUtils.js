const validator = require('validator');
/** Check validity of name and type. 
 * 
 * @param {string} username Name must be a non-empty, alphabetical string (no spaces or numbers)
 * @returns true if it is valid, false otherwise
 */
function isValid(username) {
   return (typeof username === 'string' && username && validator.isAlphanumeric(username,'en-US'));
}

module.exports = {isValid}
