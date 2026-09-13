/**
 * Secure File Upload route
 * POST /api/upload
 *
 * Security controls:
 *   - Only authenticated users can upload
 *   - MIME type whitelist (images only for now)
 *   - File size limit: 5 MB
 *   - Files are renamed to UUID to prevent path traversal
 *   - Uploaded paths are stored in the uploads registry table
 *
 * Returns: { url: "/uploads/<filename>", id }
 */

const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../models/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/* ── Upload directory ── */
const UPLOAD_DIR = path.resolve(__dirname, '../../../frontend/public/uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* ── Allowed MIME types ── */
const ALLOWED_MIME = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
]);

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '');
        cb(null, `${uuidv4()}${ext}`);
    },
});

const fileFilter = (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,   // 5 MB
        files: 1,
    },
});

/* ── POST /api/upload ── */
router.post('/', requireAuth, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or file type not allowed' });
    }

    const db      = getDb();
    const uploadId = 'UPL-' + uuidv4().replace(/-/g,'').slice(0, 10).toUpperCase();
    const purpose  = (req.body.purpose || 'other').slice(0, 50);

    db.prepare(`
        INSERT INTO uploads (id, original_name, stored_name, mime_type, size_bytes, uploaded_by, purpose)
        VALUES (?,?,?,?,?,?,?)
    `).run(
        uploadId,
        req.file.originalname.slice(0, 200),
        req.file.filename,
        req.file.mimetype,
        req.file.size,
        req.session.userId || null,
        purpose
    );

    res.status(201).json({
        id:  uploadId,
        url: `/uploads/${req.file.filename}`,
    });
});

/* ── Multer error handler ── */
router.use((err, _req, res, _next) => {
    if (err instanceof multer.MulterError) {
        const msg = err.code === 'LIMIT_FILE_SIZE'
            ? 'File too large (max 5 MB)'
            : `Upload error: ${err.message}`;
        return res.status(400).json({ error: msg });
    }
    if (err) return res.status(400).json({ error: err.message });
});

module.exports = router;
