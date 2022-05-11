const express = require("express");
const model = require("../models/userModelMysql");
const router = express.Router();
const routeRoot = "/";

<<<<<<< HEAD
=======
router.post("/signupPage", createUser);
>>>>>>> 582fdc44da6035abd9beadbf0673bf3c2cac469e
/**
 *  Handles post /user endpoint.
 *  Calls the model to add a user to the database using the given usernamem, password, firstName and lastName.
 *
 * @param {*} request: Express request expecting JSON body with values request.body.username, request.body.password, request.body.firstName and request.body.lastName
 * @param {*} response: Sends a successful response, 400-level response if inputs are invalid or
 *                        a 500-level response if there is a system error
 */
async function createUser(request, response) {
  try {
    const added = await model.addUser(request.body.username, request.body.password, request.body.firstname, request.body.lastname);
    if (added) {
        response.render("home.hbs");
        // 200 success
    } else {
        response.render("error.hbs", {alertMessage: "Failed!! User Already Exist"});
    }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
        //response.status("500");
      response.render("error.hbs", {alertMessage: "Failed to add User for DataBase Connection Error",image:"https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg",formFields:[ "name","type"]});
    } else if (error instanceof model.InvalidInputError) {
      //response.status("400");
      response.render("error.hbs", {alertMessage: "Failed to add User for invaild Input",image:"https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg",formFields:[ "name","type"]});
    } else {
      //response.status("500");
      response.render("error.hbs", {alertMessage: "Failed to add User for  DataBase Connection Error",image:"https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"});
    }
  }
}
router.post("/signup", createUser);

/**
 *  Handles get /userd endpoint.
 *  Calls the model to get all a user from the database.
 * @param {*} request No expected JSON body
 * @param {*} response Sends a successful response, 400-level response if inputs are invalid or
 *                        a 500-level response if there is a system error
 */
async function listAllUser(request, response) {
  try {
    const allUsers = 
    await model.getAllUsers();
    if (allUsers.length > 0) {
        response.render("showUser.hbs", {message: "Successfully get all user ", list : allUsers , ListAll: true});
        // 200 success
    } else {
        response.render("error.hbs", {alterMessage: "Failed to get all user" });
    }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
        //response.status("500");
      response.render("error.hbs", {alertMessage: "Failed to get all user for DataBase Connection Error",});
    } else if (error instanceof model.InvalidInputError) {
      //response.status("400");
      response.render("error.hbs", {alertMessage: "Failed to get all user"});
    } else {
      //response.status("500");
      response.render("error.hbs", {alertMessage: "Failed to get all user for DataBase Connection Error"});
    }
  }
}
router.get("/users",listAllUser);


/**
 *  Handles post /login endpoint.
 *  Calls the model to get the specific user from the database using the given id
 *
 * @param {*} request: Express request expecting JSON body with values request.body.id
 * @param {*} response: Sends a successful response, 400-level response if inputs are invalid or
 *                        a 500-level response if there is a system error
 */
async function GetUser(request, response) {
  try {
    const oneUsers = await model.getUser(request.body.id);
    if (oneUsers.length > 0) {
        response.render("showUser.hbs", {message: "Successfully got the user ", list : oneUsers , ListAll: false});
        // 200 success
    } else {
        response.render("home.hbs", {alertMessage: "Failed to may user not exist",});
    }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
        //response.status("500");
      response.render("error.hbs", {alertMessage: "Failed to get user for DataBase Connection Error",});
    } else if (error instanceof model.InvalidInputError) {
      //response.status("400");
      response.render("error.hbs", {alertMessage: "Failed to may user not exist",});
    } else {
      //response.status("500");
      response.render("error.hbs", {alertMessage: "Failed to get user for DataBase Connection Error"});
    }
  }
}
router.get("/user",GetUser);
    
/**
 *  Handles post /newpassword endpoint.
 *  Calls the model to update a specific user from the database using the given id to modify username, password, firstName and/or lastName.
 *
 * @param {*} request: Express request expecting JSON body with values request.body.username and request.body.password, request.body.id, request.body.firstNamd and request.body.lastName.
 * @param {*} response: Sends a successful response, 400-level response if inputs are invalid or
 *                        a 500-level response if there is a system error
 */
async function UpdateUser(request, response) {
  try {
    const oneUsers = await model.UpdateUser(request.body.id, request.body.username, request.body.password, request.body.firstName, request.body.lastName);
    if (oneUsers) {
        response.render("showUser.hbs", {message: "Successfully updated user ",ListAll: false});
        // 200 success
    } 
    // else {
    //     response.render("home.hbs", {alertMessage: "Failed to update user , user may not exist",});
    // }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
        //response.status("500");
      response.render("home.hbs", {alertMessage: "Failed to update user for DataBase Connection Error",});
    } else if (error instanceof model.InvalidInputError) {
      //response.status("400");
      response.render("home.hbs", {alertMessage: "Failed to update user , user may not exist",});
    } else {
      //response.status("500");
      response.render("home.hbs", {alertMessage: "Failed to update user for DataBase Connection Error"});
    }
  }
}
router.post("/newuser",UpdateUser);


/**
 *  Handles post /removeuser endpoint.
 *  Calls the model to delete a specific user from the database using the given id
 *
 * @param {*} request: Express request expecting JSON body with values request.body.id
 * @param {*} response: Sends a successful response, 400-level response if inputs are invalid or
 *                        a 500-level response if there is a system error
 */
async function Delete(request, response) {
  try {
    const deleteUser = await model.DeleteUser(request.body.id);
    if (deleteUser) {
        response.render("showUser.hbs", {message:  "Successfully deleted user with id" + request.body.id,ListAll: false});
        // 200 success
    } 
    // else {
    //     response.render("home.hbs", {alertMessage: "Failed to delete user ",});
    // }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
        //response.status("500");
      response.render("home.hbs", {alertMessage: "Failed to delete user for DataBase Connection Error",});
    } else if (error instanceof model.InvalidInputError) {
      //response.status("400");
      response.render("home.hbs", {alertMessage: "Failed to delete user not exist",});
    } else {
      //response.status("500");
      response.render("home.hbs", {alertMessage: "Failed to delete user for DataBase Connection Error"});
    }
  }
}
router.post("/removeuser",Delete);

module.exports = {
  createUser,
  listAllUser,
  GetUser,
  UpdateUser,
  Delete,
  router,
  routeRoot,
};


