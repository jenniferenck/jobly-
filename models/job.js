/** Job class for job.ly */
const APIError = require('../helpers/APIError');
const db = require('../db');
const sqlForPartialUpdate = require('../helpers/partialUpdate.js');

// const bcrypt = require('bcrypt');

/** Jobs on the site. */

class Job {
  // Model POST new job

  static async create(objectFromBody) {
    const { title, salary, equity, company_handle } = objectFromBody;
    // console.log(title, salary, equity, company_handle);
    const result = await db.query(
      `INSERT INTO jobs (title, salary, equity, company_handle, date_posted) VALUES ($1, $2, $3, $4, current_timestamp) RETURNING *`,
      [title, salary, equity, company_handle]
    );
    // console.log('result.rows = ', result.rows);
    if (result.rows.length === 0) {
      throw new APIError(400, 'Cannot add job');
    }
    return result.rows;
  }

  // Model GET/ SEARCH by job

  static async searchJobs(queryString) {
    // include code from first view

    let sqlStatment = `SELECT title, company_handle FROM jobs`;
    let idx = 1;
    let minProvided = false;
    let params = [];

    if (queryString.search) {
      // filtering companies return handles and names based on the filter
      sqlStatment += ` WHERE title = $${idx}`;
      params.push(queryString.search);
      idx++;
    }
    if (queryString.min_salary) {
      // do something with min display titles and company handles
      if (idx > 1) {
        sqlStatment += ` AND`;
      } else {
        sqlStatment += ` WHERE`;
      }
      sqlStatment += ` salary >= $${idx}`;
      params.push(+queryString.min_salary);
      idx++;
    }
    if (queryString.min_equity) {
      // display list of titles and company handles with employees less than max_employees

      if (idx > 1) {
        sqlStatment += ` AND`;
      } else {
        sqlStatment += ` WHERE`;
      }
      sqlStatment += ` equity >= $${idx}`;
      params.push(+queryString.min_equity);
    }
    // sqlStatment += `;`;
    const result = await db.query(sqlStatment, params);
    if (result.rows.length === 0) {
      throw new Error('No jobs matching criteria found');
    }
    //CR: If not search data, can get empty array TO DELETE
    // if (!result.rows[0]) {
    //   const err = new Error('Company not found - try again');
    //   throw err;
    // }

    return result.rows;
  }

  // Model GET job by id
  static async getJob(id) {
    try {
      const result = await db.query(`SELECT * FROM jobs WHERE id = $1`, [id]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
  // Model PATCH/ update job by id
  static async updateJob(table, items, key, id) {
    // check db for job by ID
    const search = await db.query(`SELECT id, title FROM jobs WHERE id = $1`, [
      id
    ]);

    if (search.rows.length === 0) {
      throw new Error('Job not found');
    }

    const result = await sqlForPartialUpdate(table, items, key, id);
    return result;
  }

  // Model DELETE job by id
  static async deleteJob(id) {
    // check db for job by ID
    const search = await db.query(`SELECT id, title FROM jobs WHERE id = $1`, [
      id
    ]);

    if (search.rows.length === 0) {
      throw new Error(`No job with id of ${id} exists`);
    }

    const result = await db.query(
      `DELETE FROM jobs WHERE id = $1 RETURNING *`,
      [id]
    );
    // console.log(result);

    return result.rows[0];
  }
}

module.exports = Job;
