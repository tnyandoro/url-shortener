const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const supertest = require('supertest');
const { expect } = require('chai');
const base62 = require('base62/lib/ascii');
const path = require('path'); 

const app = express();
app.use(bodyParser.json());

const PORT = 3001; // Use a different port for testing
const BASE_URL = `http://localhost:${PORT}`;

// Connect to SQLite in-memory database for testing
const db = new sqlite3.Database(':memory:');

// Import the routes module for testing
const routes = require('./routes');
app.use('/', routes(db, BASE_URL)); // Use the routes with the database connection

// Example test suite using Mocha and Chai
describe('URL Shortener API', () => {
    let request;

    before(() => {
        // Start the Express.js server before each test
        const server = app.listen(PORT);
        request = supertest(server);
    });

    after(() => {
        // Close the server after all tests
        db.close();
    });

    describe('POST /urls', () => {
        it('should create a new URL and return a short URL', async () => {
            const response = await request.post('/urls')
                .send({ name: 'Example', url: 'http://example.com' });

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('name', 'Example');
            expect(response.body).to.have.property('url', 'http://example.com');
            
            const encodedId = base62.encode(response.body.id);
            const shortUrl = `${BASE_URL}/${encodedId}`;
            expect(response.body).to.have.property('shortUrl', shortUrl);
        });
    });

    // Add more test cases for other endpoints
});
