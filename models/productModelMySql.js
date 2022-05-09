const mysql = require('mysql2/promise');
const logger = require('../logger');
const { connect } = require('../app');
var connection;

/**  Error for 400-level issues */
class InvalidInputError extends Error {} 

/** Error for 500-level issues */
class DBConnectionError extends Error {} 

/**
 * Initializes the connection to the indicated database dbname.  
 *  Injects database name so we can use this model for both 
 *  testing and main program without overwriting our main database.
 * 
 * If needed, creates a table named 'Product' in the given database.
 *   
 * @param {string} dbname Should differ for main and testing cases.
 * @param {boolean} reset If reset is true, then all existing data in the database is erased and a fresh table created.
 * @throws DBConnectionError is there are any issues.
 */
async function initialize(dbname, reset) {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            port: '10000',
            password: 'pass',
            database: dbname
        });

        if (reset) {
            const dropQuery = "DROP TABLE IF EXISTS products";
            await connection.execute(dropQuery);
            logger.info("Table products dropped");
        }
        // Create table if it doesn't exist
        const sqlQuery = 'CREATE TABLE IF NOT EXISTS products(id int AUTO_INCREMENT, name VARCHAR(50), type VARCHAR(50), price FLOAT, PRIMARY KEY(id))';

        await connection.execute(sqlQuery);
        logger.info("Table products created/exists");
    }
    catch (error) {
        logger.error(error.message);
        throw new DBConnectionError();
    }
}
/** 
 * Provides access to the connection object.  This should only be called by the unit test code.
 *   Note: This is not the best design since an external source can then close our connection,
 *          but permitting this for the special case of unit testing.
 * 
 * @returns connection object
 */

 function getConnection() {
    return connection;
}

/** 
 * Adds the given Product to the db if valid and returns that
 *  Product as an object
 * 
 * @param {string} name Name of Product.  Must be alphabetical only with no spaces.
 * @param {string} type type of Product.  Must one one of allowed categories (see validateUtils.validTypes)
 * @param {string} price Product price. Must be a positive integer.
 * @returns {Object} Product that was added successfully {name: string, type: string}
 * @throws InvalidInputError, DBConnectionError
 */
async function addProduct(name, type, price) {
    if (!validate(name, type, price)) {
        throw new InvalidInputError();
    }
    const sqlQuery = 'INSERT INTO products (name, type, price) VALUES (\"'
        + name + '\",\"' + type + '\", \"' + price + '\")';
    try {
        await connection.execute(sqlQuery);
        logger.info("Product added");        
        return { "name": name, "type": type, "price": price };  //works and returns object
    } catch (error) {
        logger.error(error);
        throw new DBConnectionError();
    }        
}
/** 
 * Changes the product's information using the given id.
 *  Product as an object
 * 
 * @param {string} id Key of product to find.
 * @param {string} name Name of Product.  Must be alphabetical only with no spaces.
 * @param {string} type type of Product.  Must one one of allowed categories (see validateUtils.validTypes)
 * @param {string} price Product price. Must be a positive integer.
 * @returns {Object} Product that was added successfully {name: string, type: string}
 * @throws InvalidInputError, DBConnectionError
 */
async function updateProduct(id, name, type, price) {
    if (!validate(name, type, price)) {
        throw new InvalidInputError();
    }
    if(!getCount(id) > 0){
        throw new InvalidInputError();
    }
    const sqlQuery = 'UPDATE products SET name = \"'
        + name + '\", type = \"' + type + '\", price = \"' + price + '\" WHERE id = \"' + id + '\"';
    try {
        await connection.execute(sqlQuery);
        logger.info("Product with id " + id + " updated");        
        return { "name": name, "type": type, "price": price };  //works and returns object
    } catch (error) {
        logger.error(error);
        throw new DBConnectionError();
    }        
}

/**
 * Deletes a product found using the given id.
 * @param {*} id Key of product to delete.
 */
async function deleteProduct(id) {
    const sqlQuery = 'DELETE FROM products WHERE id = \"' + id + '\"';
    try {
        await connection.execute(sqlQuery);
        logger.info("Product with id " + id + " deleted");        
    } catch (error) {
        logger.error(error);
        throw new DBConnectionError();
    }        
}

/**
 * Finds a product using specified id and returns the specified object.
 * @param {*} id 
 */
async function findProduct(id) {
    const sqlQuery = 'SELECT name FROM products WHERE id = \"' + id + '\"';
    try {
        await connection.execute(sqlQuery)
        .then((x) => {
            logger.info("Product with id " + id + " selected");        
        let object = x[0][0];
        return { "name": object.name, "type": object.type, "price": object.price };  //works and returns object
        })
        .catch((error) => {
            throw new InvalidInputError();
        })
    } catch (error) {
        logger.error(error);
        throw new DBConnectionError();
    }        
}

/**
 * 
 * @returns Returns an array of all products with name, type and price as columns
 * 
 */
async function getProducts(){
    const sqlQuery = 'SELECT name, type, price FROM products'
    try{
        const rows = await connection.execute(sqlQuery);
        logger.info('Items retrieved')
        return rows
    } catch(error){
        logger.error(error)
        throw new DBConnectionError();
    }
}

const types = ['dslr', 'video', 'webcam', 'camera'];

function validate(name, type, price){
    if(types.includes(type) && price > 0)
        return true;
    else
        return false;
}

module.exports = {
    initialize,
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    findProduct,
    getConnection,
    InvalidInputError,
    DBConnectionError
}