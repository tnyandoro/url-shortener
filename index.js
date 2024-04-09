const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const base62 = require('base62/lib/ascii');
const sqlite3 = require('sqlite3').verbose();
const validUrl = require('valid-url').isWebUri;
const { body, param, validationResult } = require('express-validator');

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Step 1: Connect to SQLite database file
const db = new sqlite3.Database('urls.db');

// Step 2: Create URLs table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT NOT NULL
    )`);
    db.run(`INSERT INTO sqlite_sequence (name, seq) VALUES ('urls', 9999)`); // Set autoincrement starting value
});

// Validation middleware
const validateUrl = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Step 3: Implement the CRUD operations

// Create a new URL
app.post(
    '/urls',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('url').notEmpty().withMessage('URL is required').custom(url => {
            if (!validUrl(url)) {
                throw new Error('Invalid URL');
            }
            return true;
        })
    ],
    validateUrl,
    (req, res) => {
        const { name, url } = req.body;
        db.run('INSERT INTO urls (name, url) VALUES (?, ?)', [name, url], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const shortUrl = `${BASE_URL}/${base62.encode(this.lastID)}`;
            res.status(201).json({ id: this.lastID, name, url, shortUrl });
        });
    }
);

// Read a URL by ID
app.get('/urls/:id', [
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
        const shortUrl = `${BASE_URL}/${base62.encode(row.id)}`;
        res.json({ ...row, shortUrl });
    });
});

// Update a URL by ID
app.put(
    '/urls/:id',
    [
        param('id').isInt().withMessage('ID must be an integer'),
        body('name').optional().notEmpty().withMessage('Name is required'),
        body('url').optional().notEmpty().withMessage('URL is required').custom(url => {
            if (!validUrl(url)) {
                throw new Error('Invalid URL');
            }
            return true;
        })
    ],
    validateUrl,
    (req, res) => {
        const { id } = req.params;
        const { name, url } = req.body;
        db.run('UPDATE urls SET name = ?, url = ? WHERE id = ?', [name, url, id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const shortUrl = `${BASE_URL}/${base62.encode(id)}`;
            res.json({ id, name, url, shortUrl });
        });
    }
);

// Delete a URL by ID
app.delete('/urls/:id', [
    param('id').isInt().withMessage('ID must be an integer')
], validateUrl, (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM urls WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.sendStatus(204);
    });
});

// Get all URLs with optional pagination and search query parameters
app.get('/urls', (req, res) => {
    const { page = 0, size = 10, search } = req.query;
    let sql = 'SELECT * FROM urls';
    let params = [];

    // Add search condition
    if (search) {
        sql += ' WHERE name LIKE ? OR url LIKE ?';
        params.push(`%${search}%`);
        params.push(`%${search}%`);
    }

    // Add pagination
    const offset = page * size;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(size);
    params.push(offset);

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Redirect based on base62 encoded ID
app.get('/:encodedId', (req, res) => {
    const encodedId = req.params.encodedId;
    const id = base62.decode(encodedId);
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
