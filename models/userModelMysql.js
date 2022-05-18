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
      "CREATE TABLE IF NOT EXISTS users(id int AUTO_INCREMENT, username VARCHAR(50), password VARCHAR(50), PRIMARY KEY(id))";
    await connection.execute(sqlQuery);
    logger.info("Table users created/exists");
    
    sqlQuery =
    "INSERT INTO users (username, password) VALUES ('admin','admin')"
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
 * @returns {Object} User that was added successfully {username: string, password: string}
 * @throws InvalidInputError, DBConnectionError
 */
async function addUser(username, password) {
    username = username.trim();
  if (!validate.isValid(username)) {
    throw new InvalidInputError();
  }
  if(isUserFound(username)){
      return false;
  }
  const sqlQuery =
    'INSERT INTO users (username, password) VALUES ("' +
    username +
    '","' +
    password +
    '")';
  try {
    await connection.execute(sqlQuery);
    logger.info("User added");
    return { username: username, password: password };
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
  const sqlQuery = "select username from users";
  try {
    const [row, field] = await connection.execute(sqlQuery);
    logger.info("Got all user");
    return row;
  } catch (error) {
    logger.error(error);
    throw new DBConnectionError();
  }
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
  if (!validate.isValid(username)) {
    throw new InvalidInputError();
  }
  const sqlQuery =
    'select username,id from users where username = "' +
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
  if (!validate.isValid(originalUsername)) {
    throw new InvalidInputError();
  }
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
  if (!validate.isValid(originalUsername)) {
    throw new InvalidInputError();
  }

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
 * Get the specific a user to the db if valid and returns that
 *  user as an object
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
  addUser,
  getConnection,
  getAllUsers,
  getUser,
  UpdateUserPassword,
  DeleteUser,
  InvalidInputError,
  DBConnectionError,
};
