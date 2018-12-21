process.env.NODE_ENV = 'test';

// npm packages
const request = require('supertest');

// app imports
const app = require('../../app');
const db = require('../../db');

// before each post a new user
/**can write raw sql to create a user */

beforeEach(async function() {
  // 1. create a user in the jobly-test
  await db.query(
    `INSERT INTO users (username,
        password,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin) VALUES ('testuser', 'password', 'first_name',
        'last_name',
        'email',
        'photo_url',
        true ) RETURNING *`
  );
});

// 1. GET & SEARCh jobs by name, salary & equity

// describe('Test Job class', async function() {

// });

// 2. GET job by ID

// 3. POST a new job

// 4. PATCH an existing job

// 5. DELETE an existing job

afterEach(async function() {
  // remove companies created after tests
  await db.query(`DELETE FROM companies`);
  // remove jobs created after tests
  await db.query(`DELETE FROM jobs`);
});

afterAll(async function() {
  // close db connection
  await db.end();
});
