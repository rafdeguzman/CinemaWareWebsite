const app = require("./app");
const port = 1339;
const model = require("./models/productModelMySql");

//app.listen(port);
// WARNING: UNCOMMENT BELOW FOR FINAL PROJECT
// //let dbName = process.argv[2];
// if (!dbName) {
//    dbName = 'product_db';
// }
model.initialize('product_db', true)
   .then(
       app.listen(port) // Run the server
   );