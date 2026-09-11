/**
 * Kashmir Caterers — auth.js
 * Login, signup, logout — all wired to /api/auth/* endpoints
 * Passwords are hashed server-side (bcrypt). No btoa() here.
 */

/* ── LOGIN MODAL ───────────────────────────────────────────── */
function openLoginModal() {
    document.getElementById('loginModal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeLoginModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('loginModal')?.classList.remove('active');
    document.body.style.overflow = '';
}

/* ── SIGNUP MODAL ──────────────────────────────────────────── */
function openSignupModal() {
    document.getElementById('signupModal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeSignupModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('signupModal')?.classList.remove('active');
    document.body.style.overflow = '';
}

/* ── SWITCH ────────────────────────────────────────────────── */
function switchToSignup(event) {
    event.preventDefault();
    closeLoginModal();
    setTimeout(openSignupModal, 250);
}
function switchToLogin(event) {
    event.preventDefault();
    closeSignupModal();
    setTimeout(openLoginModal, 250);
}

/* ── HANDLE LOGIN ──────────────────────────────────────────── */
async function handleLogin(event) {
    event.preventDefault();

    const identifier = document.getElementById('login-identifier').value.trim();
    const password   = document.getElementById('login-password').value;

    if (!identifier) { showNotification('Enter your email or employee ID', 'error'); return; }
    if (password.length < 6) { showNotification('Password must be at least 6 characters', 'error'); return; }

    const btn = event.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Logging in…';

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ identifier, password }),
        });

        const data = await res.json();
        if (!res.ok) {
            showNotification(data.error || 'Login failed', 'error');
            return;
        }

        const { user } = data;
        appState.isLoggedIn   = true;
        appState.userRole     = user.role;
        appState.currentUser  = user;
        saveState();
        updateAuthUI();
        closeLoginModal();
        showNotification(`Welcome back, ${user.name}!`, 'success');

        setTimeout(() => {
            if (user.role === 'employee' || user.role === 'admin') {
                window.location.href = '/admin/dashboard.html';
            } else {
                window.location.reload();
            }
        }, 900);
    } catch (err) {
        handleError(err, 'Login failed. Please try again.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Login';
    }
}

/* ── HANDLE SIGNUP ─────────────────────────────────────────── */
async function handleSignup(event) {
    event.preventDefault();

    const name            = document.getElementById('signup-name').value.trim();
    const email           = document.getElementById('signup-email').value.trim();
    const password        = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (name.length < 3)         { showNotification('Name must be at least 3 characters', 'error'); return; }
    if (!validateEmail(email))   { showNotification('Invalid email address', 'error'); return; }
    if (password.length < 6)     { showNotification('Password must be at least 6 characters', 'error'); return; }
    if (password !== confirmPassword) { showNotification('Passwords do not match', 'error'); return; }

    const btn = event.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Creating account…';

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
            showNotification(data.error || 'Signup failed', 'error');
            return;
        }

        const { user } = data;
        appState.isLoggedIn  = true;
        appState.userRole    = 'customer';
        appState.currentUser = user;
        saveState();
        updateAuthUI();
        closeSignupModal();
        showNotification(`Welcome, ${name}! Your account has been created.`, 'success');

        setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
        handleError(err, 'Signup failed. Please try again.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Create Account';
    }
}

/* ── AUTH UI UPDATE ────────────────────────────────────────── */
function updateAuthUI() {
    const loginBtn  = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    if (!loginBtn || !signupBtn) return;

    if (appState.isLoggedIn && appState.currentUser) {
        const firstName = appState.currentUser.name.split(' ')[0];
        loginBtn.textContent = firstName;
        loginBtn.onclick = e => { e.preventDefault(); openUserMenu(); };

        if (appState.userRole === 'employee' || appState.userRole === 'admin') {
            signupBtn.textContent = 'Dashboard';
            signupBtn.onclick = e => { e.preventDefault(); window.location.href = '/admin/dashboard.html'; };
        } else {
            signupBtn.textContent = 'Account';
            signupBtn.onclick = e => { e.preventDefault(); openUserMenu(); };
        }
    }
}

/* ── USER MENU POPOVER ─────────────────────────────────────── */
function openUserMenu() {
    // Remove existing
    document.querySelector('.user-menu')?.remove();

    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.style.cssText = `
        position: fixed; top: 72px; right: 20px;
        background: white; border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        z-index: 4000; min-width: 230px;
        border: 1px solid var(--color-border);
        overflow: hidden;
    `;
    menu.innerHTML = `
        <div style="padding: 16px; border-bottom: 1px solid var(--color-border);">
            <p style="margin:0 0 4px 0; font-weight: 700; font-size:1rem; color: var(--color-text);">${escHtml(appState.currentUser.name)}</p>
            <p style="margin:0; font-size:.875rem; color: var(--color-muted);">${escHtml(appState.currentUser.email || '')}</p>
            ${appState.currentUser.employeeCode ? `<p style="margin:4px 0 0; font-size:.8rem; color: var(--color-muted);">ID: ${escHtml(appState.currentUser.employeeCode)}</p>` : ''}
        </div>
        <div style="padding: 8px;">
            ${(appState.userRole === 'employee' || appState.userRole === 'admin')
                ? `<a href="/admin/dashboard.html" style="display:block;padding:10px 12px;color:var(--color-gold);font-weight:600;border-radius:6px;font-size:.9rem;" onmouseenter="this.style.background='var(--color-surface)'" onmouseleave="this.style.background='transparent'">Open Dashboard</a>`
                : ''}
            <a href="#" onclick="logoutUser(event)" style="display:block;padding:10px 12px;color:#c0392b;font-weight:600;border-radius:6px;font-size:.9rem;" onmouseenter="this.style.background='#fff5f5'" onmouseleave="this.style.background='transparent'">Logout</a>
        </div>
    `;

    document.body.appendChild(menu);

    setTimeout(() => {
        document.addEventListener('click', e => {
            if (!menu.contains(e.target) && !e.target.classList.contains('login-btn')) {
                menu.remove();
            }
        }, { once: true });
    }, 80);
}

/* ── LOGOUT ────────────────────────────────────────────────── */
async function logoutUser(event) {
    event.preventDefault();
    try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (_) {}

    appState.isLoggedIn  = false;
    appState.userRole    = null;
    appState.currentUser = null;
    saveState();
    document.querySelector('.user-menu')?.remove();
    showNotification('Logged out successfully', 'success');
    setTimeout(() => window.location.href = '/', 700);
}

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    // Verify session is still valid on page load
    if (appState.isLoggedIn) {
        fetch('/api/auth/me', { credentials: 'include' })
            .then(r => r.ok ? r.json() : null)
            .then(user => {
                if (!user) {
                    // Session expired
                    appState.isLoggedIn  = false;
                    appState.userRole    = null;
                    appState.currentUser = null;
                    saveState();
                } else {
                    appState.currentUser = user;
                    appState.userRole    = user.role;
                    saveState();
                    updateAuthUI();
                }
            })
            .catch(() => {});
    }
});
