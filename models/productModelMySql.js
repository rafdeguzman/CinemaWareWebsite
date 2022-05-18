const mysql = require('mysql2/promise');
const validate = require('../validateUtils');
const logger = require('../logger');
const { connect } = require('../app');
var connection;

/**  Error for 400-level issues */
class InvalidInputError extends Error { }

/** Error for 500-level issues */
class DBConnectionError extends Error { }

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
        const sqlQuery = 'CREATE TABLE IF NOT EXISTS products(id int AUTO_INCREMENT, name VARCHAR(50), category VARCHAR(50), price INTEGER, PRIMARY KEY(id))';

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
 * @param {string} category Category of Product.  Must one one of allowed categories (see validateUtils.validTypes)
 * @param {string} price Product price. Must be a positive integer.
 * @returns {Object} Product that was added successfully {name: string, type: string}
 * @throws InvalidInputError, DBConnectionError
 */
async function addProduct(name, category, price) {
    if (!validate.isValid(name, category, price)) {
        throw new InvalidInputError();
    }
    const sqlQuery = 'INSERT INTO products (name, category, price) VALUES (\"'
        + name + '\",\"' + category + '\", \"' + price + '\")';
    try {
        await connection.execute(sqlQuery);
        logger.info("Product added");
        return { "name": name, "category": category, "price": price };  //works and returns object
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
 * @param {string} category Category of Product.  Must one one of allowed categories (see validateUtils.validTypes)
 * @param {string} price Product price. Must be a positive integer.
 * @returns {Object} Product that was added successfully {name: string, type: string}
 * @throws InvalidInputError, DBConnectionError
 */
async function updateProduct(id, name, category, price) {
    if (!validate.isValid(name, category, price)) {
        throw new InvalidInputError();
    }
    if (!getCount(id) > 0) {
        throw new InvalidInputError();
    }
    const sqlQuery = 'UPDATE products SET name = \"'
        + name + '\", category = \"' + category + '\", price = \"' + price + '\" WHERE id = \"' + id + '\"';
    try {
        await connection.execute(sqlQuery);
        logger.info("Product with id " + id + " updated");
        return { "name": name, "category": category, "price": price };  //works and returns object
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
                return { "name": object.name, "category": object.category, "price": object.price };  //works and returns object
            })
            .catch((error) => {
                throw new InvalidInputError();
            })
    } catch (error) {
        logger.error(error);
        throw new DBConnectionError();
    }
}

async function getCount() {
    const sqlQuery = "SELECT COUNT(*) FROM products";
    try {
        var count = await connection.execute(sqlQuery);
        logger.info("Getting count of all items");
        return count;
    } catch (error) {
        logger.error(error);
        throw new DBConnectionError();
    }
}
/**
 * Just for checking if specified id exists.
 * @param {*} id 
 * @returns Integer of number of times id was found in the database.
 */
async function getCountOfId(id) {
    const sqlQuery = "SELECT COUNT(*) FROM products WHERE id = " + id;
    try {
        var count = await connection.execute(sqlQuery);
        logger.info("Getting count of all items");
        return count;
    } catch (error) {
        logger.error(error);
        throw new DBConnectionError();
    }
}

async function createOrder(list) {
    try {
        await connection.execute("INSERT INTO order (OrderDate) VALUES(GETDATE());");
        logger.info("Order was created.");
        let orderId = connection.execute("SELECT MAX(OrderId) FROM order;");
        let productId;

        for (let i = 0; i < list.length; i++) {
            productId = await connection.execute("SELECT ProductId FROM products WHERE Name = '" + list[i].name + "';");
            existingProduct = await connection.execute("SELECT * FROM productOrder WHERE ProductId = " + productId + " AND OrderId = " + orderId + ";");
            if (!existingProduct) {
                await connection.execute("UPDATE productOrder SET Quantity = Quantity + 1 WHERE ProductId = " + productId + " AND OrderId = " + orderId + ";");
            }
            else {
                await connection.execute("INSERT INTO productOrder (ProductId, OrderId, Quantity) VALUES(" + productId + ", " + orderId + ", 1);");
            }
        }
        logger.info("Items added to the ProductOrder table.");


    } catch (error) {
        logger.error(error);
        throw new DBConnectionError();
    }
}

module.exports = {
    createOrder,
    initialize,
    addProduct,
    updateProduct,
    deleteProduct,
    findProduct,
    getCount,
    getCountOfId,
    getConnection,
    InvalidInputError,
    DBConnectionError
}