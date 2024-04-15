const env = process.env;

env.PORT = 3001;
env.DB_URL = ':memory:';

const server = require('../server');
const request = require('supertest');
const { promisify } = require('util');

beforeEach(async () => {
    await server.db.run('DELETE FROM urls');
});

server.db.runAsync = promisify(server.db.run);
server.db.getAsync = promisify(server.db.get);

module.exports = {
    server,
    request,
    db: server.db
};