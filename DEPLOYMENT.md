# Kashmir Caterers — Deployment Guide

## Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 9
- A Linux/Windows server or any Node-compatible host (Railway, Render, VPS)
- HTTPS (required for `secure` session cookies in production)

---

## Quick Start (Development)

```bash
# 1. Clone / unzip the project
cd Kashmir-caterer-s

# 2. Install backend dependencies
cd backend
npm install

# 3. Create your .env file
cp .env.example .env
# Edit .env — at minimum, set SESSION_SECRET to a long random string:
#   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

# 4. Initialise the database (creates tables + seeds admin accounts)
npm run init-db

# 5. Start the development server (auto-restarts on changes)
npm run dev

# Open http://localhost:3001
# Admin panel: http://localhost:3001/admin/dashboard.html
# Lost & Found: http://localhost:3001/lost-found.html
```

Default admin login credentials (change immediately):
- Email: `itsanandbhagat47@gmail.com` / Password: `Anand@9596`
- Email: `admin@kashmircaterers.local` / Password: `admin123`

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in all values.

| Variable | Required | Notes |
|---|---|---|
| `PORT` | No | Defaults to `3001` |
| `NODE_ENV` | Production | Set to `production` — enables secure cookies, strict CORS |
| `SESSION_SECRET` | **Yes** | Min 32-char random string. Server won't start without this in production. |
| `DB_PATH` | No | Relative path from `/backend`. Default: `../database/kashmir_caterers.db` |
| `SITE_URL` | Production | Your domain (`https://yourdomain.com`). Used for CORS and emails. |
| `SMTP_HOST` | No | Enables booking confirmation emails |
| `SMTP_PORT` | No | Usually `587` |
| `SMTP_USER` | No | Your email address |
| `SMTP_PASS` | No | App password (not your regular email password) |
| `GROQ_API_KEY` | No | Enables AI chat. Get free key at https://console.groq.com |
| `GROQ_MODEL` | No | Defaults to `llama-3.3-70b-versatile` |
| `MAPS_API_KEY` | No | Google Maps embed. Restrict to your domain. |

---

## Production Deployment

### Option A — Render / Railway (Recommended for simplicity)

1. Push to GitHub (ensure `.env` is in `.gitignore`).
2. Create a new web service on [Render](https://render.com) or [Railway](https://railway.app).
3. Set root directory to `Kashmir-caterer-s/backend`.
4. Build command: `npm install && npm run init-db`
5. Start command: `npm start`
6. Add all environment variables in the platform dashboard (never in code).
7. The platform provides HTTPS automatically.

**Note**: SQLite is a file — on ephemeral file systems (like Render free tier), the database resets on deploy. Use the paid tier with a persistent disk, or migrate to Postgres/MySQL.

---

### Option B — VPS (Ubuntu / Debian)

```bash
# 1. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Upload project files (git clone or scp)
cd /var/www/kashmir-caterers

# 3. Install dependencies
cd backend && npm install --production

# 4. Create .env with production values
nano .env  # set SESSION_SECRET, NODE_ENV=production, SITE_URL, etc.

# 5. Init database
npm run init-db

# 6. Install PM2 (process manager)
npm install -g pm2

# 7. Start the app
pm2 start server.js --name kashmir-caterers
pm2 save
pm2 startup  # follow the output instructions to enable auto-start

# 8. Set up Nginx as reverse proxy
# Add to /etc/nginx/sites-available/kashmir-caterers:
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded files directly (optional — Nginx is faster for static files)
    location /uploads/ {
        alias /var/www/kashmir-caterers/frontend/public/uploads/;
        expires 7d;
    }
}
```

```bash
# Enable site and get HTTPS
sudo ln -s /etc/nginx/sites-available/kashmir-caterers /etc/nginx/sites-enabled/
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo systemctl reload nginx
```

---

## Database Backup

```bash
# Manual backup
cp database/kashmir_caterers.db database/kashmir_caterers_backup_$(date +%Y%m%d).db

# Cron job (daily backup at 2 AM)
0 2 * * * cp /var/www/kashmir-caterers/database/kashmir_caterers.db /backups/kc_$(date +\%Y\%m\%d).db
```

---

## Upgrading from v1

If you have an existing database, do not re-run `npm run init-db` (it will not drop existing data, but re-running the full schema on an existing DB is risky). Instead, run the incremental migration script from `DB_CHANGES.md`.

```bash
# Run via sqlite3 CLI
sqlite3 database/kashmir_caterers.db < migrate_v2.sql
```

---

## Post-Deployment Checklist

- [ ] `SESSION_SECRET` set to a 48-character random hex string
- [ ] `NODE_ENV=production`
- [ ] `SITE_URL` matches your live domain
- [ ] Default admin passwords changed
- [ ] HTTPS certificate active and auto-renewing
- [ ] `.env` file NOT committed to git
- [ ] Database backup scheduled
- [ ] Google Maps API key restricted to your domain
- [ ] `npm audit` run — no critical/high unpatched vulnerabilities
