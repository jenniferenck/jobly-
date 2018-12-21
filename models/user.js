/** Job class for job.ly */
const APIError = require('../helpers/APIError');
const db = require('../db');
const sqlForPartialUpdate = require('../helpers/partialUpdate.js');

// const bcrypt = require('bcrypt');

/** Users on the site. */

class User {
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
