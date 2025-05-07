const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust the path as necessary

// GET ALL USERS
router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

module.exports = router;