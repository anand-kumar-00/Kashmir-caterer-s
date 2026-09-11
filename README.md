# Kashmir Caterers — Website

Premium Kashmiri catering service website with a full-stack backend, admin dashboard, SEO, and accessibility improvements.

---

## Quick Start

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and fill in:
# - SESSION_SECRET (generate a long random string)
# - MAPS_API_KEY (your Google Maps API key, optional)
# - SMTP_* (for booking confirmation emails, optional)
```

### 3. Initialise the database
```bash
npm run init-db
```
This creates `database/kashmir_caterers.db` and seeds the default admin account.

### 4. Start the server
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

---

## Project Structure

```
Kashmir-caterer-s/
├── frontend/
│   ├── public/              ← index.html, showcase.html, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── styles/          ← CSS design system (main, header, hero, services, gallery, …)
│   │   ├── scripts/         ← JS modules (main, auth, booking, feedback, animation, admin-dashboard)
│   │   └── assets/images/   ← Logo, hero, service images, gallery
│   └── admin/
│       └── dashboard.html   ← Admin panel (served at /admin/)
│
├── backend/
│   ├── server.js            ← Express entry point
│   ├── .env.example         ← Copy to .env and fill in secrets
│   └── src/
│       ├── routes/          ← auth, bookings, menu, gallery, reviews, admin
│       ├── models/          ← db.js (SQLite singleton), initDb.js
│       └── middleware/      ← auth.js (session guards)
│
├── database/
│   ├── schema.sql           ← Table definitions + seed data
│   └── kashmir_caterers.db  ← Created at runtime by init-db script
│
└── README.md
```

---

## Default Admin Accounts

| Name          | Email                          | Employee Code   | Password    | Role  |
|---------------|--------------------------------|-----------------|-------------|-------|
| Kashmir Admin | admin@kashmircaterers.local    | KC-ADMIN-001    | admin123    | admin |
| Anand Bhagat  | itsanandbhagat47@gmail.com     | KC-ADMIN-9596   | Anand@9596  | admin |

> **Change these passwords after first login in the Settings tab.**

---

## API Endpoints

| Method | Endpoint                  | Auth     | Description                     |
|--------|---------------------------|----------|---------------------------------|
| POST   | /api/auth/signup          | Public   | Create customer account         |
| POST   | /api/auth/login           | Public   | Login (returns session cookie)  |
| POST   | /api/auth/logout          | Any      | Destroy session                 |
| GET    | /api/auth/me              | Session  | Get current user                |
| POST   | /api/bookings             | Public   | Submit a booking                |
| GET    | /api/bookings             | Admin    | List all bookings               |
| PATCH  | /api/bookings/:id         | Admin    | Update booking status           |
| DELETE | /api/bookings/:id         | Admin    | Cancel booking                  |
| GET    | /api/menu                 | Public   | List active menu items          |
| POST   | /api/menu                 | Admin    | Add menu item                   |
| PATCH  | /api/menu/:id             | Admin    | Edit menu item                  |
| DELETE | /api/menu/:id             | Admin    | Deactivate menu item            |
| GET    | /api/gallery              | Public   | List gallery items              |
| POST   | /api/gallery              | Admin    | Add gallery item                |
| GET    | /api/reviews              | Public   | List reviews                    |
| POST   | /api/reviews              | Public   | Submit a review                 |
| GET    | /api/admin/employees      | Admin    | List employees                  |
| POST   | /api/admin/employees      | Admin    | Add employee                    |
| PATCH  | /api/admin/employees/:id  | Admin    | Edit employee / payroll         |
| GET    | /api/admin/expenses       | Admin    | List expenses                   |
| POST   | /api/admin/expenses       | Admin    | Record expense                  |
| GET    | /api/admin/locations      | Admin    | List locations                  |
| POST   | /api/admin/locations      | Admin    | Add location                    |
| GET    | /api/admin/meetings       | Admin    | List meetings                   |
| POST   | /api/admin/meetings       | Admin    | Schedule meeting                |
| GET    | /api/admin/settings       | Admin    | Get business settings           |
| PATCH  | /api/admin/settings       | Admin    | Update business settings        |
| GET    | /api/admin/reports        | Admin    | Summary revenue/booking report  |

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Vanilla HTML + CSS + JS (no build step) |
| Backend    | Node.js 18 + Express 4            |
| Database   | SQLite (better-sqlite3) — zero ops, file-based |
| Auth       | bcryptjs passwords + express-session |
| Security   | helmet, express-rate-limit, CORS  |

SQLite was chosen because it is zero-ops (no separate database server), perfectly sized for a single-location catering business, and trivially backed up by copying one file.
Upgrade to PostgreSQL when concurrent writes or hosted multi-server deployment become a requirement.

---

## What Changed

### Backend (new)
- Real REST API replacing localStorage simulation
- Passwords hashed with bcrypt (12 rounds) — `btoa()` removed entirely
- Session-based auth with secure cookies
- SQLite database with proper schema, constraints, and foreign keys

### Frontend restructured
- Moved from flat root to `frontend/public/`, `frontend/src/`, `frontend/admin/`
- All JavaScript files rewritten to call `/api/*` endpoints instead of reading/writing localStorage
- Broken Google Maps `APT-KEY` placeholder replaced with a static iframe embed — works without an API key; add your real key in `.env` to restore dynamic markers
- `admin/dashboard.html` rebuilt with the same visual shape, wired to API calls

### SEO added
- Unique `<title>` and `<meta description>` per page
- Open Graph + Twitter Card tags on every page
- `LocalBusiness` + `FoodEstablishment` JSON-LD structured data on homepage
- `robots.txt` and `sitemap.xml`
- Semantic HTML: `<main>`, `<nav>`, `<header>`, `<footer>`, `<address>`, `<article>`, `<section>`
- Correct heading hierarchy (single h1 per page)
- `alt` text on every image

### Accessibility
- Skip-navigation link (`<a href="#main-content" class="skip-link">`)
- WCAG AA contrast throughout (dark text on light, gold accent on dark)
- Minimum 16px body text, minimum 44px touch targets
- `aria-label`, `aria-modal`, `role`, `aria-live` on interactive elements
- `<select>` language picker has a visible `<label>` (sr-only) and correct `aria-label`
- Star rating rewritten as `role="radiogroup"` with `aria-checked`
- `prefers-reduced-motion` respected: all CSS animations disabled via media query
- RTL layout applied automatically when Urdu is selected

### UI/UX polish
- Unified CSS design-token system in `main.css` (single source of truth for colours, spacing, radii, shadows, transitions)
- Hero uses CSS `aspect-ratio` and `min(100svh, 720px)` — never overflows on any device
- Sticky header gains shadow on scroll (CSS class toggled by JS)
- Gallery/service card scroll-reveal via IntersectionObserver (respects reduced-motion)
- Greeting animation cycles smoothly with CSS transition (no layout shift)
- Admin dashboard stat values are loaded from API on page load

### Intentionally left unchanged
- The 4-language selector and translation system (`data-key` attribute pattern) — preserved and extended to new UI copy
- The 6-step booking wizard structure — preserved; only the submit endpoint was changed
- The admin dashboard visual layout and sidebar design — preserved exactly
- Existing image assets — copied as-is (compression is a separate deployment concern)
- No payments integration was added — "Confirm Booking" records the enquiry and the admin team follows up; adding Razorpay/Stripe is a future step

---

## Deployment Notes

For production:
1. Set `NODE_ENV=production` in `.env`
2. Set a strong `SESSION_SECRET`
3. Add a real `MAPS_API_KEY` (optional but restores dynamic map markers)
4. Serve behind Nginx or Caddy for HTTPS and static file caching
5. Point `SITE_URL` to your domain for correct CORS and canonical URLs
