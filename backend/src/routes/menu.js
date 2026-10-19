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
const { MENU_CATEGORY_SEED, ensureDefaultMenuCategories, getCategoryLabel } = require('../models/menuCatalog');

const router = express.Router();

router.get('/categories', (req, res) => {
    const db = getDb();
    ensureDefaultMenuCategories(db);
    const categories = db.prepare(`
        SELECT slug, name, sort_order
        FROM menu_categories
        WHERE is_active = 1
        ORDER BY sort_order ASC, name ASC
    `).all();
    res.json(categories);
});

router.get('/', (req, res) => {
    const db = getDb();
    ensureDefaultMenuCategories(db);
    const items = db.prepare(`
        SELECT m.*, c.name as category_name
        FROM menu_items m
        LEFT JOIN menu_categories c ON c.slug = m.category
        WHERE m.is_active = 1
        ORDER BY c.sort_order, m.name ASC
    `).all();
    res.json(items.map(item => ({
        ...item,
        categoryLabel: getCategoryLabel(item.category),
    })));
});

const VALID_CATEGORIES = MENU_CATEGORY_SEED.map(cat => cat.slug);

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
        ensureDefaultMenuCategories(db);
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

        res.status(201).json({ message: 'Menu item added', id, price: parsedPrice, categoryLabel: getCategoryLabel(category) });
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
        if (req.body.category !== undefined && !VALID_CATEGORIES.includes(req.body.category)) {
            return res.status(400).json({ error: 'Invalid category' });
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
