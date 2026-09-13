/**
 * Emergency Contact Widget
 * Fetches active emergency contacts from /api/emergency and
 * renders a floating button + expandable panel on the main site.
 *
 * Loaded only when genuinely needed — the widget is unobtrusive
 * until the user taps the button.
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'kc_emergency_contacts';
    const CACHE_TTL   = 30 * 60 * 1000; // 30 minutes

    /* ── Load contacts (with cache) ── */
    async function fetchContacts() {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
            try {
                const { data, ts } = JSON.parse(cached);
                if (Date.now() - ts < CACHE_TTL) return data;
            } catch (_) {}
        }

        try {
            const res  = await fetch('/api/emergency');
            if (!res.ok) return [];
            const data = await res.json();
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data, ts: Date.now() }));
            return data;
        } catch (_) {
            return [];
        }
    }

    /* ── Category icons ── */
    const ICONS = {
        staff:   '👤',
        medical: '🏥',
        fire:    '🚒',
        police:  '🚔',
        utility: '🔧',
        other:   '📞',
    };

    /* ── Build and inject widget ── */
    async function buildWidget() {
        const contacts = await fetchContacts();
        if (!contacts.length) return; // nothing to show

        const categorised = {};
        contacts.forEach(c => {
            if (!categorised[c.category]) categorised[c.category] = [];
            categorised[c.category].push(c);
        });

        const categoryOrder = ['staff', 'medical', 'fire', 'police', 'utility', 'other'];

        let rows = '';
        for (const cat of categoryOrder) {
            if (!categorised[cat]) continue;
            rows += `<div class="ec-group">
                <div class="ec-group-title">${ICONS[cat] || '📞'} ${cat.charAt(0).toUpperCase() + cat.slice(1)}</div>`;
            for (const c of categorised[cat]) {
                rows += `
                <div class="ec-contact">
                    <div class="ec-contact-info">
                        <strong>${escHtml(c.name)}</strong>
                        <span>${escHtml(c.role)}</span>
                    </div>
                    <div class="ec-contact-actions">
                        <a href="tel:${escHtml(c.phone)}" class="ec-call-btn" aria-label="Call ${escHtml(c.name)}">${escHtml(c.phone)}</a>
                        ${c.phone_alt ? `<a href="tel:${escHtml(c.phone_alt)}" class="ec-call-btn alt" aria-label="Alt: ${escHtml(c.phone_alt)}">${escHtml(c.phone_alt)}</a>` : ''}
                    </div>
                </div>`;
            }
            rows += `</div>`;
        }

        const widget = document.createElement('div');
        widget.id = 'kc-emergency-widget';
        widget.innerHTML = `
            <button class="ec-fab" id="ec-fab-btn" onclick="kcToggleEmergency()"
                    aria-haspopup="true" aria-expanded="false" aria-label="Emergency contacts">
                🆘
            </button>
            <div class="ec-panel" id="ec-panel" role="dialog" aria-modal="false" aria-label="Emergency contacts"
                 aria-hidden="true">
                <div class="ec-panel-header">
                    <strong>Emergency Contacts</strong>
                    <button class="ec-close" onclick="kcToggleEmergency()" aria-label="Close">✕</button>
                </div>
                <div class="ec-panel-body">
                    ${rows}
                </div>
                <div class="ec-panel-footer">
                    <a href="/lost-found.html" class="ec-lf-link">🔍 Lost &amp; Found</a>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
        injectStyles();
    }

    /* ── Toggle ── */
    window.kcToggleEmergency = function () {
        const panel = document.getElementById('ec-panel');
        const btn   = document.getElementById('ec-fab-btn');
        if (!panel || !btn) return;
        const open = panel.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        panel.setAttribute('aria-hidden', String(!open));

        // Close on outside click
        if (open) {
            setTimeout(() => {
                document.addEventListener('click', function outsideHandler(e) {
                    const w = document.getElementById('kc-emergency-widget');
                    if (w && !w.contains(e.target)) {
                        panel.classList.remove('open');
                        btn.setAttribute('aria-expanded', 'false');
                        panel.setAttribute('aria-hidden', 'true');
                        document.removeEventListener('click', outsideHandler);
                    }
                });
            }, 80);
        }
    };

    /* ── Styles ── */
    function injectStyles() {
        if (document.getElementById('ec-widget-styles')) return;
        const s = document.createElement('style');
        s.id = 'ec-widget-styles';
        s.textContent = `
            #kc-emergency-widget { position: fixed; bottom: 28px; right: 24px; z-index: 8000; font-family: 'Inter', sans-serif; }

            .ec-fab {
                width: 56px; height: 56px;
                border-radius: 50%;
                background: #b44949;
                color: #fff;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 4px 16px rgba(180,73,73,.45);
                transition: transform 200ms, box-shadow 200ms;
                display: flex; align-items: center; justify-content: center;
            }
            .ec-fab:hover { transform: scale(1.08); box-shadow: 0 6px 22px rgba(180,73,73,.55); }

            .ec-panel {
                display: none;
                position: absolute;
                bottom: calc(100% + 12px);
                right: 0;
                width: 300px;
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 12px 40px rgba(18,32,51,.18);
                border: 1px solid #e5e7eb;
                overflow: hidden;
            }
            .ec-panel.open { display: block; animation: ec-slide-up 180ms ease; }

            @keyframes ec-slide-up {
                from { opacity: 0; transform: translateY(10px); }
                to   { opacity: 1; transform: translateY(0); }
            }

            .ec-panel-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 14px 16px;
                background: #122033;
                color: #fff;
            }
            .ec-panel-header strong { font-size: .95rem; }
            .ec-close {
                background: none; border: none; color: rgba(255,255,255,.8);
                cursor: pointer; font-size: 1rem; line-height: 1; padding: 2px 4px;
            }

            .ec-panel-body { max-height: 360px; overflow-y: auto; padding: 12px; }

            .ec-group { margin-bottom: 10px; }
            .ec-group-title {
                font-size: .72rem; font-weight: 700; text-transform: uppercase;
                color: #57606a; letter-spacing: .06em; margin-bottom: 6px;
                padding: 0 4px;
            }
            .ec-contact {
                display: flex; justify-content: space-between; align-items: center;
                padding: 8px 10px;
                border-radius: 10px;
                border: 1px solid #f0ebe3;
                margin-bottom: 6px;
                background: #fdfaf5;
            }
            .ec-contact-info { flex: 1; min-width: 0; }
            .ec-contact-info strong { display: block; font-size: .85rem; color: #122033; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .ec-contact-info span  { font-size: .75rem; color: #74808d; }
            .ec-contact-actions { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; }
            .ec-call-btn {
                display: block;
                padding: 4px 10px;
                background: #122033;
                color: #fff;
                border-radius: 6px;
                font-size: .78rem;
                font-weight: 600;
                text-decoration: none;
                white-space: nowrap;
                transition: background 150ms;
            }
            .ec-call-btn:hover  { background: #1e3a5c; }
            .ec-call-btn.alt    { background: #2f6fa3; }
            .ec-call-btn.alt:hover { background: #245480; }

            .ec-panel-footer {
                border-top: 1px solid #f0ebe3;
                padding: 10px 14px;
                text-align: center;
            }
            .ec-lf-link {
                font-size: .82rem; color: #2f6fa3;
                text-decoration: none; font-weight: 600;
            }
            .ec-lf-link:hover { text-decoration: underline; }

            @media (max-width: 380px) {
                #kc-emergency-widget { bottom: 20px; right: 16px; }
                .ec-panel { width: calc(100vw - 48px); }
            }
        `;
        document.head.appendChild(s);
    }

    /* ── XSS safe ── */
    function escHtml(str) {
        return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    /* ── Bootstrap ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
        buildWidget();
    }
})();
