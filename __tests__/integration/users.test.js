process.env.NODE_ENV = 'test';

// npm packages
const request = require('supertest');

// app imports
const app = require('../../app');
const db = require('../../db');

// before each post a new user
/**can write raw sql to create a user */

beforeEach(async function() {
  // 1. create a company in the jobly-test
  await db.query(
    `INSERT INTO companies (handle, name, num_employees, description, logo_url) VALUES ('test', 'test-company', 100, 'This is a test description', 'http://www.logo.com') RETURNING *`
  );

  //   2. create a job from the above company
  //   CHECK THAT TIMESTAMP IS BEING AUT0-GENERATED...
  await db.query(
    `INSERT INTO jobs (title, salary, equity, company_handle, id) VALUES ('Accountant', 100000, .005, 'test', 1) RETURNING *`
  );
  // console.log('JOB IS --------- ', job);

  // 3. create a new user
  const user = `INSERT INTO users (username, password, first_name, last_name, email, photo_url) VALUES (test, Test, User, test@test.com, http://www.google.com)`;
  console.log(user);
});

afterEach(async function() {
  // remove companies created after tests
  await db.query(`DELETE FROM companies`);
  // remove jobs created after tests
  await db.query(`DELETE FROM jobs`);
  // remove users created after tests
  await db.query(`DELETE FROM users`);
});

afterAll(async function() {
  // close db connection
  await db.end();
});
