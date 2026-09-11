/**
 * Bookings routes
 * POST /api/bookings           — submit booking (public)
 * GET  /api/bookings           — list all bookings (admin only)
 * GET  /api/bookings/:id       — single booking (owner or admin)
 * PATCH /api/bookings/:id      — update status/details (admin only)
 * DELETE /api/bookings/:id     — cancel booking (admin only)
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ── POST /api/bookings ──────────────────────────────────────────
router.post('/',
    body('customerName').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('customerEmail').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('customerPhone').trim().notEmpty().withMessage('Phone number is required'),
    body('functionType').trim().notEmpty().withMessage('Function type is required'),
    body('eventDate').isDate().withMessage('Valid event date required'),
    body('guestCount').isInt({ min: 1 }).withMessage('Guest count must be at least 1'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const {
            customerName, customerEmail, customerPhone,
            functionType, eventDate, guestCount,
            menuItems = [], requirements = '',
        } = req.body;

        const db = getDb();

        // Calculate estimated total from menu items
        const menuItemIds = Array.isArray(menuItems) ? menuItems : [];
        let estimatedTotal = 10000; // base fee
        if (menuItemIds.length > 0) {
            const placeholders = menuItemIds.map(() => '?').join(',');
            const items = db.prepare(
                `SELECT price FROM menu_items WHERE id IN (${placeholders})`
            ).all(...menuItemIds);
            estimatedTotal += items.reduce((sum, item) => sum + Number(item.price || 0), 0);
        }

        const id = 'BK-' + uuidv4().replace(/-/g, '').slice(0, 10).toUpperCase();
        const customerId = req.session?.userId || null;

        db.prepare(`
            INSERT INTO bookings
                (id, customer_id, customer_name, customer_email, customer_phone,
                 function_type, event_date, guest_count, menu_items,
                 requirements, estimated_total, status)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,'pending_payment')
        `).run(
            id, customerId, customerName, customerEmail, customerPhone,
            functionType, eventDate, Number(guestCount),
            JSON.stringify(menuItemIds), requirements, estimatedTotal
        );

        res.status(201).json({
            message: 'Booking submitted successfully',
            bookingId: id,
            estimatedTotal,
        });
    }
);

// ── GET /api/bookings ───────────────────────────────────────────
router.get('/', requireAdmin, (req, res) => {
    const db = getDb();
    const { status, date } = req.query;

    let sql = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];

    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (date)   { sql += ' AND event_date = ?'; params.push(date); }
    sql += ' ORDER BY created_at DESC';

    const bookings = db.prepare(sql).all(...params).map(parseBooking);
    res.json(bookings);
});

// ── GET /api/bookings/:id ───────────────────────────────────────
router.get('/:id', requireAuth, (req, res) => {
    const db = getDb();
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const isOwner = booking.customer_id === req.session.userId ||
                    booking.customer_email === req.session.email;
    const isStaff = ['employee', 'admin'].includes(req.session.role);

    if (!isOwner && !isStaff) {
        return res.status(403).json({ error: 'Access denied' });
    }

    res.json(parseBooking(booking));
});

// ── PATCH /api/bookings/:id ─────────────────────────────────────
router.patch('/:id', requireAdmin, (req, res) => {
    const db = getDb();
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const allowed = ['status', 'customer_name', 'event_date', 'requirements', 'estimated_total', 'guest_count'];
    const updates = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.updated_at = new Date().toISOString();
    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    db.prepare(`UPDATE bookings SET ${setClauses} WHERE id = ?`)
      .run(...Object.values(updates), req.params.id);

    res.json({ message: 'Booking updated', bookingId: req.params.id });
});

// ── DELETE /api/bookings/:id ────────────────────────────────────
router.delete('/:id', requireAdmin, (req, res) => {
    const db = getDb();
    db.prepare("UPDATE bookings SET status='cancelled', updated_at=? WHERE id=?")
      .run(new Date().toISOString(), req.params.id);
    res.json({ message: 'Booking cancelled' });
});

// ── helper ──────────────────────────────────────────────────────
function parseBooking(b) {
    return {
        ...b,
        menuItems: JSON.parse(b.menu_items || '[]'),
        customerName:   b.customer_name,
        customerEmail:  b.customer_email,
        customerPhone:  b.customer_phone,
        functionType:   b.function_type,
        eventDate:      b.event_date,
        guestCount:     b.guest_count,
        estimatedTotal: b.estimated_total,
        createdAt:      b.created_at,
        updatedAt:      b.updated_at,
    };
}

module.exports = router;
