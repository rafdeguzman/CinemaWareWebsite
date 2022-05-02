const app = require("./app");
const port = 1339;
const model = require("./models/productsModel");

app.listen(port);
// WARNING: UNCOMMENT BELOW FOR FINAL PROJECT
//let dbName = process.argv[2];
//if (!dbName) {
//    dbName = 'hardware_db';
//}
//model.initialize(dbName, false)
//    .then(
//        app.listen(port) // Run the server
//    );