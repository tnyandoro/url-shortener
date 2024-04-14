const env = process.env;

env.PORT = 3001;
env.DB_URL = ':memory:';

const server = require('../server');
const request = require('supertest');

beforeEach(() => {
    server.db.run('DELETE FROM urls');
});

module.exports = {
    server,
    request,
    db: server.db,
};