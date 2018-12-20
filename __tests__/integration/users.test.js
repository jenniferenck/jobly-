process.env.NODE_ENV = 'test';

// npm packages
const request = require('supertest');

// app imports
const app = require('../../app');
const db = require('../../db');

// before each post a new user
/**can write raw sql to create a user */
