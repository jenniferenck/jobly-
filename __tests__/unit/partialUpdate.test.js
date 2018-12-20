process.env.NODE_ENV = 'test';

const request = require('supertest');
// const app = require('../app');
// const db = require('../db');
const sqlForPartialUpdate = require('../../helpers/partialUpdate.js');

describe('partialUpdate()', () => {
  test('should generate a proper partial update query with just 1 field', function() {
    const sqlTestData = [
      'users',
      { firstName: 'Elie', lastName: 'Schoppik' },
      'id',
      100
    ];
    const sqlUpdateTest = sqlForPartialUpdate(...sqlTestData);

    // console.log(sqlUpdateTest.query, 'VALUES -- ', sqlUpdateTest.values);
    expect(sqlUpdateTest.query).toEqual(
      'UPDATE users SET firstName=$1, lastName=$2 WHERE id=$3 RETURNING *',
      'Error : Doesnt match query'
    );
    expect(sqlUpdateTest.values).toEqual(
      ['Elie', 'Schoppik', 100],
      'ERROR - Doesnt match values'
    );
  });
});
