/**
 * Notifications routes (admin-only)
 *
 * GET   /api/notifications          — list recent (limit 50)
 * GET   /api/notifications/unread   — count of unread
 * PATCH /api/notifications/mark-all-read
 * PATCH /api/notifications/:id/read
 * DELETE /api/notifications/:id
 */

const express = require('express');
const { getDb } = require('../models/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

/* ── GET /api/notifications ── */
router.get('/', (req, res) => {
    const items = getDb().prepare(
        'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50'
    ).all();
    res.json(items);
});

/* ── GET /api/notifications/unread ── */
router.get('/unread', (req, res) => {
    const { count } = getDb().prepare(
        'SELECT COUNT(*) AS count FROM notifications WHERE is_read = 0'
    ).get();
    res.json({ count });
});

/* ── PATCH /api/notifications/mark-all-read ── */
router.patch('/mark-all-read', (req, res) => {
    getDb().prepare('UPDATE notifications SET is_read = 1').run();
    res.json({ message: 'All notifications marked as read' });
});

/* ── PATCH /api/notifications/:id/read ── */
router.patch('/:id/read', (req, res) => {
    const db   = getDb();
    const item = db.prepare('SELECT id FROM notifications WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Notification not found' });
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);
    res.json({ message: 'Notification read' });
});

/* ── DELETE /api/notifications/:id ── */
router.delete('/:id', (req, res) => {
    getDb().prepare('DELETE FROM notifications WHERE id = ?').run(req.params.id);
    res.json({ message: 'Notification deleted' });
});

module.exports = router;
