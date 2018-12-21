process.env.NODE_ENV = 'test';

// npm packages
const request = require('supertest');

// app imports
const app = require('../../app');
const db = require('../../db');

// before each post a new company
/**can write raw sql to create a company */

describe('Setup for company routes', async function() {
  beforeEach(async function() {
    // create a company in the test-db
    await db.query(
      `INSERT INTO companies (handle, name, num_employees, description, logo_url) VALUES ('test', 'test-company', 100, 'This is a test description', 'http://www.logo.com') RETURNING *`
    );
  });

  // GET & SEARCh companies by name and size

  // describe()
  test('returns all companies at root', async function() {
    // checks for list of ALL companies
    const response1 = await request(app).get(`/companies`);
    expect(response1.statusCode).toBe(200);
    expect(response1.body.companies[0]).toHaveProperty('name');
    expect(response1.body.companies).toHaveLength(1);
  });

  test('returns data after search with name', async function() {
    const response2 = await request(app).get(`/companies?search=test-company`);
    // console.log('IN TEST ', response2.body.companies);
    expect(response2.body.companies[0]['name']).toEqual('test-company');
  });

  test('returns data after search with min_employees', async function() {
    const response3 = await request(app).get(`/companies?min_employees=100`);
    expect(response3.body.companies[0]).toHaveProperty('handle');
  });

  test('returns data after search with max employees to fail', async function() {
    const response4 = await request(app).get(`/companies?max_employees=90`);
    expect(response4.statusCode).toBe(200);
    expect(response4.body.companies).toEqual([]);
  });

  test('returns data after search with name and min employees', async function() {
    const response = await request(app).get(
      `/companies?search=test-company&min_employees=100`
    );
    expect(response.body.companies[0].handle).toEqual('test');
  });

  test('returns data after search with name and min employees', async function() {
    const response = await request(app).get(
      `/companies?max_employees=90&min_employees=100`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.companies).toEqual([]);
  });

  // // POST a company

  test('adds a new company to DB', async function() {
    const response = await request(app)
      .post('/companies')
      .send({
        handle: 'test2',
        name: 'test name',
        num_employees: 20,
        description: 'test info',
        logo_url: 'http://test.com'
      });
    expect(response.body.company).toHaveProperty('handle');
    expect(response.body.company).toHaveProperty('name');
    expect(response.body.company).toHaveProperty('description');
    expect(response.body.company.handle).toBe('test2');
  });

  // test for duplicate company --> 409 status code
  // try running this

  test('FAILS to add a duplicate company', async function() {
    const response = await request(app)
      .post('/companies')
      .send({
        handle: 'test',
        name: 'test name',
        num_employees: 20,
        description: 'test info',
        logo_url: 'http://test.com'
      });
    expect(response.statusCode).toBe(409);
  });

  ///GET company by handle

  test('returns data of single company', async function() {
    const response = await request(app).get(`/companies/test`);
    expect(response.statusCode).toBe(200);
    expect(response.body.company.handle).toEqual('test');
    expect(response.body.company).toHaveProperty('name');
  });

  test('returns data of single company', async function() {
    const response = await request(app).get(`/companies/notACompany`);
    expect(response.statusCode).toBe(404); // what code for not found
  });

  // Update a company

  test(`can Patch`, async function() {
    const response = await request(app)
      .patch(`/companies/test`)
      .send(
        { description: 'Patched Test Description', num_employees: 123 },
        'handle'
      );
    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      companies: {
        description: 'Patched Test Description',
        handle: 'test',
        logo_url: 'http://www.logo.com',
        name: 'test-company',
        num_employees: 123
      }
    });
  });

  // test PATCH to invalid handle... status code?

  test(`can Delete`, async function() {
    const response = await request(app).delete(`/companies/test`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Company deleted' });
  });
});

// test DELETE to invalid handle... status code?

afterEach(async function() {
  // remove companies created after tests
  await db.query(`DELETE FROM companies`);
});

afterAll(async function() {
  // close db connection
  await db.end();
});
