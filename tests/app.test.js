const app = require("../app");
const supertest = require("supertest");
const testRequest = supertest(app);

const dbName = "product_db_test";
const model = require('../models/productModelMysql');

/*==================================================================================================*/

beforeEach(async () => {
    await model.initialize(dbName, true);
});

/**
 * SUCCESS case for login (admin user already exists)
 */
test("POST /login success case", async () => {
    const testResponse = await testRequest.post('/login').send({
        username:'admin',
        password:'admin'
    })
    expect(testResponse.status).toBe(200);

});

afterEach(async () => {
    connection = model.getConnection();
    if (connection) {
        await connection.close();
    }
});	

/*==================================================================================================*/

beforeEach(async () => {
    await model.initialize(dbName, true);
});

/**
 * FAILURE case for login (test user does not exist)
 */
test("POST /login falure case", async () => {
    const testResponse = await testRequest.post('/login').send({
        username:'test',
        password:'admin'
    })
    expect(testResponse.status).toBe(400);

});

afterEach(async () => {
    connection = model.getConnection();
    if (connection) {
        await connection.close();
    }
});	

/*==================================================================================================*/

beforeEach(async () => {
    await model.initialize(dbName, true);
});

/**
 * SUCCESS case for signup (all fields are valid)
 */
test("POST /signup success case", async () => {
    const testResponse = await testRequest.post('/signup').send({
        firstname: 'name',
        lastname:'lastname',
        username:'test01',
        password:'@Testpass01'
    })
    expect(testResponse.status).toBe(200);

});

afterEach(async () => {
    connection = model.getConnection();
    if (connection) {
        await connection.close();
    }
});

/*==================================================================================================*/

beforeEach(async () => {
    await model.initialize(dbName, true);
});

/**
 * FAILURE case for signup (invalid firstname and lastname)
 */
test("POST /signup failure case", async () => {
    const testResponse = await testRequest.post('/signup').send({
        firstname: 'name1',
        lastname:'lastname1',
        username:'test02',
        password:'@Testpass01'
    })
    expect(testResponse.status).toBe(400);

});

afterEach(async () => {
    connection = model.getConnection();
    if (connection) {
        await connection.close();
    }
});

/*==================================================================================================*/

beforeEach(async () => {
    await model.initialize(dbName, true);
});

/**
 * FAILURE case for signup (invalid username - symbol)
 */
test("POST /signup failure case", async () => {
    const testResponse = await testRequest.post('/signup').send({
        firstname: 'name',
        lastname:'lastname',
        username:'test@',
        password:'@Testpass01'
    })
    expect(testResponse.status).toBe(400);

});

afterEach(async () => {
    connection = model.getConnection();
    if (connection) {
        await connection.close();
    }
});

/*==================================================================================================*/

beforeEach(async () => {
    await model.initialize(dbName, true);
});

/**
 * FAILURE case for signup (invalid password)
 */
test("POST /signup failure case", async () => {
    const testResponse = await testRequest.post('/signup').send({
        firstname: 'name',
        lastname:'lastname',
        username:'test02',
        password:'@Testpass'
    })
    expect(testResponse.status).toBe(400);

});

afterEach(async () => {
    connection = model.getConnection();
    if (connection) {
        await connection.close();
    }
});

/*==================================================================================================*/

beforeEach(async () => {
    await model.initialize(dbName, true);
});

/**
 * FAILURE case for signup (username already exists)
 */
test("POST /signup failure case", async () => {

    const firstResponse = await testRequest.post('/signup').send({
        firstname: 'name',
        lastname:'lastname',
        username:'test02',
        password:'@Testpass01'
    })

    const testResponse = await testRequest.post('/signup').send({
        firstname: 'name',
        lastname:'lastname',
        username:'test02',
        password:'@Testpass01'
    })
    expect(testResponse.status).toBe(400);

});

afterEach(async () => {
    connection = model.getConnection();
    if (connection) {
        await connection.close();
    }
});

/*==================================================================================================*/

beforeEach(async () => {
    await model.initialize(dbName, true);
});

/**
 * FAILURE case for signup (invalid password)
 */
test("POST /signup failure case", async () => {
    const testResponse = await testRequest.post('/signup').send({
        firstname: 'name',
        lastname:'lastname',
        username:'test02',
        password:'@Testpass'
    })
    expect(testResponse.status).toBe(400);

});

afterEach(async () => {
    connection = model.getConnection();
    if (connection) {
        await connection.close();
    }
});