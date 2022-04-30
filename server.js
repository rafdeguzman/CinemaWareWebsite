const app = require('./app.js');
const port = 1339;
const model = require('./models/productModelMysql');
model.initialize('product_db', false)
    .then(
        app.listen(port) // Run the server
    );

    