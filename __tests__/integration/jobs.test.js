process.env.NODE_ENV = 'test';

// npm packages
const request = require('supertest');

// app imports
const app = require('../../app');
const db = require('../../db');

// const jobRoutes = require('../../routes/jobs');

let job;

// before each post a new company
/**can write raw sql to create a job */

beforeEach(async function() {
  // 1. create a company in the jobly-test
  await db.query(
    `INSERT INTO companies (handle, name, num_employees, description, logo_url) VALUES ('test', 'test-company', 100, 'This is a test description', 'http://www.logo.com') RETURNING *`
  );

  //   2. create a job from the above company
  //   CHECK THAT TIMESTAMP IS BEING AUT0-GENERATED...
  job = await db.query(
    `INSERT INTO jobs (title, salary, equity, company_handle) VALUES ('Accountant', 100000, .005, 'test') RETURNING *`
  );
  //   console.log('JOB IS --------- ', job);
});

// describe('Test Job class', async function() {

// });

// GET & SEARCh jobs by name, salary & equity

describe('Search for all jobs with name, salary and equity criteria', async function() {
  test('returns all companies at root', async function() {
    // checks for list of ALL companies
    const response = await request(app).get(`/jobs`);
    expect(response.statusCode).toBe(200);
    expect(response.body.jobs[0]).toHaveProperty('title');
  });

  test('returns data after search with title', async function() {
    const response = await request(app).get(`/jobs?search=Accountant`);
    expect(response.body.jobs[0]['title']).toEqual('Accountant');
  });

  test('returns data after search with min_salary', async function() {
    const response = await request(app).get(`/jobs?min_salary=50000`);
    console.log('IN TEST ', response.body.jobs);

    expect(response.body.jobs[0]).toHaveProperty('title');
  });

  test('returns data after search with min_equity', async function() {
    const response = await request(app).get(`/jobs?min_equity=.001`);
    expect(response.body.jobs[0]).toHaveProperty('title');
    expect(response.body.jobs[0].title).toEqual('Accountant');
  });

  // check this!
  test('returns nothing after search with min_salary higher than entry', async function() {
    const response = await request(app).get(`/jobs?min_salary=1000000`);
    expect(response.statusCode).toBe(404);
    expect(response.body.error.message).toEqual(
      'No jobs matching criteria found'
    );
  });

  test('returns data after search with name and min salary', async function() {
    const response = await request(app).get(
      `/jobs?search=Accountant&min_salary=90000`
    );
    expect(response.statusCode).toBe(200);
    console.log('response.body -----', response.body);
    expect(response.body.jobs[0].title).toEqual('Accountant');
  });

  test('returns data after search with title and min equity', async function() {
    const response = await request(app).get(
      `/jobs?min_equity=.001&search=Accountant`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.jobs[0].title).toEqual('Accountant');
  });
});

// 2. GET job by ID
// check that ID matches search
// check for 404 if invalid search

// 3. POST a new job
// check for 409 if job already exists
// check response for newly created job

// 4. PATCH an existing job
// check that validation is working correctly - did we add?
//

// 5. DELETE an existing job
// check that we 1st search for the job before deleting it
// check for message of deleted job
// check for cascade on delete??

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
