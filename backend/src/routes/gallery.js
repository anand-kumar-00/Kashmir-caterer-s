/**
 * Gallery routes (public read, admin write)
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
    const items = getDb().prepare('SELECT * FROM gallery_items ORDER BY sort_order, created_at').all();
    res.json(items);
});

router.post('/',
    requireAdmin,
    body('title').trim().notEmpty(),
    body('imageUrl').trim().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const { title, imageUrl, sortOrder = 0 } = req.body;
        const id = 'GAL-' + uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();

        getDb().prepare('INSERT INTO gallery_items (id, title, image_url, sort_order) VALUES (?,?,?,?)')
               .run(id, title.trim(), imageUrl.trim(), Number(sortOrder));

        res.status(201).json({ message: 'Gallery item added', id });
    }
);

router.patch('/:id', requireAdmin, (req, res) => {
    const db = getDb();
    if (!db.prepare('SELECT id FROM gallery_items WHERE id = ?').get(req.params.id)) {
        return res.status(404).json({ error: 'Item not found' });
    }
    const allowed = ['title', 'image_url', 'sort_order'];
    const updates = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' });
    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    db.prepare(`UPDATE gallery_items SET ${setClauses} WHERE id = ?`)
      .run(...Object.values(updates), req.params.id);
    res.json({ message: 'Gallery item updated' });
});

router.delete('/:id', requireAdmin, (req, res) => {
    getDb().prepare('DELETE FROM gallery_items WHERE id = ?').run(req.params.id);
    res.json({ message: 'Gallery item deleted' });
});

module.exports = router;
