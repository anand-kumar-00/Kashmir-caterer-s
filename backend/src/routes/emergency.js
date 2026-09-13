/**
 * Emergency Contacts routes
 *
 * Public:
 *   GET /api/emergency              — list active contacts (no sensitive internal notes)
 *
 * Admin:
 *   GET    /api/emergency/all       — list all (including inactive)
 *   POST   /api/emergency           — add contact
 *   PATCH  /api/emergency/:id       — update contact
 *   DELETE /api/emergency/:id       — remove contact
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const VALID_CATEGORIES = ['staff','medical','fire','police','utility','other'];

/* ── GET /api/emergency  (public — active contacts only) ── */
router.get('/', (req, res) => {
    const contacts = getDb().prepare(`
        SELECT id, name, role, phone, phone_alt, category, sort_order
        FROM emergency_contacts
        WHERE is_active = 1
        ORDER BY sort_order, category, name
    `).all();
    res.json(contacts);
});

/* ── GET /api/emergency/all  (admin) ── */
router.get('/all', requireAdmin, (req, res) => {
    res.json(getDb().prepare('SELECT * FROM emergency_contacts ORDER BY sort_order, category, name').all());
});

/* ── POST /api/emergency  (admin) ── */
router.post('/', requireAdmin,
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name required'),
    body('role').trim().isLength({ min: 2, max: 100 }).withMessage('Role required'),
    body('phone').trim().notEmpty().withMessage('Phone required'),
    body('category').isIn(VALID_CATEGORIES).withMessage('Invalid category'),
    body('sortOrder').optional().isInt({ min: 0 }),
    body('phoneAlt').optional({ checkFalsy: true }).trim(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const { name, role, phone, category, phoneAlt = '', sortOrder = 0 } = req.body;
        const id = 'EC-' + uuidv4().replace(/-/g,'').slice(0, 10).toUpperCase();

        getDb().prepare(`
            INSERT INTO emergency_contacts (id, name, role, phone, phone_alt, category, sort_order)
            VALUES (?,?,?,?,?,?,?)
        `).run(id, name.trim(), role.trim(), phone.trim(), phoneAlt.trim(), category, Number(sortOrder));

        res.status(201).json({ message: 'Emergency contact added', id });
    }
);

/* ── PATCH /api/emergency/:id  (admin) ── */
router.patch('/:id', requireAdmin,
    body('category').optional().isIn(VALID_CATEGORIES),
    body('is_active').optional().isBoolean(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const db = getDb();
        const ec = db.prepare('SELECT id FROM emergency_contacts WHERE id = ?').get(req.params.id);
        if (!ec) return res.status(404).json({ error: 'Contact not found' });

        const allowed = ['name', 'role', 'phone', 'phone_alt', 'category', 'is_active', 'sort_order'];
        const updates = {};
        for (const key of allowed) {
            const camel = key.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
            if (req.body[key] !== undefined) updates[key] = req.body[key];
            else if (req.body[camel] !== undefined) updates[key] = req.body[camel];
        }
        if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' });

        const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        db.prepare(`UPDATE emergency_contacts SET ${setClauses} WHERE id = ?`)
          .run(...Object.values(updates), req.params.id);

        res.json({ message: 'Contact updated' });
    }
);

/* ── DELETE /api/emergency/:id  (admin) ── */
router.delete('/:id', requireAdmin, (req, res) => {
    const db = getDb();
    if (!db.prepare('SELECT id FROM emergency_contacts WHERE id = ?').get(req.params.id)) {
        return res.status(404).json({ error: 'Contact not found' });
    }
    db.prepare('DELETE FROM emergency_contacts WHERE id = ?').run(req.params.id);
    res.json({ message: 'Contact deleted' });
});

module.exports = router;
