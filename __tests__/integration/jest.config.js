process.env.NODE_ENV = 'test';

// npm packages
const request = require('supertest');

// app imports
const app = require('../app');
const db = require('../db');


const companyRoutes = require('../../route/companies');

//JE

// before each post a new company 
/**can write raw sql to create a company */

beforeEach( async function (){
    // create a company in the test-db

    const result = await db.query(`
        INSERT INTO companies (handle, name, num_employees, description, logo_url) VALUES ('test', 'test-company', 'test description'), 'http://www.logo.com' )`);

    console.log(result.rows[0]);
})

// POST a company 
describe('POST / to add a new company', () => {
    test('add a new company to DB', async function() {
        const newCompany = await Company.create(req.body);
    return res.json({ company: newCompany });
    })    
})


///GET company by handle










//PV 

describe('PATCH the companies table by handle in url PATCH/companies/[handle]' async function() {
    test(`It should return the PATCHED company details`, async function)
})