/**
 * Menu routes
 * GET    /api/menu              — list all active items (public)
 * POST   /api/menu              — add item (admin)
 * PATCH  /api/menu/:id          — edit item (admin)
 * DELETE /api/menu/:id          — delete item (admin)
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
    const db = getDb();
    const items = db.prepare('SELECT * FROM menu_items WHERE is_active = 1 ORDER BY category, type').all();
    res.json(items);
});

router.post('/',
    requireAdmin,
    body('name').trim().notEmpty(),
    body('category').isIn(['breakfast', 'lunch', 'dinner']),
    body('type').isIn(['snacks', 'main']),
    body('price').isFloat({ min: 0 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const { name, category, type, price, description = '' } = req.body;
        const id = 'ITEM-' + uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
        const db = getDb();

        db.prepare(`
            INSERT INTO menu_items (id, name, category, type, price, description)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(id, name.trim(), category, type, Number(price), description.trim());

        res.status(201).json({ message: 'Menu item added', id });
    }
);

router.patch('/:id', requireAdmin,
    body('price').optional().isFloat({ min: 0 }),
    (req, res) => {
        const db = getDb();
        const item = db.prepare('SELECT id FROM menu_items WHERE id = ?').get(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const allowed = ['name', 'category', 'type', 'price', 'description', 'is_active'];
        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }
        if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'Nothing to update' });

        updates.updated_at = new Date().toISOString();
        const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        db.prepare(`UPDATE menu_items SET ${setClauses} WHERE id = ?`)
          .run(...Object.values(updates), req.params.id);

        res.json({ message: 'Menu item updated' });
    }
);

router.delete('/:id', requireAdmin, (req, res) => {
    const db = getDb();
    db.prepare('UPDATE menu_items SET is_active = 0, updated_at = ? WHERE id = ?')
      .run(new Date().toISOString(), req.params.id);
    res.json({ message: 'Menu item removed' });
});

module.exports = router;
