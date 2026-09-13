/**
 * Lost & Found routes
 *
 * Public:
 *   POST /api/lost-found            — submit a lost/found report
 *   GET  /api/lost-found/lookup/:refId — public lookup by reference ID
 *
 * Admin:
 *   GET    /api/lost-found           — list all reports
 *   PATCH  /api/lost-found/:id       — update status / notes
 *   DELETE /api/lost-found/:id       — remove report
 */

const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/db');
const { requireAdmin } = require('../middleware/auth');
const { createNotification } = require('../models/notificationHelper');

const router = express.Router();

/* ── Ref ID generator: LF-YYYYMMDD-XXXX ── */
function generateRefId() {
    const d   = new Date();
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    const rnd = uuidv4().replace(/-/g,'').slice(0, 4).toUpperCase();
    return `LF-${ymd}-${rnd}`;
}

/* ── POST /api/lost-found  (public) ── */
router.post('/',
    body('type').isIn(['lost','found']).withMessage('type must be "lost" or "found"'),
    body('itemName').trim().isLength({ min: 2, max: 120 }).withMessage('Item name required (2-120 chars)'),
    body('description').trim().isLength({ min: 5, max: 1000 }).withMessage('Description required (5-1000 chars)'),
    body('location').trim().isLength({ min: 2, max: 200 }).withMessage('Location required'),
    body('contactName').trim().isLength({ min: 2, max: 100 }).withMessage('Contact name required'),
    body('contactPhone').trim().isMobilePhone('any').withMessage('Valid contact phone required'),
    body('contactEmail').optional({ checkFalsy: true }).isEmail().normalizeEmail(),
    body('eventDate').optional({ checkFalsy: true }).isDate(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const {
            type, itemName, description, location,
            contactName, contactPhone, contactEmail = null, eventDate = null,
        } = req.body;

        const db    = getDb();
        const id    = 'LF-' + uuidv4().replace(/-/g,'').slice(0, 12).toUpperCase();
        const refId = generateRefId();

        db.prepare(`
            INSERT INTO lost_found
                (id, ref_id, type, item_name, description, location,
                 event_date, contact_name, contact_phone, contact_email)
            VALUES (?,?,?,?,?,?,?,?,?,?)
        `).run(id, refId, type, itemName.trim(), description.trim(), location.trim(),
               eventDate, contactName.trim(), contactPhone.trim(), contactEmail);

        // Create admin notification
        createNotification(db, 'lost_found_new',
            `New ${type} item report`,
            `"${itemName.trim()}" reported at ${location.trim()} by ${contactName.trim()}`,
            id);

        res.status(201).json({
            message: 'Report submitted successfully',
            refId,
            id,
        });
    }
);

/* ── GET /api/lost-found/lookup/:refId  (public) ── */
router.get('/lookup/:refId',
    param('refId').trim().matches(/^LF-\d{8}-[A-Z0-9]{4}$/).withMessage('Invalid reference ID format'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const item = getDb().prepare(`
            SELECT ref_id, type, item_name, description, location, event_date,
                   contact_name, status, created_at
            FROM lost_found WHERE ref_id = ?
        `).get(req.params.refId);

        if (!item) return res.status(404).json({ error: 'No report found with that reference ID' });

        // Never expose contact_phone/email in public lookup — only admin can see that
        res.json({
            refId:       item.ref_id,
            type:        item.type,
            itemName:    item.item_name,
            description: item.description,
            location:    item.location,
            eventDate:   item.event_date,
            contactName: item.contact_name,
            status:      item.status,
            reportedAt:  item.created_at,
        });
    }
);

/* ── GET /api/lost-found  (admin) ── */
router.get('/', requireAdmin, (req, res) => {
    const { status, type } = req.query;
    let sql = 'SELECT * FROM lost_found WHERE 1=1';
    const params = [];

    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (type)   { sql += ' AND type = ?';   params.push(type); }
    sql += ' ORDER BY created_at DESC';

    res.json(getDb().prepare(sql).all(...params));
});

/* ── PATCH /api/lost-found/:id  (admin) ── */
router.patch('/:id', requireAdmin,
    body('status').optional().isIn(['open','resolved','expired']),
    body('notes').optional().trim().isLength({ max: 1000 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const db   = getDb();
        const item = db.prepare('SELECT id FROM lost_found WHERE id = ?').get(req.params.id);
        if (!item) return res.status(404).json({ error: 'Report not found' });

        const allowed = ['status', 'notes'];
        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }
        if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' });

        updates.updated_at = new Date().toISOString();
        const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        db.prepare(`UPDATE lost_found SET ${setClauses} WHERE id = ?`)
          .run(...Object.values(updates), req.params.id);

        res.json({ message: 'Report updated' });
    }
);

/* ── DELETE /api/lost-found/:id  (admin) ── */
router.delete('/:id', requireAdmin, (req, res) => {
    const db = getDb();
    const item = db.prepare('SELECT id FROM lost_found WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Report not found' });
    db.prepare('DELETE FROM lost_found WHERE id = ?').run(req.params.id);
    res.json({ message: 'Report deleted' });
});

module.exports = router;
