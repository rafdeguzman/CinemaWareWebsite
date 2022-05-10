const app = require("./app.js");
const port = 1339;
const model = require("./models/userModelMysql");
model.initialize("hardware_db", true).then(
  app.listen(port) // Run the server
);
