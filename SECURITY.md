# Kashmir Caterers — Security Documentation

This document describes the security controls in place, known risks, and recommendations for hardening in production. The goal is **production-ready security**, not theoretical perfection.

---

## Controls in Place

### Authentication & Session
| Control | Status | Notes |
|---|---|---|
| Password hashing | ✅ bcrypt, 12 rounds (admin seed), 10 rounds (user signup) | Industry standard |
| Session management | ✅ `express-session`, `httpOnly`, `sameSite: lax` | Cookie not readable by JS |
| Session `secure` flag | ✅ Enabled in production (`NODE_ENV=production`) | Requires HTTPS |
| Brute-force protection | ✅ 20 req / 15 min on `/api/auth/` | via `express-rate-limit` |
| Account deactivation | ✅ `is_active = 0` blocks login | Checked before session creation |

### Role-Based Access Control
| Role | Permissions |
|---|---|
| `customer` | Submit bookings, reviews, lost & found reports, view own booking |
| `employee` | Read bookings, read all admin data |
| `admin` | Full read + write on all resources |

Key middleware:
- `requireAuth` — any logged-in user
- `requireStaff` — employee or admin (read-only admin routes)
- `requireAdmin` — admin only (all write/delete operations)

### Input Validation
- All POST/PATCH routes use `express-validator` for server-side validation
- Client-side validation is present but treated as UX, not security
- HTML is escaped before rendering in the admin dashboard via `escHtml()` (prevents stored XSS)

### Security Headers (via Helmet)
| Header | Value |
|---|---|
| Content-Security-Policy | `default-src 'self'`, scripts from self + Google Maps, styles from self + Google Fonts |
| X-Frame-Options | `DENY` (no iframes) |
| X-Powered-By | Removed |
| HSTS | Enabled by Helmet in production |
| X-Content-Type-Options | `nosniff` |

### Rate Limiting
| Endpoint | Limit |
|---|---|
| All `/api/*` | 200 req / 15 min |
| `/api/auth/*` | 20 req / 15 min |
| `/api/upload` | 30 req / 15 min |
| `/api/chat` | 20 messages / 5 min per IP |

### File Upload Security
- MIME type whitelist: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Max size: 5 MB
- Filenames replaced with UUID (prevents path traversal)
- Only authenticated users can upload
- All uploads logged to `uploads` table for audit

### API Key Protection
- Groq API key lives only in `.env` / server environment — never exposed to the client
- The frontend talks to `/api/chat` on the same origin; the key never leaves the server
- `.gitignore` should exclude `.env` (verify this before committing)

### CORS
- Development: `origin: true` (permissive)
- Production: restricted to `process.env.SITE_URL`

### Database
- SQLite with `PRAGMA foreign_keys = ON` and WAL mode
- All queries use parameterised prepared statements (no string concatenation)
- No raw SQL exposed to client input

---

## Known Risks (Documented, Not Ignored)

### Risk 1 — In-Memory Sessions (Medium)
**Description**: Sessions are stored in Express's default memory store. On server restart, all active sessions are invalidated.

**Impact**: Admin sessions lost on restart; users need to re-login.

**Mitigation for production**: Replace with `better-sqlite3-session-store` or `connect-redis`.

---

### Risk 2 — Admin HTML Page Publicly Accessible (Low-Medium)
**Description**: `GET /admin/dashboard.html` is served statically. There is no server-side redirect for unauthenticated requests to the HTML page itself. Auth is enforced by the JS `checkAccess()` function which calls `/api/auth/me`.

**Impact**: An attacker can view the admin page HTML source. All actual data endpoints are session-protected.

**Mitigation**: Acceptable for this scale. For stronger protection, add a server-side middleware that checks the session and redirects to `/` before serving the admin HTML.

---

### Risk 3 — `unsafe-inline` in CSP (Low)
**Description**: Several HTML files use inline `<script>` blocks (JSON-LD schema, year script), requiring `unsafe-inline` in CSP `scriptSrc`.

**Impact**: XSS risk increased if stored XSS is achieved. All output in admin dashboard uses `escHtml()`.

**Mitigation**: Move inline scripts to external files or implement nonce-based CSP.

---

### Risk 4 — Uploaded Files Publicly Accessible (Low)
**Description**: Files in `/uploads/` are served statically. File names are UUIDs (not guessable), but there is no session check on static asset serving.

**Impact**: Anyone who knows the URL can access an uploaded image. Suitable for non-sensitive images (lost & found item photos).

**Mitigation**: For sensitive uploads, serve through an authenticated API endpoint instead of static middleware.

---

### Risk 5 — No Email Verification (Low for this use case)
**Description**: Customer signups are not verified. Anyone can create an account with any email address.

**Impact**: Spam accounts. No financial risk since accounts don't grant payment access.

**Mitigation**: Add email verification for customer accounts if needed.

---

### Risk 6 — Weak Default Passwords in Seed (Resolved)
**Description**: Default admin passwords (`admin123`, `Anand@9596`) are stored in `initDb.js` in plaintext for seeding purposes.

**Mitigation applied**: These are bcrypt-hashed before insertion. The plaintext is only in the seed script, not the database. **Change these passwords immediately after first login in production.**

---

## Recommendations Before Production

1. **Generate a strong `SESSION_SECRET`**:
   ```
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

2. **Change default admin passwords** via the admin dashboard.

3. **Use HTTPS** — obtain a TLS certificate (Let's Encrypt) and set `NODE_ENV=production`.

4. **Replace in-memory session store** with a persistent one (see Risk 1).

5. **Restrict Google Maps API key** to your domain in Google Cloud Console.

6. **Keep `.env` out of version control** — verify `.gitignore` includes `.env`.

7. **Set `SITE_URL`** correctly for CORS in production.

8. **Run `npm audit`** periodically and patch critical/high vulnerabilities.

9. **Database backups** — SQLite file is a single file at `database/kashmir_caterers.db`. Schedule regular copies (e.g. daily cron to cloud storage).

10. **Monitor `/api/admin/*` access logs** — consider adding an audit log route if the team scales.
