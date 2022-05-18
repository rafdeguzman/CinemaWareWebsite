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
            let dropQuery = "DROP TABLE IF EXISTS productOrder";
            await connection.execute(dropQuery);
            logger.info("Table productOrder dropped");
            dropQuery = "DROP TABLE IF EXISTS orders";
            await connection.execute(dropQuery);
            logger.info("Table orders dropped");
            dropQuery = "DROP TABLE IF EXISTS products";
            await connection.execute(dropQuery);
            logger.info("Table products dropped");
            dropQuery = "DROP TABLE IF EXISTS users";
            await connection.execute(dropQuery);
            logger.info("Table users dropped");
        }
        // Create table if it doesn't exist
        let sqlQuery = 'CREATE TABLE IF NOT EXISTS products(id int AUTO_INCREMENT, name VARCHAR(50), type VARCHAR(50), price FLOAT, image VARCHAR(255), PRIMARY KEY(id))';

        await connection.execute(sqlQuery);
        logger.info("Table products created/exists");

        sqlQuery =
        "CREATE TABLE IF NOT EXISTS users(id int AUTO_INCREMENT, username VARCHAR(50), password VARCHAR(50), firstName VARCHAR(50), lastName VARCHAR(50), PRIMARY KEY(id))";
        await connection.execute(sqlQuery);
        logger.info("Table users created/exists");
        
        // create order table query
        sqlQuery = 'CREATE TABLE IF NOT EXISTS orders(id int AUTO_INCREMENT, orderDate date, PRIMARY KEY(id))'
        await connection.execute(sqlQuery);
        logger.info("Table orders created/exists");
        
        // create productOrder table
        sqlQuery = 'CREATE TABLE IF NOT EXISTS productOrder(productId int, orderId int, quantity int, PRIMARY KEY(productId, orderId), FOREIGN KEY(productId) REFERENCES products(id), FOREIGN KEY(orderId) REFERENCES orders(id))'
        await connection.execute(sqlQuery);
        logger.info("Table productOrder created/exists");

        // create orderHistory table 
        sqlQuery = 'CREATE TABLE IF NOT EXISTS orderHistory(userId int, orderId int, PRIMARY KEY(userId, orderId), FOREIGN KEY(userId) REFERENCES users(id), FOREIGN KEY(orderId) REFERENCES orders(id))'
        await connection.execute(sqlQuery);
        logger.info("Table orderHistory created/exists");

        if(!isUserFound('admin')){
            sqlQuery =
            "INSERT IGNORE INTO users (username, password, firstName, lastName) VALUES ('admin','admin','admin','admin')"
            await connection.execute(sqlQuery);
            logger.info("Admin User Created");
        } else{
            logger.info('Admin already exists');
        }
        
        if(reset){
            createProductData();
            logger.info('Product data created')

            sqlQuery =
            "INSERT IGNORE INTO users (username, password, firstName, lastName) VALUES ('admin','admin','admin','admin')"
            await connection.execute(sqlQuery);
            logger.info("Admin User Created");
        }
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
async function addProduct(name, type, price, image) {
    if (!validateProduct(name, type, price)) {
        throw new InvalidInputError();
    }
    const sqlQuery = 'INSERT INTO products (name, type, price, image) VALUES (\"'
        + name + '\",\"' + type + '\", \"' + price + '\", \"' + image + '\")';
    try {
        await connection.execute(sqlQuery);
        logger.info("Product added");        
        return { "name": name, "type": type, "price": price, "image": image};  //works and returns object
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
async function updateProduct(id, name, type, price, image) {
    if (!validateProduct(name, type, price)) {
        throw new InvalidInputError();
    }
    const sqlQuery = 'UPDATE products SET name = \"'
        + name + '\", type = \"' + type + '\", price = \"' + price + '\", image = \"' + image + '\" WHERE id = \"' + id + '\"';
    try {
        await connection.execute(sqlQuery);
        logger.info("Product with id " + id + " updated");        
        return { "id": id, "name": name, "type": type, "price": price, "image": image };  //works and returns object
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
        return true;
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
        return { "name": object.name, "type": object.type, "price": object.price, "image": object.image };  //works and returns object
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
    const sqlQuery = 'SELECT id, name, type, price, image FROM products'
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

function validateProduct(name, type, price){
    if(types.includes(type) && price > 0)
        return true;
    else
        return false;
}

async function createOrder(list, userId) {
  try {
      await connection.execute("INSERT INTO orders (orderDate) VALUES(GETDATE());");
      logger.info("Order was created.");
      let orderId = connection.execute("SELECT MAX(id) FROM orders;");
      let productId;

      for (let i = 0; i < list.length; i++) {
          productId = await connection.execute("SELECT id FROM products WHERE name = '" + list[i].name + "';");
          existingProduct = await connection.execute("SELECT * FROM productOrder WHERE productId = " + productId + " AND orderId = " + orderId + ";");
          if (!existingProduct) {
              await connection.execute("UPDATE productOrder SET quantity = quantity + 1 WHERE productId = " + productId + " AND orderId = " + orderId + ";");
          }
          else {
              await connection.execute("INSERT INTO productOrder (productId, orderId, quantity) VALUES(" + productId + ", " + orderId + ", 1);");
          }
      }
      logger.info("Items added to the ProductOrder table.");
      
      await connection.execute('INSERT INTO orderHistory (UserId, OrderId) VALUES(' + userId + ', ' + orderId + ');')

  } catch (error) {
      logger.error(error);
      throw new DBConnectionError();
  }
}


/**
 * Fills the database with data from the products array
 */
function createProductData(){
    for(let i = 0; i < products.length; i++){
        addProduct(products[i].name, products[i].type, products[i].price, products[i].image);
    }
}

// products array for testing data
let products = [
    { name: 'Canon EOS Rebel T7', type: 'dslr', price: 500, image: 'https://www.bhphotovideo.com/images/images1500x1500/canon_2727c002_eos_rebel_t7_dslr_1461734.jpg' },
    { name: 'Canon EOS Rebel T6', type: 'dslr', price: 500, image: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5086/5086534cv11d.jpg' },
    { name: 'Canon EOS Rebel T5', type: 'dslr', price: 500, image: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/4470/4470028_sd.jpg' },
    { name: 'Logitech C920', type: 'webcam', price: 500, image: 'https://resource.logitech.com/w_800,c_lpad,ar_16:9,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/webcams/c920/gallery/c920-glamour-lg.png?v=1'},
    { name: 'KODAK Mini Shot 2', type: 'dslr', price: 500, image: 'http://cdn.shopify.com/s/files/1/0484/6180/7774/products/3_c171baf2-9ca8-411f-a910-7877d0e61a24_1200x1200.jpg?v=1651471479' },
    { name: 'RED CAMERA', type: 'video', price: 2500, image: 'https://www.bhphotovideo.com/images/images2500x2500/red_digital_cinema_710_0329_red_ranger_with_helium_1505274.jpg' },
    { name: 'Canon G16', type: 'camera', price: 500, image: 'https://m.media-amazon.com/images/I/71prwdWC4zL._AC_SY355_.jpg'},
];


/**
 * Adds the given user to the db if valid and returns that
 *  user as an object
 *
 * @param {string} username username of user.  Must be alphabetical only with no spaces.(see validateUtils.isValid)
 * @param {string} password password of user.  Can be any combination of string
 * @param {string} firstName firstName of user.  Must be contained of letters only.
 * @param {string} lastName  lastName of user.  Must be contained of letters only.
 * @returns {Object} User that was added successfully
 * @throws InvalidInputError, DBConnectionError
 */
 async function addUser(username, password, firstName, lastName) {
  username = username.trim();
// if (!validate.isValidUserName(username)) {
//   throw new InvalidInputError();
// }
// if (!validate.isValidNames(firstName, lastName)) {
//   throw new InvalidInputError();
// }
if( await isUserFound(username)){
    return false;
}
let sqlQuery = "INSERT INTO users (username, password, firstName, lastName) VALUES ('"+username+"', '"+password+"', '"+firstName+"', '"+lastName+"')";
try {
  await connection.execute(sqlQuery);
  logger.info("User added");
  return { username: username, password: password, firstName: firstName, lastName: lastName };
} catch (error) {
  logger.error(error);
  throw new DBConnectionError();
}
}

/**
 * Get all the users from the db and returns that
 *  array of object that are user even if the array is empty
 * @returns {Object} array of object that are user
 * @throws InvalidInputError, DBConnectionError
 */
 async function getAllUsers() {
  let sqlQuery = "select username from users";
  var result = "";

  try {
      result = await connection.execute(sqlQuery);
      logger.info("Users read");
  } catch (error) {
      logger.error(error);
      throw new DBConnectionError();
  }

  if (result[0].length == 0) {
      logger.error("No data in database")
      throw new InvalidInputError();
  }

  return result[0];
}

/**
 * Get the specific a user to the db if valid and returns that
 *  user as an object
 *
 * @param {*} username username of user.  Must Match the username in db
 * @param {*} password password of user.  Must Match the password in db
 * @returns {Object} array of object that are user with single user inside array
 */
 async function getUser(username, password) {
    username = username.trim();
  // if (!validate.isValid(username)) {
  //   throw new InvalidInputError();
  // }
  const sqlQuery =
    'select username from users where username = "' +
    username +
    '" and password = "' +
    password +
    '"';
  try {
    const [row, field] = await connection.execute(sqlQuery);
    logger.info("Got the user");
    return row;
  } catch (error) {
    logger.error(error);
    throw new DBConnectionError();
  }
}

/**
 * Update the specific  user password to the db if valid user and returns that
 *  true
 *
 * @param {*} originalUsername username of user.  Must Match the username in db
 * @param {*} updatePassword update user password
 * @returns {Object} boolean true if successful updated , otherwise false.
 */
async function UpdateUserPassword(originalUsername, updatePassword) {
    originalUsername = originalUsername.trim();
  // if (!validate.isValid(originalUsername)) {
  //   throw new InvalidInputError();
  // }
  let sqlQuery =
    'select password from users where username = "' + originalUsername + '"';
  try {
    const [row, field] = await connection.execute(sqlQuery);
    logger.info("User update");
    if (row.length > 0) {
      sqlQuery =
        'update users set password = "' +
        updatePassword +
        '" where username = "' +
        originalUsername +
        '"';
      await connection.execute(sqlQuery);
      return true;
    } else {
      throw new InvalidInputError();
    }
  } catch (error) {
    logger.error(error);
    if (error instanceof InvalidInputError) {
      throw new InvalidInputError();
    }
    throw new DBConnectionError();
  }
}

/**
 * delete the specific  user by there username to the db if valid user and returns that
 *  true
 *
 * @param {*} username username of user.  Must Match the username in db
 * @returns {Object} boolean true if successful delete , otherwise false.
 */
 async function DeleteUser(originalUsername) {
    originalUsername = originalUsername.trim();
  // if (!validate.isValid(originalUsername)) {
  //   throw new InvalidInputError();
  // }

  let sqlQuery =
    'select password from users where username = "' + originalUsername + '"';
  try {
    const [row, field] = await connection.execute(sqlQuery);
    logger.info("User delete");
    if (row.length > 0) {
      sqlQuery =
        'delete from users where username = "' + originalUsername + '"';
      await connection.execute(sqlQuery);
      return true;
    } else {
      throw new InvalidInputError();
    }
  } catch (error) {
    logger.error(error);
    if (error instanceof InvalidInputError) {
      throw new InvalidInputError();
    }
    throw new DBConnectionError();
  }
}

/**
 * Get the specific a user to the db if valid returns true if found, false otherwise
 *
 * @param {*} username username of user.  Must Match the username in db
 * @returns {Booolen} if it found  return true 
 */
async function isUserFound(usernameInput) {
    const sqlQuery = "SELECT username as count FROM users WHERE username = '" + usernameInput +"'";
    const [row, field] = await connection.execute(sqlQuery);
    logger.info("User found");
    if (row.length > 0) {
      return true;
    } else {
      return false;
    }
}
  
module.exports = {
    initialize,
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    findProduct,
    getConnection,
    createProductData,
    addUser,
    getAllUsers,
    getUser,
    UpdateUserPassword,
    DeleteUser,
    createOrder,
    InvalidInputError,
    DBConnectionError
}
