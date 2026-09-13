# Kashmir Caterers — Changelog

All notable changes to this project are documented here.
Format: `[component] Description — risk / notes`

---

## v2.0.0 — Production-Ready Release

### Backend — New Features

#### Lost & Found System
- **New route file** `backend/src/routes/lostFound.js`
- `POST /api/lost-found` — public: submit a lost or found item report. Returns a unique `ref_id` (e.g. `LF-20240615-A3X4`).
- `GET /api/lost-found/lookup/:refId` — public: look up the status of a report by reference ID. Returns only non-sensitive fields (no phone/email exposed publicly).
- `GET /api/lost-found` — admin: full list with filters (`?status=`, `?type=`).
- `PATCH /api/lost-found/:id` — admin: update status or notes.
- `DELETE /api/lost-found/:id` — admin: permanent delete.
- Automatically creates a `notifications` record when a new report is submitted.

#### Emergency Contacts System
- **New route file** `backend/src/routes/emergency.js`
- `GET /api/emergency` — public: active contacts only (no sensitive fields).
- `GET /api/emergency/all` — admin: all contacts including inactive.
- `POST /api/emergency` — admin: add contact.
- `PATCH /api/emergency/:id` — admin: update / activate / deactivate.
- `DELETE /api/emergency/:id` — admin: remove contact.

#### Notifications System
- **New route file** `backend/src/routes/notifications.js`
- `GET /api/notifications` — admin: list recent 50.
- `GET /api/notifications/unread` — admin: unread count (used by bell badge).
- `PATCH /api/notifications/mark-all-read` — admin.
- `PATCH /api/notifications/:id/read` — admin: mark single as read.
- `DELETE /api/notifications/:id` — admin.
- **New helper** `backend/src/models/notificationHelper.js` — `createNotification(db, type, title, body, refId)` — never throws, so notification failure cannot cascade.

#### Secure File Upload
- **New route file** `backend/src/routes/upload.js`
- `POST /api/upload` — authenticated users only. Accepts single file upload.
- **Security controls**: MIME whitelist (JPEG, PNG, WebP, GIF), 5 MB size cap, UUID filename rename (prevents path traversal), upload logged to `uploads` table.
- Files served from `/uploads/` (separate from other static assets).

### Backend — Changes

#### `backend/server.js`
- Added startup environment validation — crashes fast in production if `SESSION_SECRET` is missing or default.
- Wired in 4 new route prefixes: `/api/lost-found`, `/api/emergency`, `/api/notifications`, `/api/upload`.
- Added dedicated `uploadLimiter` (30 requests / 15 min).
- Added `mediaSrc: blob:` and `imgSrc: blob:` to CSP for webcam stream support.
- Added `hidePoweredBy: true` and `frameguard: deny` to Helmet config.
- Serves `/uploads/` as a static path for uploaded files.
- Corrected session secret default key (was `'change-me-in-production'`, now `'dev-insecure-secret-change-me'` with a clear warning log).

#### `backend/src/middleware/auth.js`
- **Breaking change (tightened)**: `requireAdmin` now enforces `role === 'admin'` only. Previously it also passed `employee`. This is intentional — write operations should not be available to regular employees.
- **New export**: `requireStaff` — passes `employee` OR `admin`. Applied to read-only endpoints like `GET /api/bookings`.

#### `backend/src/routes/bookings.js`
- `GET /api/bookings` now uses `requireStaff` (employees can view bookings).
- `POST /api/bookings` now creates a notification on successful submission.

#### `backend/src/routes/reviews.js`
- `POST /api/reviews` now creates a notification on new review submission.

#### `backend/.env.example`
- Added `UPLOAD_MAX_MB`, `businessPhone2`, `whatsappNumber` entries.
- Added generation instructions for `SESSION_SECRET`.
- Reorganised with section headers for readability.

### Database — New Tables (schema v2)

See `DB_CHANGES.md` for full column definitions.

- `lost_found` — lost & found reports with reference IDs and status tracking.
- `emergency_contacts` — sortable contacts per category (staff, medical, fire, police, utility).
- `notifications` — lightweight admin notification feed and audit trail.
- `uploads` — file upload registry (original name, stored name, MIME, size, uploader).
- Added 5 performance indexes: `idx_bookings_status`, `idx_bookings_date`, `idx_lost_found_ref`, `idx_lost_found_status`, `idx_notifications_read`.

#### Seed Data Updates
- Default emergency contacts: Anand Bhagat (owner), Site Manager, Ambulance (102), Fire (101), Police (100).
- Corrected business contact details (actual Jammu addresses, real phone numbers).
- Fixed location coordinates to Jammu (Akalpur Morh + Qila Mubarak) — previous seed data had placeholder Mumbai/Delhi locations.
- Menu categories aligned with the actual `VALID_CATEGORIES` list used by the API.

### Frontend — Admin Dashboard

- Added **Lost & Found tab** (`#lost-found`) with filterable table (by status, type), resolve/reopen and delete actions.
- Added **Emergency Contacts tab** (`#emergency`) with add/activate/deactivate/delete.
- Added **Notifications bell** in the admin header — polls `/api/notifications/unread` every 60 seconds, shows unread badge count, expandable panel with mark-all-read.
- Added `openAddEmergencyModal()` and modal HTML for adding emergency contacts.
- Added CSS utility classes: `.badge`, `.badge-warning`, `.badge-success`, `.badge-info`, `.badge-muted`, category badge variants, `.info-banner`, `.action-btn.danger`.
- Added `.notif-bell-btn`, `.notif-badge`, `.notif-panel`, `.notif-item` CSS for the notification panel.

### Frontend — Public Website

- **Emergency Contact Widget** (`/scripts/emergency-widget.js`) — floating 🆘 FAB on all pages. Fetches active contacts from `/api/emergency`, groups by category, shows tap-to-call links, links to Lost & Found page. Uses session storage cache (30 min TTL) to minimise API calls.
- **Lost & Found page** (`/lost-found.html`) — two-panel UI: status lookup by reference ID + report submission form. Fully client-side validated, server-side validated, returns reference ID on success.
- Footer updated: added Lost & Found link, corrected contact details to actual Jammu address/phone numbers.
- Emergency widget script added to main `index.html`.

### Not Changed (by design)
- Chat widget (`/api/chat`) — working, no changes needed.
- Gallery management — working, no changes.
- Menu management — working, no changes.
- Booking wizard (frontend) — working, no changes.
- Auth flow (login/signup/logout) — working, no changes.
- CSS theming and animations — not touched; existing design preserved.

---

## Known Limitations / Documented Risks

See `SECURITY.md` for full risk register.

1. Sessions are stored in memory (no persistent session store) — admin sessions are lost on server restart.
2. The admin dashboard's auth guard is client-side JS (`checkAccess()` redirects to `/`). The server enforces session auth on all `/api/admin/*` calls, but the HTML page itself is publicly accessible at the URL. This is a common pattern for this project scale. Mitigation: ensure all data API calls use `requireAdmin`.
3. File uploads are stored in `frontend/public/uploads/` — accessible at `/uploads/<uuid>.<ext>`. Files are UUID-named (no predictable URLs), but there is no access control on static file serving. Risk: low for non-sensitive images.
4. `unsafe-inline` is present in CSP `scriptSrc` — required for inline `<script>` blocks in HTML files. This is a known trade-off. Nonce-based CSP would be the next improvement.
