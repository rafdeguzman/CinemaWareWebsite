const validator = require('validator');
const validCategories = [
    "dslr", "video"
]
/** Check validity of name and type. 
 * 
 * @param {string} name Name must be a non-empty, alphabetical string (no spaces or numbers)
 * @param {string} type Type must be one of validTypes: "normal", "grass", "water", "electric", "fire", "psychic"

 * @returns true if both are valid, false otherwise
 */
function isValid(name, category, price) {
   return (validCategories.includes(category.toLowerCase()) && price >= 0);
}

module.exports = {isValid}
