const express = require('express');
const req = require('express/lib/request');
const model = require('../models/productModelMysql');
const router = express.Router();
const routeRoot = '/';
router.post('/product', createProduct);
router.post('/product/update', updateProduct);
router.post('/product/delete', removeProduct);
//router.get('/product', showProduct)

/**
*  Handles post /product endpoint.
*  Calls the model to add a product with the name category and price
* 
* @param {*} req: Express request expecting JSON body with values req.body name, category and price
* @param {*} res: Sends a successful response, 400-level response if inputs are invalid or
*                        a 500-level response if there is a system error
*/
async function createProduct(req, res) {
    try {
        const added = await model.addProduct(req.body.name, req.body.category, req.body.price);
        console.log("in create product")
        if (added) {
            console.log("successfully added, going to render")
            res.render("showProduct.hbs", {message: "Successfully added product", name: added.name, category: added.category, price: added.price});
            //res.status("200");
        } else {
            res.render("home.hbs", 
            {
                alertMessage: "Failed to Add Product: Invalid Input" ,
                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
            res.status("400");
            //res.send("Failed to add pokemon for unknown reason");
        }
    } catch (error) {
        if (error instanceof model.DBConnectionError) {

            res.status("500");
            //res.send("System error trying to add pokemon: " + error.message);
            res.render("home.hbs",
            { 
                alertMessage: "Failed to Add Product: DbConnectionError",
                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
        } else if (error instanceof model.InvalidInputError) {
            res.status("400");
            //res.send("Validation error trying to add pokemon: " + error.message);
            res.render("home.hbs", 
            {
                alertMessage: "Failed to Add Product: Invalid Input" ,
                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
        } else {
            res.status("500");
            //res.send("Unexpected error trying to add pokemon: " + error.message);
            res.render("home.hbs",
            { 
                alertMessage: "Failed to Add Product: Unexpected Error",
                image:pokemonImg,
                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
        }
    }
}
/**
* Updates a product using specified id as key. 
* @param {*} req: Express request expecting JSON body with values req.body name, category and price
* @param {*} res: Sends a successful response, 400-level response if inputs are invalid or
*                        a 500-level response if there is a system error
*/
async function updateProduct(req, res) {
    try {
        const toUpdate = await model.updateProduct(req.body.id, req.body.name, req.body.category, req.body.price);
        console.log("in update product")
        if (toUpdate) {
            console.log("successfully updated, going to render")
            res.render("showProduct.hbs", {message: "Successfully updated product", name: toUpdate.name, category: toUpdate.category, price: toUpdate.price});
            //res.status("200");
        } else {
            res.render("home.hbs", 
            {
                alertMessage: "Failed to Update Product: Invalid Input" ,
                formFields:[    
                    "id",
                    "name",
                    "category",
                    "price" 
                ]
            });
            res.status("400");
            //res.send("Failed to add pokemon for unknown reason");
        }
    } catch (error) {
        if (error instanceof model.DBConnectionError) {

            res.status("500");
            //res.send("System error trying to add pokemon: " + error.message);
            res.render("home.hbs",
            { 
                alertMessage: "Failed to Update Product: DbConnectionError",
                image:pokemonImg,
                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
        } else if (error instanceof model.InvalidInputError) {
            res.status("400");
            res.render("home.hbs", 
            {
                alertMessage: "Failed to Update Product: Invalid Input" ,

                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
        } else {
            res.status("500");
            res.render("home.hbs",
            { 
                alertMessage: "Failed to Update Product: Unexpected Error",
                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
        }
    }
}
/**
 * Removes a product using specified id as key.
 * @param {*} req: Express request expecting JSON body with values req.body name, category and price
 * @param {*} res: Sends a successful response, 400-level response if inputs are invalid or
 *                        a 500-level response if there is a system error
 */
async function removeProduct(req, res) {
    try {
        const toRemove = await model.removeProduct(req.body.id);
        console.log("in remove product")
        if (toRemove) {
            res.render("showProduct.hbs", {message: "Successfully removed product", name: toRemove.name, category: toRemove.category, price: toRemove.price});
            //res.status("200");
        } else {
            res.render("home.hbs", 
            {
                alertMessage: "Failed to Update Product: Invalid Input" ,
                formFields:[    
                    "id",
                    "name",
                    "category",
                    "price" 
                ]
            });
            res.status("400");
        }
    } catch (error) {
        if (error instanceof model.DBConnectionError) {

            res.status("500");
            //res.send("System error trying to add pokemon: " + error.message);
            res.render("home.hbs",
            { 
                alertMessage: "Failed to Update Product: DbConnectionError",
                image:pokemonImg,
                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
        } else if (error instanceof model.InvalidInputError) {
            res.status("400");
            res.render("home.hbs", 
            {
                alertMessage: "Failed to Update Product: Invalid Input" ,

                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
        } else {
            res.status("500");
            res.render("home.hbs",
            { 
                alertMessage: "Failed to Update Product: Unexpected Error",
                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
        }
    }
}
/**
 * Shows product's info using selected id as a key.
 * @param {*} req: Express request expecting JSON body with values req.body name, category and price
 * @param {*} res: Sends a successful response, 400-level response if inputs are invalid or
 *                        a 500-level response if there is a system error
 */
async function showProduct(req, res) {
    try {
        const find = await model.findProduct(req.body.id);
        console.log("in find product")
        if (find) {
            res.render("showProduct.hbs", {message: "Successfully found product", name: find.name, category: find.category, price: find.price});
            //res.status("200");
        } else {
            res.render("home.hbs", 
            {
                alertMessage: "Failed to Find Product: Invalid Input" ,
                formFields:[    
                    "id",
                    "name",
                    "category",
                    "price" 
                ]
            });
            res.status("400");
        }
    } catch (error) {
        if (error instanceof model.DBConnectionError) {

            res.status("500");
            //res.send("System error trying to add pokemon: " + error.message);
            res.render("home.hbs",
            { 
                alertMessage: "Failed to Update Product: DbConnectionError",
                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
        } else if (error instanceof model.InvalidInputError) {
            res.status("400");
            res.render("home.hbs", 
            {
                alertMessage: "Failed to Update Product: Invalid Input" ,
                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
        } else {
            res.status("500");
            res.render("home.hbs",
            { 
                alertMessage: "Failed to Update Product: Unexpected Error",
                formFields:[    
                    "name",
                    "category",
                    "price" 
                ]
            });
        }
    }
}


module.exports = {
    createProduct,
    updateProduct,
    removeProduct,
    showProduct,
    router,
    routeRoot
}