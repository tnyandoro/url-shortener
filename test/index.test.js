import supertest from "supertest";
import app from "../app";

const request = supertest(app);

const request = require('supertest');
const app = require('./app');
const sqlite3 = require('sqlite3').verbose();

describe('URL Shortener API', () => {
  let db;

  beforeAll(() => {
    // Connect to the SQLite database
    db = new sqlite3.Database('urls.db');
  });

  afterAll(() => {
    // Close the SQLite database connection
    db.close();
  });

  beforeEach((done) => {
    // Create the URLs table and insert some sample data
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS urls');
      db.run(`CREATE TABLE urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT NOT NULL
      )`);
      db.run("INSERT INTO urls (name, url) VALUES (?, ?)", ['Example 1', 'https://example.com']);
      db.run("INSERT INTO urls (name, url) VALUES (?, ?)", ['Example 2', 'https://example.org']);
      done();
    });
  });

  describe('GET /urls', () => {
    it('should return a list of URLs', async () => {
      const response = await request(app).get('/urls');
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
    });

    it('should support pagination', async () => {
      const response = await request(app).get('/urls?page=0&size=1');
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);
      expect(response.body.page).toBe(0);
      expect(response.body.size).toBe(1);
    });

    it('should support search', async () => {
      const response = await request(app).get('/urls?search=example');
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(2);
    });
  });

  describe('POST /urls', () => {
    it('should create a new URL', async () => {
      const response = await request(app)
        .post('/urls')
        .send({ name: 'Example 3', url: 'https://example.net' });
      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Example 3');
      expect(response.body.url).toBe('https://example.net');
      expect(response.body.shortUrl).toMatch(/^http:\/\/localhost:3000\/[a-zA-Z0-9]+$/);
    });

    it('should return an error for invalid URL', async () => {
      const response = await request(app)
        .post('/urls')
        .send({ name: 'Invalid URL', url: 'invalid' });
      expect(response.status).toBe(400);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ msg: 'Invalid URL' })
      );
    });
  });

  // Add more tests for other endpoints (GET /urls/:id, PUT /urls/:id, DELETE /urls/:id)
});