import { checkServerIdentity } from 'tls';
import { searchCompanies } from './models/company';

/** 

"test": "echo \"Error: no test specified\" && exit 1",

"handle" : "goog", "name": "Google", "num_employees" : 1000, "description" : "Evil company", "logo_url" : "http://www.google.com"

// ARGS: (table, items, key, id)
const table = 'companies';
const key = req.params.handle;
const items = req.body;

const newCompany = await Company.create(table, items, key, 50);

static async update({ handle, name, num_employees, description, logo_url }) {
    const result = await db.query(
        `INSERT INTO companies (handle, name, num_employees, description, logo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [handle, name, num_employees, description, logo_url]
    );

    return result.rows[0];
    }
    
      table, items, handle, id

Didnt work in test for patch
    expect(response.body).toMatchObject({
      description: 'Test description',
      num_employees: 123
    });


**/
