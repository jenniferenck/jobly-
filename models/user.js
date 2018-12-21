/** Job class for job.ly */
const APIError = require('../helpers/APIError');
const db = require('../db');
const sqlForPartialUpdate = require('../helpers/partialUpdate.js');

// const bcrypt = require('bcrypt');

/** Users on the site. */

class User {
  // Post a new user
  // For tests, should get a 409 if username/ email already exists

  static async create(objectFromBody) {
    const {
      username,
      password,
      first_name,
      last_name,
      email,
      photo_url,
      is_admin
    } = objectFromBody;

    // check db for pre-existing user by ID
    const search = await db.query(
      `SELECT username, email FROM users WHERE username = $1 OR email = $2`,
      [username, email]
    );

    if (search.rows.length > 0) {
      throw new Error(
        'Username/email is already taken, please choose another combo'
      );
    }

    const result = await db.query(
      `INSERT INTO users (username,
        password,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [username, password, first_name, last_name, email, photo_url, is_admin]
    );
    console.log('result.rows = ', result.rows);
    if (result.rows.length === 0) {
      throw new APIError(400, 'Cannot add job');
    }
    return result.rows;
  }

  // Get a user by id

  static async getUser(username) {
    // check db for pre-existing user by username
    console.log(username);
    const result = await db.query(
      `SELECT username, password, first_name, last_name, email, photo_url, is_admin FROM users WHERE username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      throw new Error(`Sorry, the username: ${username} does not exist`);
    }

    return result.rows[0];
  }

  //Patch a user
  static async updateUser(table, items, key, username) {
    // check db for user by username
    const search = await db.query(`SELECT * FROM users WHERE username = $1`, [
      username
    ]);
    if (search.rows.length === 0) {
      throw new Error('User not found');
    }
    const result = await sqlForPartialUpdate(table, items, key, username);
    return result.rows[0];
  }

  //Delete a user
  static async deleteUser(username) {
    //search for user
    const search = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );

    if (search.rows.length === 0) {
      throw new Error(`No user with username ${username} exists`);
    }
    // delete user
    const result = await db.query(
      `DELETE FROM users WHERE username = $1 RETURNING *`,
      [username]
    );
    return result.rows[0];
  }
}

module.exports = User;
