/**
 * Reviews / Feedback routes (public read/write, admin moderation)
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
    const reviews = getDb()
        .prepare('SELECT id, name, event_type, rating, review, verified, helpful, created_at FROM reviews ORDER BY created_at DESC')
        .all();
    res.json(reviews);
});

router.post('/',
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
    body('review').trim().isLength({ min: 10 }).withMessage('Review must be at least 10 characters'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const { name, email, rating, review, eventType = null, verified = false } = req.body;
        const id = 'REV-' + uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();

        getDb().prepare(`
            INSERT INTO reviews (id, name, email, event_type, rating, review, verified)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(id, name.trim(), email, eventType, Number(rating), review.trim(), verified ? 1 : 0);

        res.status(201).json({ message: 'Review submitted', id });
    }
);

router.delete('/:id', requireAdmin, (req, res) => {
    getDb().prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
    res.json({ message: 'Review deleted' });
});

module.exports = router;
