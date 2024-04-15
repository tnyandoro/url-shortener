const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const base62 = require('base62/lib/ascii');
const sqlite3 = require('sqlite3').verbose();
const validUrl = require('valid-url').isWebUri;
const { body, param, validationResult } = require('express-validator');

// initialize ui and api

const server = express();

server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, 'ui')));

server.port = process.env.PORT || 3000;
server.dbUrl = process.env.DB_URL || 'app.db';
server.baseUrl = process.env.BASE_URL || `http://localhost:${server.port}`;

// initialize database

const db = new sqlite3.Database(server.dbUrl);
server.db = db;

db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT NOT NULL
    )`);

    db.run(`INSERT INTO sqlite_sequence (name, seq) VALUES ('urls', 9999)`);

});

// middleware

const validateUrl = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();

};

// add URL

server.post('/urls', [

    body('name').notEmpty().withMessage('Name is required'),

    body('url').notEmpty().withMessage('URL is required').custom(url => {
        if (url && !validUrl(url)) {
            throw new Error('Invalid URL');
        }
        return true;
    })

], validateUrl, (req, res) => {

    const { name, url } = req.body;

    db.run('INSERT INTO urls (name, url) VALUES (?, ?)', [name, url], err => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const shortUrl = `${server.baseUrl}/${base62.encode(this.lastID)}`;

        res.status(201).json({ name, url, shortUrl });

    });

});

// get URL

server.get('/urls/:id', [

    param('id').isInt().withMessage('ID must be an integer')

], validateUrl, (req, res) => {

    const { id } = req.params;

    db.get('SELECT * FROM urls WHERE id = ?', [id], (err, row) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ error: 'URL not found' });
        }

        const shortUrl = `${server.baseUrl}/${base62.encode(row.id)}`;

        res.json({ ...row, shortUrl });

    });

});

// update URL

server.put('/urls/:id', [

    param('id').isInt().withMessage('ID must be an integer'),

    body('name').optional().notEmpty().withMessage('Name is required'),

    body('url').optional().notEmpty().withMessage('URL is required').custom(url => {
        if (url && !validUrl(url)) {
            throw new Error('Invalid URL');
        }
        return true;
    })

], validateUrl, (req, res) => {

    const { id } = req.params;
    const { name, url } = req.body;

    db.run('UPDATE urls SET name = ?, url = ? WHERE id = ?', [name, url, id], err => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const shortUrl = `${server.baseUrl}/${base62.encode(id)}`;

        res.json({ id, name, url, shortUrl });

    });

});

// delete URL

server.delete('/urls/:id', [

    param('id').isInt().withMessage('ID must be an integer')

], validateUrl, (req, res) => {

    const { id } = req.params;

    db.run('DELETE FROM urls WHERE id = ?', [id], err => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.sendStatus(204);

    });

});

// list URLs

server.get('/urls', (req, res) => {

    const params = [];
    let sql = 'SELECT * FROM urls';
    const { page = 0, size = 5, search = '' } = req.query;

    if (search) {
        sql += ' WHERE name LIKE ? OR url LIKE ?';
        params.push(`%${search}%`);
        params.push(`%${search}%`);
    }

    const selectCountSql = sql.replace('SELECT *', 'SELECT COUNT(*) AS count');

    db.get(selectCountSql, params, (countErr, countRow) => {

        if (countErr) {
            return res.status(500).json({ error: countErr.message });
        }

        const offset = page * size;
        const selectAllSql = `${sql} ORDER BY name LIMIT ? OFFSET ?`;

        params.push(size);
        params.push(offset);

        db.all(selectAllSql, params, (allErr, allRows) => {

            if (allErr) {
                return res.status(500).json({ error: allErr.message });
            }

            res.json({
                items: allRows.map(row => {
                    row.shortUrl = `${server.baseUrl}/${base62.encode(row.id)}`;
                    return row;
                }),
                page: page,
                size: size,
                count: countRow.count
            });

        });

    });

});

// redirect from short URL to actual URL

server.get('/:shortUrl', (req, res) => {

    const shortUrl = req.params.shortUrl;
    const id = base62.decode(shortUrl);

    db.get('SELECT * FROM urls WHERE id = ?', [id], (err, row) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.redirect(row.url);

    });

});

module.exports = server;