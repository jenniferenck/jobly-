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
    `INSERT INTO jobs (title, salary, equity, company_handle, id) VALUES ('Accountant', 100000, .005, 'test', 1) RETURNING *`
  );
  // console.log('JOB IS --------- ', job);
});

// GET & SEARCh jobs by name, salary & equity

describe('Search for all jobs with name, salary and equity criteria', async function() {
  test('returns all jobs at root', async function() {
    // checks for list of ALL jobs
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
    // console.log('IN TEST ', response.body.jobs);

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
    // console.log('response.body -----', response.body);
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

describe('Getting, Patching & Deleting tests by id', async function() {
  // 2. GET job by ID
  // check that ID matches search
  // check for 404 if invalid search - TO DO..
  test('can get', async function() {
    const response = await request(app).get(`/jobs/1`);
    expect(response.statusCode).toBe(200);
    expect(response.body.job.company_handle).toEqual('test');
    expect(response.body.job).toHaveProperty('title');
  });

  // 3. POST a new job
  // check response for newly created job
  test('adds a new job to DB', async function() {
    const response = await request(app)
      .post('/jobs')
      .send({
        title: 'test-title',
        salary: 100000,
        equity: 0.0001,
        company_handle: 'test'
      });
    // console.log('response------', response.body);
    expect(response.body.jobs[0]).toHaveProperty('title');
    expect(response.body.jobs[0]).toHaveProperty('salary');
    expect(response.body.jobs[0].title).toBe('test-title');
  });

  // 4. PATCH an existing job
  // check that validation is working correctly - did we add?
  test('can patch', async function() {
    const response = await request(app)
      .patch(`/jobs/1`)
      .send({ salary: 1 }, 'id');
    expect(response.body).toMatchObject({
      title: 'Accountant',
      salary: 1,
      // date_posted: expect.any(Date),
      equity: 0.005,
      id: 1,
      company_handle: 'test'
    });
  });

  // 5. DELETE an existing job
  // test for FAILED delete due to no found user
  // describe('should fail to delete bc of no job found', async function {
  test('FAIL to delete', async function() {
    const response = await request(app).delete(`/jobs/5`);
    expect(response.statusCode).toBe(404);
    expect(response.body.error.message).toEqual(`No job with id of 5 exists`);
  });
  // });

  // check that we 1st search for the job before deleting it
  // check for message of deleted job - done
  // check for cascade on delete??

  test('can delete', async function() {
    const response = await request(app).delete(`/jobs/1`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      `Job id: 1 for Accountant successfully deleted`
    );
  });
});

afterEach(async function() {
  // remove jobs created after tests
  await db.query(`DELETE FROM jobs`);
  // remove jobs created after tests
  await db.query(`DELETE FROM companies`);
});

afterAll(async function() {
  // close db connection
  await db.end();
});
