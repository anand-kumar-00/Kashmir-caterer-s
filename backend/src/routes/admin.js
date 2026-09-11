/**
 * Admin-only routes: employees, expenses, locations, meetings, settings, reports
 */
const express = require('express');
const bcrypt  = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

const SALT_ROUNDS = 12;

/* ──────────────────────────── EMPLOYEES ───────────────────────── */

router.get('/employees', (req, res) => {
    const employees = getDb().prepare(`
        SELECT id, employee_code, name, email, role, job_role,
               daily_rate, days_worked, advance_paid, is_active, created_at
        FROM users WHERE role IN ('employee','admin') ORDER BY created_at
    `).all();
    res.json(employees);
});

router.post('/employees',
    body('name').trim().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('employeeCode').trim().notEmpty(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['employee', 'admin']),
    body('jobRole').isIn(['manager', 'cook', 'waiter', 'co-helper', 'accountant', 'staff']),
    body('dailyRate').isFloat({ min: 0 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const { name, email, employeeCode, password, role, jobRole, dailyRate } = req.body;
        const db = getDb();

        if (db.prepare('SELECT id FROM users WHERE email = ? OR employee_code = ?').get(email, employeeCode.toUpperCase())) {
            return res.status(409).json({ error: 'Employee ID or email already exists' });
        }

        const id = 'EMP-' + uuidv4().replace(/-/g, '').slice(0, 10).toUpperCase();
        const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

        db.prepare(`
            INSERT INTO users (id, employee_code, name, email, password_hash, role, job_role, daily_rate)
            VALUES (?,?,?,?,?,?,?,?)
        `).run(id, employeeCode.toUpperCase(), name.trim(), email, passwordHash, role, jobRole, Number(dailyRate));

        res.status(201).json({ message: 'Employee added', id });
    }
);

router.patch('/employees/:id', (req, res) => {
    const db = getDb();
    const emp = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    const allowed = ['name', 'email', 'employee_code', 'job_role', 'daily_rate', 'days_worked', 'advance_paid', 'is_active'];
    const updates = {};
    for (const key of allowed) {
        const camel = key.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
        if (req.body[key] !== undefined) updates[key] = req.body[key];
        else if (req.body[camel] !== undefined) updates[key] = req.body[camel];
    }

    if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' });
    updates.updated_at = new Date().toISOString();
    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    db.prepare(`UPDATE users SET ${setClauses} WHERE id = ?`).run(...Object.values(updates), req.params.id);
    res.json({ message: 'Employee updated' });
});

/* ──────────────────────────── EXPENSES ────────────────────────── */

router.get('/expenses', (req, res) => {
    res.json(getDb().prepare('SELECT * FROM expenses ORDER BY date DESC').all());
});

router.post('/expenses',
    body('date').isDate(),
    body('category').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('amount').isFloat({ min: 0 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const { date, category, description, amount } = req.body;
        const id = 'EXP-' + uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
        getDb().prepare('INSERT INTO expenses (id, date, category, description, amount) VALUES (?,?,?,?,?)')
               .run(id, date, category.trim(), description.trim(), Number(amount));
        res.status(201).json({ message: 'Expense recorded', id });
    }
);

router.delete('/expenses/:id', (req, res) => {
    getDb().prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
    res.json({ message: 'Expense deleted' });
});

/* ──────────────────────────── LOCATIONS ───────────────────────── */

router.get('/locations', (req, res) => {
    res.json(getDb().prepare('SELECT * FROM locations ORDER BY created_at').all());
});

router.post('/locations', (req, res) => {
    const { name, type = 'event', address, fullAddress, lat, lng } = req.body;
    if (!name || !address) return res.status(400).json({ error: 'Name and address are required' });
    const id = 'LOC-' + uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
    getDb().prepare('INSERT INTO locations (id, name, type, address, full_address, lat, lng) VALUES (?,?,?,?,?,?,?)')
           .run(id, name.trim(), type, address.trim(), (fullAddress || address).trim(), Number(lat) || null, Number(lng) || null);
    res.status(201).json({ message: 'Location added', id });
});

router.patch('/locations/:id', (req, res) => {
    const db = getDb();
    if (!db.prepare('SELECT id FROM locations WHERE id = ?').get(req.params.id)) {
        return res.status(404).json({ error: 'Location not found' });
    }
    const allowed = ['name', 'type', 'address', 'full_address', 'lat', 'lng'];
    const updates = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (!Object.keys(updates).length) return res.status(400).json({ error: 'Nothing to update' });
    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    db.prepare(`UPDATE locations SET ${setClauses} WHERE id = ?`).run(...Object.values(updates), req.params.id);
    res.json({ message: 'Location updated' });
});

router.delete('/locations/:id', (req, res) => {
    getDb().prepare('DELETE FROM locations WHERE id = ?').run(req.params.id);
    res.json({ message: 'Location deleted' });
});

/* ──────────────────────────── MEETINGS ────────────────────────── */

router.get('/meetings', (req, res) => {
    res.json(getDb().prepare('SELECT * FROM meetings ORDER BY date_time DESC').all());
});

router.post('/meetings', (req, res) => {
    const { customerName, dateTime, type, zoomLink = '', notes = '' } = req.body;
    if (!customerName || !dateTime || !type) {
        return res.status(400).json({ error: 'customerName, dateTime and type are required' });
    }
    const id = 'MTG-' + uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
    getDb().prepare('INSERT INTO meetings (id, customer_name, date_time, type, zoom_link, notes) VALUES (?,?,?,?,?,?)')
           .run(id, customerName.trim(), dateTime, type.trim(), zoomLink.trim(), notes.trim());
    res.status(201).json({ message: 'Meeting scheduled', id });
});

router.delete('/meetings/:id', (req, res) => {
    getDb().prepare('DELETE FROM meetings WHERE id = ?').run(req.params.id);
    res.json({ message: 'Meeting deleted' });
});

/* ──────────────────────────── SETTINGS ────────────────────────── */

router.get('/settings', (req, res) => {
    const rows = getDb().prepare('SELECT key, value FROM settings').all();
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json(settings);
});

router.patch('/settings', (req, res) => {
    const db = getDb();
    const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)');
    const now = new Date().toISOString();
    for (const [key, value] of Object.entries(req.body)) {
        upsert.run(key, String(value), now);
    }
    res.json({ message: 'Settings updated' });
});

/* ──────────────────────────── REPORTS ─────────────────────────── */

router.get('/reports', (req, res) => {
    const db = getDb();
    const bookings  = db.prepare('SELECT * FROM bookings').all();
    const expenses  = db.prepare('SELECT * FROM expenses').all();
    const employees = db.prepare('SELECT daily_rate, days_worked, advance_paid FROM users WHERE role IN (?,?)').all('employee', 'admin');

    const totalIncome    = bookings.reduce((s, b) => s + Number(b.estimated_total || 0), 0);
    const totalExpenses  = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    const totalSalary    = employees.reduce((s, e) => s + (Number(e.daily_rate) * Number(e.days_worked)), 0);
    const netProfit      = totalIncome - totalExpenses - totalSalary;

    res.json({
        totalBookings:      bookings.length,
        confirmedBookings:  bookings.filter(b => b.status === 'confirmed').length,
        cancelledBookings:  bookings.filter(b => b.status === 'cancelled').length,
        pendingPayments:    bookings.filter(b => b.status === 'pending_payment').length,
        totalIncome,
        totalExpenses,
        totalSalary,
        netProfit,
    });
});

module.exports = router;
