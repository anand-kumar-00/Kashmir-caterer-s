# GitHub Deployment Setup

This project is already structured for deployment as a GitHub-hosted repo with a Node backend and static frontend. The app is served from the Express backend at `backend/server.js` and automatically serves the frontend files from `frontend/public`.

## 1) Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## 2) Required GitHub repository settings

Before deploying, make sure the repo is public or private as needed and that the following are configured:

- GitHub Actions enabled
- Secrets added for your hosting provider
- `.env` files remain excluded from version control

## 3) Recommended hosting options

### Option A: Render (recommended)

1. Create a Render account and create a new Web Service.
2. Connect your GitHub repo.
3. Set the root directory to `backend`.
4. Use:
   - Build Command: `npm install && npm run init-db`
   - Start Command: `npm start`
5. Add environment variables in Render:
   - `NODE_ENV=production`
   - `PORT=10000` (Render sets this automatically in many cases, but define it if needed)
   - `SESSION_SECRET=<strong-random-string>`
   - `SITE_URL=https://your-live-domain.com`
   - `SMTP_HOST` (optional)
   - `SMTP_PORT` (optional)
   - `SMTP_USER` (optional)
   - `SMTP_PASS` (optional)
   - `GROQ_API_KEY` (optional)
   - `GROQ_MODEL` (optional)
   - `MAPS_API_KEY` (optional)

6. Add repo secrets if using the included GitHub Actions workflow:
   - `RENDER_SERVICE_ID`
   - `RENDER_API_KEY`

### Option B: Railway

1. Create a Railway project.
2. Import your GitHub repo.
3. Set the service root to `backend`.
4. Use the Node environment and add the same environment variables as above.
5. Deploy the service from the branch you want to publish.

### Option C: VPS / self-hosted server

Use the steps in [DEPLOYMENT.md](DEPLOYMENT.md) and point your server to the repository checkout. This is best if you want full control over Nginx, SSL, and backups.

## 4) Important production notes

- Never commit actual `.env` values.
- Change the default admin password after first login.
- Use HTTPS in production so session cookies are secure.
- SQLite works for a small site, but if you expect heavy traffic or multiple app instances, migrate to PostgreSQL or MySQL.

## 5) Verification checklist before release

- [ ] `backend/.env` exists locally and is ignored by git
- [ ] `SESSION_SECRET` is set to a strong value
- [ ] `NODE_ENV=production`
- [ ] `SITE_URL` matches the production domain
- [ ] Database initialized successfully
- [ ] Admin login works on the deployed site
- [ ] HTTPS is active on your host

## 6) Useful commands

```bash
cd backend
npm install
npm run init-db
npm start
```

To generate a secure session secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
