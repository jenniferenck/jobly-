/** Company class for job.ly */

const db = require('../db');
// const bcrypt = require('bcrypt');

/** Company of the site. */

class Company {
  // 1. Get companies by search function:
  static async searchCompanies(queryString) {
    // include code from first view

    let sqlStatment = `SELECT handle, name FROM companies`;
    let idx = 1;
    let minProvided = false;
    let params = [];

    // for more flexible search can provide 'LIKE' * language
    if (queryString.search) {
      // filtering companies return handles and names based on the filter
      sqlStatment += ` WHERE name = $${idx}`;
      params.push(queryString.search);
      idx++;
    }
    if (queryString.min_employees) {
      // do something with min display titles and company handles
      if (idx > 1) {
        sqlStatment += ` AND`;
      } else {
        sqlStatment += ` WHERE`;
      }
      sqlStatment += ` num_employees >= $${idx}`;
      params.push(+queryString.min_employees);
      idx++;
      minProvided = true;
    }
    if (queryString.max_employees) {
      // display list of titles and company handles with employees less than max_employees
      if (minProvided) {
        if (queryString.max_employees < queryString.min_employees) {
          const err = new Error('Invalid Parameters...Min should be < Max!');
          // return res.json({
          //     message: err.message,
          //     status: err.status
          throw err;
        }
      }
      if (idx > 1) {
        sqlStatment += ` AND`;
      } else {
        sqlStatment += ` WHERE`;
      }
      sqlStatment += ` num_employees <= $${idx}`;
      params.push(+queryString.max_employees);
    }
    // sqlStatment += `;`;
    const result = await db.query(sqlStatment, params);

    //CR: If not search data, can get empty array TO DELETE
    // if (!result.rows[0]) {
    //   const err = new Error('Company not found - try again');
    //   throw err;
    // }

    return result.rows;
  }

  // 2. Create/ add companies (POST)
  static async create({ handle, name, num_employees, description, logo_url }) {
    const result = await db.query(
      `INSERT INTO companies (handle, name, num_employees, description, logo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [handle, name, num_employees, description, logo_url]
    );
    return result.rows[0];
  }
  // 3. Get individual company

  static async getCompany(handle) {
    const result = await db.query(`SELECT * FROM companies WHERE handle = $1`, [
      handle
    ]);

    if (!result.rows[0]) {
      const err = new Error('Company not found - try again');
      throw err;
    }
    return result.rows[0];
  }

  // 4. Update existing company (PATCH)
  // static async update() {
  //   sqlForPartialUpdate(table, items, key, id);
  // }

  // 5. Delete existing company (DELETE)
  static async deleteCompany(handle) {
    const result = await db.query(
      `DELETE FROM companies WHERE handle = $1 RETURNING handle`,
      [handle]
    );
    if (result.rows.length === 0) {
      let notFoundError = new Error(`No company with handle of ${handle}`);
      throw notFoundError;
    }
    return result.rows[0];
  }
}

module.exports = Company;
