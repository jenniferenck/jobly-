const db = require('../db');

/**
 * Generate a selective update query based on a request body:
 *
 * - table: where to make the query
 * - items: the list of columns you want to update
 * - key: the column that we query by (e.g. username, handle, id)
 * - id: current record ID
 *
 * Returns object containing a DB query as a string, and array of
 * string values to be updated
 *
 */

// Invocation is sqlForPartialUpdate("users", {firstName:"Elie", lastName: "Schoppik"}, "id", 100)

async function sqlForPartialUpdate(table, items, key, id) {
  // keep track of item indexes
  // store all the columns we want to update and associate with vals
  // console.log(table, items, key, id);

  let idx = 1;
  let columns = [];

  // filter out keys that start with "_" -- we don't want these in DB
  for (let key in items) {
    if (key.startsWith('_')) {
      delete items[key];
    }
  }

  for (let column in items) {
    columns.push(`${column}=$${idx}`);
    idx += 1;
  }

  // build query
  let cols = columns.join(', ');
  let query = `UPDATE ${table} SET ${cols} WHERE ${key}=$${idx} RETURNING *`;

  let values = Object.values(items);
  values.push(id);
  // console.log(query, values);
  const result = await db.query(query, values);
  // console.log(result.rows[0]);
  // return { query, values }; // This was the default return. Change it to result.rows[0];
  return result.rows[0];
}

module.exports = sqlForPartialUpdate;
