/**
 * Auth routes — POST /api/auth/signup, /login, /logout, GET /api/auth/me
 */

const express = require('express');
const bcrypt  = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 12;

// ── POST /api/auth/signup ────────────────────────────────────────
router.post('/signup',
    body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { name, email, password } = req.body;
        const db = getDb();

        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
        const id = 'USR-' + uuidv4().replace(/-/g, '').slice(0, 12).toUpperCase();

        db.prepare(`
            INSERT INTO users (id, name, email, password_hash, role)
            VALUES (?, ?, ?, ?, 'customer')
        `).run(id, name, email, passwordHash);

        req.session.userId   = id;
        req.session.role     = 'customer';
        req.session.userName = name;

        res.status(201).json({
            message: 'Account created',
            user: { id, name, email, role: 'customer' },
        });
    }
);

// ── POST /api/auth/login ─────────────────────────────────────────
router.post('/login',
    body('identifier').trim().notEmpty().withMessage('Email or employee ID is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { identifier, password } = req.body;
        const db = getDb();

        const normalizedId = identifier.toLowerCase();
        const user = db.prepare(`
            SELECT * FROM users
            WHERE lower(email) = ? OR lower(employee_code) = ?
        `).get(normalizedId, normalizedId);

        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            return res.status(401).json({ error: 'Invalid login details' });
        }

        if (!user.is_active) {
            return res.status(403).json({ error: 'Account is deactivated' });
        }

        req.session.userId       = user.id;
        req.session.role         = user.role;
        req.session.userName     = user.name;
        req.session.employeeCode = user.employee_code;

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                employeeCode: user.employee_code,
                name: user.name,
                email: user.email,
                role: user.role,
                jobRole: user.job_role,
            },
        });
    }
);

// ── POST /api/auth/logout ────────────────────────────────────────
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged out' });
    });
});

// ── GET /api/auth/me ─────────────────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
    const db = getDb();
    const user = db.prepare(
        'SELECT id, employee_code, name, email, role, job_role FROM users WHERE id = ?'
    ).get(req.session.userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
        id: user.id,
        employeeCode: user.employee_code,
        name: user.name,
        email: user.email,
        role: user.role,
        jobRole: user.job_role,
    });
});

module.exports = router;
