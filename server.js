const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Generate random short code
function generateShortCode() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

app.get('/', (req, res) => {
    res.json({ message: 'URL Shortener API is running!' });
});

app.post('/api/shorten', async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    // Basic URL validation
    if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
        return res.status(400).json({ error: 'URL must start with http:// or https://' });
    }

    try {
        let shortCode;
        let isUnique = false;

        // Keep generating until we get a unique code
        while (!isUnique) {
            shortCode = generateShortCode();
            const existing = await pool.query(
                'SELECT * FROM urls WHERE short_code = $1',
                [shortCode]
            );
            if (existing.rows.length === 0) {
                isUnique = true;
            }
        }

        await pool.query(
            'INSERT INTO urls (original_url, short_code) VALUES ($1, $2)',
            [originalUrl, shortCode]
        );

        res.status(201).json({
            shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
            shortCode: shortCode
        });

    } catch (err) {
        console.error('Error saving URL:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/:code', async (req, res) => {
    const { code } = req.params;

    try {
        const result = await pool.query(
            'SELECT original_url FROM urls WHERE short_code = $1',
            [code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        // Update clicks FIRST
        const updateResult = await pool.query(
            'UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1 RETURNING clicks',
            [code]
        );

        console.log(`Short code ${code} has been clicked ${updateResult.rows[0].clicks} times.`);

        // THEN redirect
        res.redirect(result.rows[0].original_url);

    } catch (err) {
        console.error('Error retrieving URL:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/stats/:shortCode', async (req, res) => {
    const { shortCode } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM urls WHERE short_code = $1',
            [shortCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});