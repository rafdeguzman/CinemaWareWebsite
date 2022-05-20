const express = require("express");
const model = require("../models/productModelMySql");
const router = express.Router();
const routeRoot = "/";
const uuid = require("uuid");

const sessions = {};

/**
 * class for the session cookies
 */
class Session {
  constructor(id, username) {
    this.id = id;
    this.username = username;
  } 
}

/**
 * Create the session cookie for the user
 * @param {*} username username of user.
 * @param {*} numMinutes the minimum number of minutes for expirded session cookie;
 * @returns The session ID.
 */
function createSession(id, username) {
  // Generate a random UUID as the sessionId
  const sessionId = uuid.v4(); // Set the expiry time as numMinutes (in milliseconds) after the current time
  const thisSession = new Session(id, username); // Add the session information to the sessions map, using sessionId as the key
  sessions[sessionId] = thisSession;
  return sessionId;
}

/**
 *  Handles post /user endpoint.
 *  Calls the model to add a user to the database using the given username and password.
 *
 * @param {*} request: Express request expecting JSON body with values request.body.name and request.body.type
 * @param {*} response: Sends a successful response, 400-level response if inputs are invalid or
 *                        a 500-level response if there is a system error
 */
async function createUser(request, response) {
  try {
    const added = await model.addUser(
      request.body.username,
      request.body.password,
      request.body.firstname,
      request.body.lastname
    );
    if (added) {
      response.render("home.hbs", {
        alertSuccess:true ,alertMessage:"Successfully created " +request.body.username +""
      });
      // 200 success
    } else {
      response.status("400");
      response.render("error.hbs", {
        alertMessage: "Failed!! User Already Exist",
      });
    }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: "Failed to add User for DataBase Connection Error",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg",
        formFields: ["name", "type"],
      });
    } else if (error instanceof model.InvalidInputError) {
      response.status("400");
      response.render("error.hbs", {
        alertMessage: error.message,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg",
        formFields: ["name", "type"],
      });
    } else {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: "Failed to add User for  DataBase Connection Error",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg",
      });
    }
  }
}
router.post("/signup", createUser);

/**
 *  Handles get /users endpoint.
 *  Calls the model to get all a user from the database.
 * @param {*} request
 * @param {*} response Sends a successful response, 400-level response if inputs are invalid or
 *                        a 500-level response if there is a system error
 */
async function listAllUser(request, response) {
  try {
    const allUsers = await model.getAllUsers();
    if (allUsers.length > 0) {
      response.render("showUser.hbs", {
        message: "Successfully get all user ",
        list: allUsers,
        ListAll: true,
      });
      // 200 success
    } else {
      response.status("400");
      response.render("home.hbs", { alterMessage: "Failed to get all user" });
    }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
      response.status("500");
      response.render("home.hbs", {
        alertMessage: "Failed to get all user for DataBase Connection Error",
      });
    } else if (error instanceof model.InvalidInputError) {
      response.status("400");
      response.render("home.hbs", { alertMessage: "Failed to get all user" });
    } else {
      response.status("500");
      response.render("home.hbs", {
        alertMessage: "Failed to get all user for DataBase Connection Error",
      });
    }
  }
}
router.get("/users", listAllUser);

/**
 *  Handles post /login endpoint.
 *  Calls the model to get the specific user from the database using the given username and password.
 *
 * @param {*} request: Express request expecting JSON body with values request.body.username and request.body.password
 * @param {*} response: Sends a successful response, 400-level response if inputs are invalid or
 *                        a 500-level response if there is a system error
 */
async function Login(request, response) {
  try {

    const authenticatedSession = authenticateUser(request);
    if (!authenticatedSession) {
      const oneUsers = await model.getUser(
        request.body.username,
        request.body.password
      );
      if (oneUsers.length > 0) {
        //got this from 6.2 from the teacher
        // Let's assume successful login for now with placeholder username
        const username = oneUsers[0].username;
        const userId = oneUsers[0].id; // Create a session object that will expire in 2 minutes
        const sessionId = createSession(userId, username); // Save cookie that will expire.
        response.cookie("sessionId", sessionId);
        response.cookie("id", userId);
        response.render("home.hbs", {
          alertSuccess:true ,alertMessage: "Successfully logged in"
        });
        // 200 success
      } else {
        response.status("400");
        response.render("error.hbs", {
          alertMessage: "Failed user may not exist",
        });
    };
    }
    else{  
      response.render("home.hbs", {
      alertAlreadyLogged:true ,alertMessage: "Already logged in"
    })}

  } catch (error) {
    if (error instanceof model.DBConnectionError) {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: "Failed to get user for DataBase Connection Error",
      });
    } else if (error instanceof model.InvalidInputError) {
      response.status("400");
      response.render("error.hbs", {
        alertMessage: "Failed user may not exist",
      });
    } else {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: "Failed to get user for DataBase Connection Error",
      });
    }
  }
}
router.post("/login", Login);

/**
 *  Handles post /newpassword endpoint.
 *  Calls the model to update a specific user from the database using the given username and newpassword.
 *
 * @param {*} request: Express request expecting JSON body with values request.body.username and request.body.newpassword
 * @param {*} response: Sends a successful response, 400-level response if inputs are invalid or
 *                        a 500-level response if there is a system error
 */
async function UpdatePassword(request, response) {
  try {
    const oneUsers = await model.UpdateUserPassword(
      request.body.username,
      request.body.newpassword
    );
    if (oneUsers) {
      response.render("showUser.hbs", {
        message: "Successfully update the user ",
        ListAll: false,
      });
      // 200 success
    }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: "Failed to update user for DataBase Connection Error",
      });
    } else if (error instanceof model.InvalidInputError) {
      response.status("400");
      response.render("error.hbs", {
        alertMessage: "Failed to update user , user may not exist",
      });
    } else {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: "Failed to update user for DataBase Connection Error",
      });
    }
  }
}
router.post("/newpassword", UpdatePassword);

/**
 *  Handles post /removeuser endpoint.
 *  Calls the model to delete a specific user from the database using the given username
 *
 * @param {*} request: Express request expecting JSON body with values request.body.username
 * @param {*} response: Sends a successful response, 400-level response if inputs are invalid or
 *                        a 500-level response if there is a system error
 */
async function Delete(request, response) {
  try {
    const deleteUser = await model.DeleteUser(request.body.username);
    if (deleteUser) {
      response.render("showUser.hbs", {
        message: "Successfully " + request.body.username + " is deleted",
        ListAll: false,
      });
      // 200 success
    }
    // else {
    //     response.render("home.hbs", {alertMessage: "Failed to delete user ",});
    // }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
      response.status("500");
      response.render("home.hbs", {
        alertMessage: "Failed to delete user for DataBase Connection Error",
      });
    } else if (error instanceof model.InvalidInputError) {
      response.status("400");
      response.render("error.hbs", {
        alertMessage: "Failed to delete user not exist",
      });
    } else {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: "Failed to delete user for DataBase Connection Error",
      });
    }
  }
}
router.post("/removeuser", Delete);


/**
 * this check if the use authenicate the User 
 * @param {*} request request for the cookie session
 * @returns object contain sessionId and userSession
 */
function authenticateUser(request) {
  // If this request doesn't have any cookies, that means it isn't authenticated. Return null.
  if (!request.cookies) {
    return null;
  } // We can obtain the session token from the requests cookies, which come with every request
  const sessionId = request.cookies["sessionId"];
  if (!sessionId) {
    // If the cookie is not set, return null
    return null;
  } // We then get the session of the user from our session map
  userSession = sessions[sessionId];
  if (!userSession) {
    return null;
  } // If the session has expired, delete the session from our map and return null
  return { sessionId, userSession }; // Successfully validated.
}

/**
 * logout the user
 * @param {*} request request authenticate of the User
 * @param {*} response response return to the home page 
 * @returns 
 */
async function Logout(request, response){
  const authenticatedSession = authenticateUser(request);
  if (!authenticatedSession) {
        response.redirect('/');
      return;
  }
  delete sessions[authenticatedSession.sessionId]
  console.log("Logged out user " + authenticatedSession.userSession.username);
  
  response.cookie("sessionId", "", { expires: new Date() }); // "erase" cookie by forcing it to expire.
  response.cookie("id", "", { expires: new Date() }); // "erase" cookie by forcing it to expire.
  response.cookie("shoppingCart", "", { expires: new Date() }); // "erase" cookie by forcing it to expire.
  response.render("home.hbs", {
    alertSuccess:true ,alertMessage: "Successfully log out"
  });
};
router.get("/logout", Logout);




module.exports = {
  createUser,
  listAllUser,
  Login,
  UpdatePassword,
  Delete,
  router,
  routeRoot,
};
