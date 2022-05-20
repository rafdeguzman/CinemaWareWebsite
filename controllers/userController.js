const express = require("express");
const model = require("../models/productModelMySql");
const product = require("./productController");
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
  let lang = request.cookies.language;
  let current;
  let description;
  let recentItems;
  let shop;
  let currentPromotions;
  let title1;
  let message1;
  let link1;
  let title2;
  let message2;
  let link2;
  let title3;
  let message3;
  let link3;
  let alertMessage200;
  let alertMessage400;
  let alertMessage500;

  if (!lang || lang === 'en') {
    current = 'English';
    description = 'shop our newest cameras and more'; // default to English if not already set.
    recentItems = 'recently viewed items'
    shop = "shop now"
    currentPromotions = "Current Promotions"
    title1 = "Capture your Memories"
    message1 = "'Photos allow us to record life's greatest moments, so they can stay in our memories forever.' - Keo Tsang"
    link1 = "Visit Keo's Channel"
    title2 = "Premium Camera Hardware"
    message2 = "Get the latest cameras, lenses and more from us."
    link2 = "Shop Now"
    title3 = "The Meaning of Photography"
    message3 = "'Photography means something to me. What does it mean to you?' - Peter McKinnon"
    link3 = "Read more"
    alertMessage200 = "Successfully created user" 
    alertMessage400 = "Failed!! User Already Exist"
    alertMessage500 = "Failed to add User for DataBase Connection Error"
} else {
    current = "French"
    description = 'magasinez nos caméras les plus récentes et encore';
    featItems = 'articles récemment vus'
    shop = "magasinez maintenant"
    currentPromotions = "Promotions En Cours"
    title1 = "Capturez Vos Souvenirs"
    message1 = "'Les photos nous permettent d'enregistrer les plus grands moments de la vie, afin qu'ils puissent rester dans nos mémoires pour toujours.' - Kéo Tsang"
    link1 = "Visitez La Chaîne De Keo"
    title2 = "Prime Matériel De Caméra"
    message2 = "Obtenez les derniers appareils photo, objectifs et plus encore de notre part."
    link2 = "Magasinez Maintenant"
    title3 = "Le Sens De La Photographie"
    message3 = "« La photographie signifie quelque chose pour moi. Qu'est-ce que cela signifie pour vous ? » -Peter McKinnon"
    link3 = "en savoir plus"
    alertMessage200 = "Créé utilisateur avec succès"
    alertMessage400 = "Erreur!! Utilisateur exist déjà"
    alertMessage500 = "Pas possible d'ajouter l'utilisateur pour l'erreur de connexion à la base de données"

}

  try {
    const added = await model.addUser(
      request.body.username,
      request.body.password,
      request.body.firstname,
      request.body.lastname
    );
    if (added) {
      response.render("home.hbs", {
        alertSuccess:true ,alertMessage:alertMessage200
      });
      // 200 success
    } else {
      response.status("400");
      response.render("error.hbs", {
        alertMessage: alertMessage400,
      });
    }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: alertMessage500,
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
        alertMessage: alertMessage500,
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
  let lang = request.cookies.language;
  let current;
  let description;
  let recentItems;
  let shop;
  let currentPromotions;
  let title1;
  let message1;
  let link1;
  let title2;
  let message2;
  let link2;
  let title3;
  let message3;
  let link3;
  let alertMessage200;
  let alertMessage400;
  let alertMessage500;

  if (!lang || lang === 'en') {
      current = 'English';
      description = 'shop our newest cameras and more'; // default to English if not already set.
      recentItems = 'recently viewed items'
      shop = "shop now"
      currentPromotions = "Current Promotions"
      title1 = "Capture your Memories"
      message1 = "'Photos allow us to record life's greatest moments, so they can stay in our memories forever.' - Keo Tsang"
      link1 = "Visit Keo's Channel"
      title2 = "Premium Camera Hardware"
      message2 = "Get the latest cameras, lenses and more from us."
      link2 = "Shop Now"
      title3 = "The Meaning of Photography"
      message3 = "'Photography means something to me. What does it mean to you?' - Peter McKinnon"
      link3 = "Read more"
      alertMessage200 = "Successfully go all users"
      alertMessage400 = "Failed to get all users"
      alertMessage500 = "Failed to get all users for DataBase Connection Error"
  } else {
      current = "French"
      description = 'magasinez nos caméras les plus récentes et encore';
      featItems = 'articles récemment vus'
      shop = "magasinez maintenant"
      currentPromotions = "Promotions En Cours"
      title1 = "Capturez Vos Souvenirs"
      message1 = "'Les photos nous permettent d'enregistrer les plus grands moments de la vie, afin qu'ils puissent rester dans nos mémoires pour toujours.' - Kéo Tsang"
      link1 = "Visitez La Chaîne De Keo"
      title2 = "Prime Matériel De Caméra"
      message2 = "Obtenez les derniers appareils photo, objectifs et plus encore de notre part."
      link2 = "Magasinez Maintenant"
      title3 = "Le Sens De La Photographie"
      message3 = "« La photographie signifie quelque chose pour moi. Qu'est-ce que cela signifie pour vous ? » -Peter McKinnon"
      link3 = "en savoir plus"
      alertMessage200 = "Reçu tous les utlisateurs avec succès"
      alertMessage400 = "Pas possible de recevoir tous les utilsateurs"
      alertMessage500 = "Pas possible d'ajouter l'utilisateur pour l'erreur de connexion à la base de données"

  }
  try {
    const allUsers = await model.getAllUsers();
    if (allUsers.length > 0) {
      response.render("showUser.hbs", {
        message: alertMessage200,
        list: allUsers,
        ListAll: true,
      });
      // 200 success
    } else {
      response.status("400");
      response.render("home.hbs", { alterMessage: alertMessage400, description:description, recentItems:recentItems, shop: shop, currentPromotions:currentPromotions, title1:title1, title2:title2, title3:title3, message1:message1, message2:message2, message3:message3, link1:link1, link2:link2, link3:link3
      });
    }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
      response.status("500");
      response.render("home.hbs", {
        alertMessage: alertMessage500, description:description, recentItems:recentItems, shop: shop, currentPromotions:currentPromotions, title1:title1, title2:title2, title3:title3, message1:message1, message2:message2, message3:message3, link1:link1, link2:link2, link3:link3  
      });
    } else if (error instanceof model.InvalidInputError) {
      response.status("400");
      response.render("home.hbs", { alertMessage:alertMessage400, description:description, recentItems:recentItems, shop: shop, currentPromotions:currentPromotions, title1:title1, title2:title2, title3:title3, message1:message1, message2:message2, message3:message3, link1:link1, link2:link2, link3:link3
      });  
    } else {
      response.status("500");
      response.render("home.hbs", {
        alertMessage: alertMessage500, description:description, recentItems:recentItems, shop: shop, currentPromotions:currentPromotions, title1:title1, title2:title2, title3:title3, message1:message1, message2:message2, message3:message3, link1:link1, link2:link2, link3:link3  
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
  let lang = request.cookies.language;
  let current;
  let description;
  let recentItems;
  let shop;
  let currentPromotions;
  let title1;
  let message1;
  let link1;
  let title2;
  let message2;
  let link2;
  let title3;
  let message3;
  let link3;
  let alertMessage200;
  let alertMessage400;
  let alertMessage500;
  let alertMessageLoggedIn;

  if (!lang || lang === 'en') {
      current = 'English';
      description = 'shop our newest cameras and more'; // default to English if not already set.
      recentItems = 'recently viewed items'
      shop = "shop now"
      currentPromotions = "Current Promotions"
      title1 = "Capture your Memories"
      message1 = "'Photos allow us to record life's greatest moments, so they can stay in our memories forever.' - Keo Tsang"
      link1 = "Visit Keo's Channel"
      title2 = "Premium Camera Hardware"
      message2 = "Get the latest cameras, lenses and more from us."
      link2 = "Shop Now"
      title3 = "The Meaning of Photography"
      message3 = "'Photography means something to me. What does it mean to you?' - Peter McKinnon"
      link3 = "Read more"
      alertMessage200 = "Successfully logged in"
      alertMessage400 = "Failed!! User may not exist"
      alertMessage500 = "Failed to log in for DataBase Connection Error"
      alertMessageLoggedIn = "Already logged in"
  } else {
      current = "French"
      description = 'magasinez nos caméras les plus récentes et encore';
      featItems = 'articles récemment vus'
      shop = "magasinez maintenant"
      currentPromotions = "Promotions En Cours"
      title1 = "Capturez Vos Souvenirs"
      message1 = "'Les photos nous permettent d'enregistrer les plus grands moments de la vie, afin qu'ils puissent rester dans nos mémoires pour toujours.' - Kéo Tsang"
      link1 = "Visitez La Chaîne De Keo"
      title2 = "Prime Matériel De Caméra"
      message2 = "Obtenez les derniers appareils photo, objectifs et plus encore de notre part."
      link2 = "Magasinez Maintenant"
      title3 = "Le Sens De La Photographie"
      message3 = "« La photographie signifie quelque chose pour moi. Qu'est-ce que cela signifie pour vous ? » -Peter McKinnon"
      link3 = "en savoir plus"
      alertMessage200 = "Coonecté avec succès"
      alertMessage400 = "Erreur!! Utilisateur exist déjà"
      alertMessage500 = "Pas possible d'ajouter l'utilisateur pour l'erreur de connexion à la base de données"

  }
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
          alertSuccess:true ,alertMessage: alertMessage200, description:description, recentItems:recentItems, shop: shop, currentPromotions:currentPromotions, title1:title1, title2:title2, title3:title3, message1:message1, message2:message2, message3:message3, link1:link1, link2:link2, link3:link3
        });
        // 200 success
      } else {
        response.status("400");
        response.render("error.hbs", {
          alertMessage: alertMessage400
        });
    };
    }
    else{  
      response.render("home.hbs", {
        alertAlreadyLogged:true ,alertMessage: alertAlreadyLogged, description:description, recentItems:recentItems, shop: shop, currentPromotions:currentPromotions, title1:title1, title2:title2, title3:title3, message1:message1, message2:message2, message3:message3, link1:link1, link2:link2, link3:link3
      })}

  } catch (error) {
    if (error instanceof model.DBConnectionError) {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: alertMessage500  
      });
    } else if (error instanceof model.InvalidInputError) {
      response.status("400");
      response.render("error.hbs", {
        alertMessage: alertMessage400
      });
    } else {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: alertMessage500  
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
  let lang = request.cookies.language;
  let current;
  let description;
  let recentItems;
  let shop;
  let currentPromotions;
  let title1;
  let message1;
  let link1;
  let title2;
  let message2;
  let link2;
  let title3;
  let message3;
  let link3;
  let alertMessage200;
  let alertMessage400;
  let alertMessage500;

  if (!lang || lang === 'en') {
      current = 'English';
      description = 'shop our newest cameras and more'; // default to English if not already set.
      recentItems = 'recently viewed items'
      shop = "shop now"
      currentPromotions = "Current Promotions"
      title1 = "Capture your Memories"
      message1 = "'Photos allow us to record life's greatest moments, so they can stay in our memories forever.' - Keo Tsang"
      link1 = "Visit Keo's Channel"
      title2 = "Premium Camera Hardware"
      message2 = "Get the latest cameras, lenses and more from us."
      link2 = "Shop Now"
      title3 = "The Meaning of Photography"
      message3 = "'Photography means something to me. What does it mean to you?' - Peter McKinnon"
      link3 = "Read more"
      alertMessage200 = "Successfully updated the user"
      alertMessage400 = "Failed!! User may not exist"
      alertMessage500 = "Failed to update password for DataBase Connection Error"
  } else {
      current = "French"
      description = 'magasinez nos caméras les plus récentes et encore';
      featItems = 'articles récemment vus'
      shop = "magasinez maintenant"
      currentPromotions = "Promotions En Cours"
      title1 = "Capturez Vos Souvenirs"
      message1 = "'Les photos nous permettent d'enregistrer les plus grands moments de la vie, afin qu'ils puissent rester dans nos mémoires pour toujours.' - Kéo Tsang"
      link1 = "Visitez La Chaîne De Keo"
      title2 = "Prime Matériel De Caméra"
      message2 = "Obtenez les derniers appareils photo, objectifs et plus encore de notre part."
      link2 = "Magasinez Maintenant"
      title3 = "Le Sens De La Photographie"
      message3 = "« La photographie signifie quelque chose pour moi. Qu'est-ce que cela signifie pour vous ? » -Peter McKinnon"
      link3 = "en savoir plus"
      alertMessage200 = "Mis à jout l'utilisateur avec succès"
      alertMessage400 = "Erreur!! Utilisateur n'existe pas"
      alertMessage500 = "Pas ppossible d'ajouter l'utilisateur pour l'erreur de connexion à la base de données"

  }
  try {
    const oneUsers = await model.UpdateUserPassword(
      request.body.username,
      request.body.newpassword
    );
    if (oneUsers) {
      response.render("showUser.hbs", {
        message: alertMessage200,
        ListAll: false,
      });
      // 200 success
    }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: alertMessage500 
      });
    } else if (error instanceof model.InvalidInputError) {
      response.status("400");
      response.render("error.hbs", {
        alertMessage: alertMessage400
      });
    } else {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: alertMessage500});
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
  let lang = request.cookies.language;
  let current;
  let description;
  let recentItems;
  let shop;
  let currentPromotions;
  let title1;
  let message1;
  let link1;
  let title2;
  let message2;
  let link2;
  let title3;
  let message3;
  let link3;
  let alertMessage200;
  let alertMessage400;
  let alertMessage500;

  if (!lang || lang === 'en') {
      current = 'English';
      description = 'shop our newest cameras and more'; // default to English if not already set.
      recentItems = 'recently viewed items'
      shop = "shop now"
      currentPromotions = "Current Promotions"
      title1 = "Capture your Memories"
      message1 = "'Photos allow us to record life's greatest moments, so they can stay in our memories forever.' - Keo Tsang"
      link1 = "Visit Keo's Channel"
      title2 = "Premium Camera Hardware"
      message2 = "Get the latest cameras, lenses and more from us."
      link2 = "Shop Now"
      title3 = "The Meaning of Photography"
      message3 = "'Photography means something to me. What does it mean to you?' - Peter McKinnon"
      link3 = "Read more"
      alertMessage200 = "Successfully deleted user"
      alertMessage400 = "Failed to delete user may not exist"
      alertMessage500 = "Failed to delete User for DataBase Connection Error"
  } else {
      current = "French"
      description = 'magasinez nos caméras les plus récentes et encore';
      featItems = 'articles récemment vus'
      shop = "magasinez maintenant"
      currentPromotions = "Promotions En Cours"
      title1 = "Capturez Vos Souvenirs"
      message1 = "'Les photos nous permettent d'enregistrer les plus grands moments de la vie, afin qu'ils puissent rester dans nos mémoires pour toujours.' - Kéo Tsang"
      link1 = "Visitez La Chaîne De Keo"
      title2 = "Prime Matériel De Caméra"
      message2 = "Obtenez les derniers appareils photo, objectifs et plus encore de notre part."
      link2 = "Magasinez Maintenant"
      title3 = "Le Sens De La Photographie"
      message3 = "« La photographie signifie quelque chose pour moi. Qu'est-ce que cela signifie pour vous ? » -Peter McKinnon"
      link3 = "en savoir plus"
      alertMessage200 = "Enlevé utilisateur avec succès"
      alertMessage400 = "Pas possible d'enlever utilisateur"
      alertMessage500 = "Impossible d'ajouter l'utilisateur pour l'erreur de connexion à la base de données"

  }
  try {
    const deleteUser = await model.DeleteUser(request.body.username);
    if (deleteUser) {
      response.render("showUser.hbs", {
        message: alertMessage200,
        ListAll: false,
      });
      // 200 success
    }
  } catch (error) {
    if (error instanceof model.DBConnectionError) {
      response.status("500");
      response.render("home.hbs", {
        alertMessage: alertMessage500, description:description, recentItems:recentItems, shop: shop, currentPromotions:currentPromotions, title1:title1, title2:title2, title3:title3, message1:message1, message2:message2, message3:message3, link1:link1, link2:link2, link3:link3
});
    } else if (error instanceof model.InvalidInputError) {
      response.status("400");
      response.render("error.hbs", {
        alertMessage: alertMessage400
      });
    } else {
      response.status("500");
      response.render("error.hbs", {
        alertMessage: alertMessage500
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
  let lang = request.cookies.language;
  let current;
  let description;
  let recentItems;
  let shop;
  let currentPromotions;
  let title1;
  let message1;
  let link1;
  let title2;
  let message2;
  let link2;
  let title3;
  let message3;
  let link3;
  let alertMessage200;

  if (!lang || lang === 'en') {
      current = 'English';
      description = 'shop our newest cameras and more'; // default to English if not already set.
      recentItems = 'recently viewed items'
      shop = "shop now"
      currentPromotions = "Current Promotions"
      title1 = "Capture your Memories"
      message1 = "'Photos allow us to record life's greatest moments, so they can stay in our memories forever.' - Keo Tsang"
      link1 = "Visit Keo's Channel"
      title2 = "Premium Camera Hardware"
      message2 = "Get the latest cameras, lenses and more from us."
      link2 = "Shop Now"
      title3 = "The Meaning of Photography"
      message3 = "'Photography means something to me. What does it mean to you?' - Peter McKinnon"
      link3 = "Read more"
      alertMessage200 = "Successfully logged out"
  } else {
      current = "French"
      description = 'magasinez nos caméras les plus récentes et encore';
      featItems = 'articles récemment vus'
      shop = "magasinez maintenant"
      currentPromotions = "Promotions En Cours"
      title1 = "Capturez Vos Souvenirs"
      message1 = "'Les photos nous permettent d'enregistrer les plus grands moments de la vie, afin qu'ils puissent rester dans nos mémoires pour toujours.' - Kéo Tsang"
      link1 = "Visitez La Chaîne De Keo"
      title2 = "Prime Matériel De Caméra"
      message2 = "Obtenez les derniers appareils photo, objectifs et plus encore de notre part."
      link2 = "Magasinez Maintenant"
      title3 = "Le Sens De La Photographie"
      message3 = "« La photographie signifie quelque chose pour moi. Qu'est-ce que cela signifie pour vous ? » -Peter McKinnon"
      link3 = "en savoir plus"
      alertMessage200 = "Déconnecté avec succès"

  }
  const authenticatedSession = authenticateUser(request);
  if (!authenticatedSession) {
        response.redirect('/');
      return;
  }
  delete sessions[authenticatedSession.sessionId]
  console.log("Logged out user " + authenticatedSession.userSession.username);
  


  product.deleteAllItemFromCart();
  
  response.cookie("sessionId", "", { expires: new Date() }); // "erase" cookie by forcing it to expire.
  response.cookie("id", "", { expires: new Date() }); // "erase" cookie by forcing it to expire.
  response.cookie("shoppingCart", "", { expires: new Date() }); // "erase" cookie by forcing it to expire.
  
  

  response.render("home.hbs", {
    alertSuccess:true ,alertMessage: alertMessage200,  description:description, recentItems:recentItems, shop: shop, currentPromotions:currentPromotions, title1:title1, title2:title2, title3:title3, message1:message1, message2:message2, message3:message3, link1:link1, link2:link2, link3:link3
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
