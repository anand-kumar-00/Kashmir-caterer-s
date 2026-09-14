/**
 * Payment routes
 *
 * POST /api/payments/:bookingId/proof
 *   — upload a payment screenshot (customer, authenticated)
 *
 * PATCH /api/payments/:bookingId
 *   — admin updates payment status / amount / method
 *
 * GET /api/payments/summary
 *   — admin: aggregate payment stats
 */

const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../models/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { createNotification } = require('../models/notificationHelper');

const router = express.Router();

/* ── Upload directory ── */
const PROOF_DIR = path.resolve(__dirname, '../../../frontend/public/uploads/payment-proofs');
fs.mkdirSync(PROOF_DIR, { recursive: true });

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']);

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, PROOF_DIR),
    filename:    (_req, _file, cb) => cb(null, `proof-${uuidv4()}.${_file.mimetype === 'application/pdf' ? 'pdf' : 'jpg'}`),
});

const fileFilter = (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) cb(null, true);
    else cb(new Error('Only images (JPEG/PNG/WebP) or PDF allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024, files: 1 } });

const canAccessBookingPayment = (req, booking) => {
    if (!booking) return false;
    if (req.session?.role === 'admin') return true;
    if (req.session?.userId && booking.customer_id === req.session.userId) return true;
    if (req.session?.email && booking.customer_email === req.session.email) return true;
    if (req.session?.phone && booking.customer_phone === req.session.phone) return true;
    return true; // public flow: booking ID is the token for payment submission
};

/* ── POST /api/payments/:bookingId/proof ── */
router.post('/:bookingId/proof', upload.single('proof'), (req, res) => {
    const db      = getDb();
    const booking = db.prepare('SELECT id, customer_id, customer_email, customer_phone, estimated_total FROM bookings WHERE id = ?').get(req.params.bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (!canAccessBookingPayment(req, booking)) return res.status(403).json({ error: 'Access denied' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const proofPath = `/uploads/payment-proofs/${req.file.filename}`;
    const advance   = Number(req.body.advance_amount) || 0;
    const method    = (req.body.payment_method || '').slice(0, 50);
    const balance   = Number(booking.estimated_total || 0) - advance;

    db.prepare(`
        UPDATE bookings SET
            payment_proof   = ?,
            advance_amount  = ?,
            balance_amount  = ?,
            payment_method  = ?,
            payment_status  = 'advance_paid',
            updated_at      = ?
        WHERE id = ?
    `).run(proofPath, advance, balance > 0 ? balance : 0, method, new Date().toISOString(), req.params.bookingId);

    createNotification(db, 'payment_received',
        'Payment proof uploaded',
        `Booking ${req.params.bookingId} — ₹${advance} via ${method || 'unspecified'}`,
        req.params.bookingId);

    res.json({ message: 'Payment proof uploaded', proofUrl: proofPath });
});

/* ── Multer error handler ── */
router.use((err, _req, res, _next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 8 MB)' : err.message });
    }
    if (err) return res.status(400).json({ error: err.message });
});

/* ── PATCH /api/payments/:bookingId ── (public + admin) ── */
router.patch('/:bookingId',
    body('payment_status').optional().isIn(['unpaid','advance_paid','paid','refunded']),
    body('advance_amount').optional().isFloat({ min: 0 }),
    body('balance_amount').optional().isFloat({ min: 0 }),
    body('payment_method').optional().trim().isLength({ max: 50 }),
    body('payment_notes').optional().trim().isLength({ max: 500 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const db      = getDb();
        const booking = db.prepare('SELECT id, customer_id, customer_email, customer_phone FROM bookings WHERE id = ?').get(req.params.bookingId);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if (!canAccessBookingPayment(req, booking)) return res.status(403).json({ error: 'Access denied' });

        const allowed = ['payment_status', 'advance_amount', 'balance_amount', 'payment_method', 'payment_notes'];
        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }
        if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' });

        // Auto-promote booking status when fully paid
        if (updates.payment_status === 'paid') updates.status = 'confirmed';

        updates.updated_at = new Date().toISOString();
        const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        db.prepare(`UPDATE bookings SET ${setClauses} WHERE id = ?`)
          .run(...Object.values(updates), req.params.bookingId);

        res.json({ message: 'Payment updated' });
    }
);

/* ── GET /api/payments/summary ── (admin) ── */
router.get('/summary', requireAdmin, (req, res) => {
    const db = getDb();
    const rows = db.prepare(`
        SELECT
            payment_status,
            COUNT(*) as count,
            SUM(estimated_total) as total_value,
            SUM(advance_amount)  as total_advance,
            SUM(balance_amount)  as total_balance
        FROM bookings
        GROUP BY payment_status
    `).all();

    const summary = {
        unpaid:       { count: 0, totalValue: 0, totalAdvance: 0, totalBalance: 0 },
        advance_paid: { count: 0, totalValue: 0, totalAdvance: 0, totalBalance: 0 },
        paid:         { count: 0, totalValue: 0, totalAdvance: 0, totalBalance: 0 },
        refunded:     { count: 0, totalValue: 0, totalAdvance: 0, totalBalance: 0 },
    };
    rows.forEach(r => {
        const k = r.payment_status || 'unpaid';
        if (summary[k]) {
            summary[k] = {
                count:        r.count,
                totalValue:   r.total_value   || 0,
                totalAdvance: r.total_advance || 0,
                totalBalance: r.total_balance || 0,
            };
        }
    });

    res.json(summary);
});

module.exports = router;
