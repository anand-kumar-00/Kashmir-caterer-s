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

const VALID_CATEGORIES = [
    'cold-beverages','shakes-smoothies','hot-beverages','soup-veg','soup-nonveg',
    'appetizers-veg','appetizers-nonveg','main-course-veg','main-course-nonveg',
    'main-course-hightea','rice-pulao','assorted-bread','salad-raita','raita',
    'live-counters','live-counters-nonveg','dessert','fruit-counter','specialty-counters',
    'arrival-drinks','buffet-nonveg','soft-drink','wazwan-nonveg','wazwan-veg','wazwan-sweet',
];

router.post('/',
    requireAdmin,
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').isIn(VALID_CATEGORIES).withMessage('Invalid category'),
    body('type').isIn(['veg','non-veg','mixed']).withMessage('Type must be veg, non-veg, or mixed'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const { name, category, type, price, rate = '', note = '', description = '' } = req.body;
        const parsedPrice = Number(price ?? rate ?? 0);
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({ error: 'Valid price is required' });
        }

        const id = 'ITEM-' + uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
        const db = getDb();
        const cleanDescription = [
            description,
            parsedPrice > 0 ? `Price: ₹${parsedPrice}` : '',
            rate && price === undefined ? `Rate: ${rate}` : '',
            note,
        ].filter(Boolean).join(' | ');

        db.prepare(`
            INSERT INTO menu_items (id, name, category, type, price, description)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(id, name.trim(), category, type, parsedPrice, cleanDescription);

        res.status(201).json({ message: 'Menu item added', id, price: parsedPrice });
    }
);

router.patch('/:id', requireAdmin,
    body('price').optional().custom((value) => {
        if (value === undefined || value === null || value === '') return true;
        const num = Number(value);
        if (!Number.isFinite(num) || num < 0) throw new Error('Price must be a valid non-negative number');
        return true;
    }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const db = getDb();
        const item = db.prepare('SELECT id FROM menu_items WHERE id = ?').get(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const allowed = ['name', 'category', 'type', 'description', 'is_active'];
        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }
        if (req.body.price !== undefined || req.body.rate !== undefined) {
            const parsedPrice = Number(req.body.price ?? req.body.rate ?? 0);
            if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
                return res.status(400).json({ error: 'Price must be a valid non-negative number' });
            }
            updates.price = parsedPrice;
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
