/**
 * Kashmir Caterers — Express Server
 * Serves the frontend as static files and exposes /api/* endpoints.
 */

require('dotenv').config();

const path    = require('path');
const express = require('express');
const session = require('express-session');
const helmet  = require('helmet');
const cors    = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes    = require('./src/routes/auth');
const bookingRoutes = require('./src/routes/bookings');
const menuRoutes    = require('./src/routes/menu');
const galleryRoutes = require('./src/routes/gallery');
const reviewRoutes  = require('./src/routes/reviews');
const adminRoutes   = require('./src/routes/admin');

const app  = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_DIR = path.resolve(__dirname, '../frontend');

// ── Security headers ────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc:  ["'self'", "'unsafe-inline'", 'https://maps.googleapis.com'],
            styleSrc:   ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc:    ["'self'", 'https://fonts.gstatic.com'],
            imgSrc:     ["'self'", 'data:', 'https:', 'https://maps.gstatic.com', 'https://maps.googleapis.com'],
            connectSrc: ["'self'"],
            frameSrc:   ["'none'"],
        },
    },
}));

// ── CORS ─────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.SITE_URL || false
        : true,
    credentials: true,
}));

// ── Rate limiting ────────────────────────────────────────────────
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// ── Body parsing ─────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// ── Session ──────────────────────────────────────────────────────
app.use(session({
    secret: process.env.SESSION_SECRET || 'change-me-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure:   process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge:   24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
    },
}));

// ── API routes ───────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/menu',     menuRoutes);
app.use('/api/gallery',  galleryRoutes);
app.use('/api/reviews',  reviewRoutes);
app.use('/api/admin',    adminRoutes);

// ── Serve frontend static files ──────────────────────────────────
app.use(express.static(path.join(FRONTEND_DIR, 'public')));
app.use('/styles',  express.static(path.join(FRONTEND_DIR, 'src/styles')));
app.use('/scripts', express.static(path.join(FRONTEND_DIR, 'src/scripts')));
app.use('/images',  express.static(path.join(FRONTEND_DIR, 'src/assets/images')));

// Admin dashboard static page
app.use('/admin', express.static(path.join(FRONTEND_DIR, 'admin')));

// ── SPA fallback ─────────────────────────────────────────────────
app.get('/admin*', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'admin', 'dashboard.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'public', 'index.html'));
});

// ── Global error handler ─────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
    console.error('[Error]', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// ── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🍽  Kashmir Caterers backend running at http://localhost:${PORT}`);
    console.log(`   API docs: http://localhost:${PORT}/api/\n`);
});

module.exports = app;
