/**
 * Kashmir Caterers — Express Server
 * Serves the frontend as static files and exposes /api/* endpoints.
 *
 * Start-up order:
 *   1. Validate required environment variables (fail fast)
 *   2. Apply security middleware (helmet, CORS, rate limiting)
 *   3. Session
 *   4. API routes
 *   5. Static files (uploads, frontend)
 *   6. SPA fallback
 */

require('dotenv').config();

/* ── Environment validation — fail fast if critical vars missing ── */
const REQUIRED_ENV = ['SESSION_SECRET'];
const missingEnv = REQUIRED_ENV.filter(k => !process.env[k] || process.env[k] === 'change-me-in-production');
if (missingEnv.length > 0 && process.env.NODE_ENV === 'production') {
    console.error('[Startup] Missing required environment variables:', missingEnv.join(', '));
    console.error('[Startup] Set them in your .env file. See .env.example for reference.');
    process.exit(1);
}
if (missingEnv.length > 0) {
    console.warn('[Startup] WARNING: Using insecure default for:', missingEnv.join(', '),
        '— this is fine for development but MUST be changed for production.');
}

const path    = require('path');
const express = require('express');
const session = require('express-session');
const helmet  = require('helmet');
const cors    = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes         = require('./src/routes/auth');
const bookingRoutes      = require('./src/routes/bookings');
const menuRoutes         = require('./src/routes/menu');
const galleryRoutes      = require('./src/routes/gallery');
const reviewRoutes       = require('./src/routes/reviews');
const adminRoutes        = require('./src/routes/admin');
const chatRoutes         = require('./src/routes/chat');
const lostFoundRoutes    = require('./src/routes/lostFound');
const emergencyRoutes    = require('./src/routes/emergency');
const notificationRoutes = require('./src/routes/notifications');
const uploadRoutes       = require('./src/routes/upload');
const paymentRoutes      = require('./src/routes/payments');

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
            imgSrc:     ["'self'", 'data:', 'blob:', 'https:',
                         'https://maps.gstatic.com', 'https://maps.googleapis.com'],
            connectSrc: ["'self'"],
            frameSrc:   ["'none'"],
            mediaSrc:   ["'self'", 'blob:'],     // allow webcam stream blobs
        },
    },
    // Prevent this page from being embedded in an iframe
    frameguard: { action: 'deny' },
    // Disable X-Powered-By: Express header
    hidePoweredBy: true,
}));

// ── CORS ─────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.SITE_URL || false
        : true,
    credentials: true,
}));

// ── Rate limiting ────────────────────────────────────────────────
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Try again in 15 minutes.' },
});
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/upload', uploadLimiter);

// ── Body parsing ─────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// ── Session ──────────────────────────────────────────────────────
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-insecure-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure:   process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge:   24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
    },
    // Known risk: sessions stored in memory — they reset on server restart.
    // For production, replace with a persistent store (e.g. better-sqlite3-session-store).
}));

// ── API routes ───────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/bookings',      bookingRoutes);
app.use('/api/menu',          menuRoutes);
app.use('/api/gallery',       galleryRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/chat',          chatRoutes);
app.use('/api/lost-found',    lostFoundRoutes);
app.use('/api/emergency',     emergencyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload',        uploadRoutes);
app.use('/api/payments',      paymentRoutes);

// ── Serve static files ──────────────────────────────────────────
// Uploaded user files (images for lost & found, gallery, etc.)
app.use('/uploads', express.static(path.join(FRONTEND_DIR, 'public/uploads')));

// Frontend assets
app.use(express.static(path.join(FRONTEND_DIR, 'public')));
app.use('/styles',  express.static(path.join(FRONTEND_DIR, 'src/styles')));
app.use('/scripts', express.static(path.join(FRONTEND_DIR, 'src/scripts')));
app.use('/images',  express.static(path.join(FRONTEND_DIR, 'src/assets/images')));

// Admin dashboard (served as a protected SPA; auth check is JS-side + session)
app.use('/admin', express.static(path.join(FRONTEND_DIR, 'admin')));

// ── SPA fallback ─────────────────────────────────────────────────
app.get('/admin*', (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'admin', 'dashboard.html'));
});

app.get('*', (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'public', 'index.html'));
});

// ── Global error handler ─────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
    console.error('[Error]', err.message);
    // Never expose stack traces to the client
    res.status(500).json({ error: 'Internal server error' });
});

// ── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🍽  Kashmir Caterers running at http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Admin panel: http://localhost:${PORT}/admin/dashboard.html\n`);
});

module.exports = app;
