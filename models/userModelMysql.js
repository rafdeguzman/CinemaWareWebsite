const mysql = require("mysql2/promise");
const validate = require("./validateUtils");
const logger = require("../logger");
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
 * If needed, creates a table named 'pokemon' in the given database.
 *
 * @param {string} dbname Should differ for main and testing cases.
 * @param {boolean} reset If reset is true, then all existing data in the database is erased and a fresh table created.
 * @throws DBConnectionError is there are any issues.
 */
async function initialize(dbname, reset) {
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: "10025",
      password: "pass",
      database: dbname,
    });

    if (reset) {
      const dropQuery = "DROP TABLE IF EXISTS users";
      await connection.execute(dropQuery);
      logger.info("Table users dropped");
    }
    // Create table if it doesn't exist
    let sqlQuery =
      "CREATE TABLE IF NOT EXISTS users(id int AUTO_INCREMENT, username VARCHAR(50), password VARCHAR(50), firstName VARCHAR(50), lastName VARCHAR(50), PRIMARY KEY(id))";
    await connection.execute(sqlQuery);
    logger.info("Table users created/exists");
    
    sqlQuery =
    "INSERT INTO users (username, password, firstName, lastName) VALUES ('admin','admin','admin','admin')"
    await connection.execute(sqlQuery);
    logger.info("Add Admin");
    
  } catch (error) {
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
<<<<<<< HEAD
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
=======
  if (!validate.isValidUserName(username)) {
    throw new InvalidInputError();
  }
  if (!validate.isValidNames(firstName, lastName)) {
    throw new InvalidInputError();
  }

  const sqlQuery =
    'INSERT INTO users (username, password, firstName, lastName) VALUES ("' +
    username + '","' + password + '","' + firstName + '", "' + lastName + '")';
>>>>>>> 582fdc44da6035abd9beadbf0673bf3c2cac469e
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
  let sqlQuery = "select * from users";
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
 * @param {*} id id of user.  Must Match the id in db
 * @returns {Object} array of object that are user with single user inside array
 */
async function getUser(id) {
  let sqlQuery =
    'select * from users where id = ' + id;
    var result = "";

    try {
        result = await connection.execute(sqlQuery);
        logger.info("User read");
    } catch (error) {
        logger.error(error);
        throw new DBConnectionError();
    }

    //Checks if user with that id exists
    if (result[0].length == 0) {
        logger.error("Id does not exist");
        throw new DBConnectionError();
    }

    return result[0][0];
}

/**
 * Update the specific user to the db if valid user and returns that
 *  true
 * @param {*} id id of user.  Must Match the id in db
 * @param {string} username username of user.  Must be alphabetical only with no spaces.(see validateUtils.isValid)
 * @param {string} password password of user.  Can be any combination of string
 * @param {string} firstName firstName of user.  Must be contained of letters only.
 * @param {string} lastName  lastName of user.  Must be contained of letters only.
 * @returns {Object} boolean true if successful updated , otherwise false.
 */
async function UpdateUser(id, username, password, firstName, lastName) {
  username = username.trim();
  if (!validate.isValidUserName(username)) {
    throw new InvalidInputError();
  }
  if (!validate.isValidNames(firstName, lastName)) {
    throw new InvalidInputError();
  }
  var result = "";

  //SQL query to check if user with that id exists
  let sqlQueryCheck = 'SELECT * FROM users WHERE id = ' + id;
  var result = "";

  try {
      result = await connection.execute(sqlQueryCheck);
      logger.info("User read");
  } catch (error) {
      logger.error(error);
      throw new DBConnectionError();
  }

  //Checks if user with that id exists
  if (result[0].length == 0) {
      logger.error("Id does not exist");
      throw new InvalidInputError();
  }

  let sqlQuery = 'UPDATE users SET firstName = "' + firstName + '", lastName = "' + lastName + '", username = "' +username+'", password = "' +password+'" WHERE id = ' + id;

  try {
      result = await connection.execute(sqlQuery);
      logger.info("User updated");
  }
  catch (error) {
      throw new DBConnectionError();
  }

  return { "name": firstName, "lastName": lastName, "username": username, "password": password, "id": id};
}

/**
 * delete the specific  user by their id to the db if valid user and returns that
 *  true
 *
 * @param {*} id id of user.  Must Match the id in db
 * @returns {Object} boolean true if successful delete , otherwise false.
 */
async function DeleteUser(id) {
    //SQL query to find user with id given
    let sqlQueryCheck = 'SELECT * FROM users WHERE id = ' + id;
    var result = "";

    try {
        result = await connection.execute(sqlQueryCheck);
        logger.info("Check if user exists");
    } catch (error) {
        logger.error(error);
        throw new DBConnectionError();
    }

    //Checks if user with that id exists
    if (result[0].length == 0) {
        logger.error("Id does not exist");
        throw new InvalidInputError();
    }

    //SQL query to delete the user with the given id
    let sqlQuery = 'DELETE FROM users WHERE id = ' + id;

    try {
        await connection.execute(sqlQuery);
        logger.info("User deleted");

    } catch (error) {
        logger.error(error);
        throw new DBConnectionError();
    }

    return id;
}

<<<<<<< HEAD
/**
 * Get the specific a user to the db if valid and returns that
 *  user as an object
 *
 * @param {*} username username of user.  Must Match the username in db
 * @returns {Booolen} if it found  return true 
 */
 async function isUserFound(usernameInput) {
   try {
    let sqlQuery = "SELECT username as count FROM users WHERE username = '" + usernameInput +"'";
    const [row, field] = await connection.execute(sqlQuery);
    logger.info("User found");
    if (row.length > 0) {
      return true;
    } else {
      return false;
    } 
   } catch (error) {
     console.log(error);
   }
}
=======
>>>>>>> 582fdc44da6035abd9beadbf0673bf3c2cac469e

module.exports = {
  initialize,
  addUser,
  getConnection,
  getAllUsers,
  getUser,
  UpdateUser,
  DeleteUser,
  InvalidInputError,
  DBConnectionError,
};
