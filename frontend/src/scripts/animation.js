/**
 * Kashmir Caterers — animation.js
 * Greeting cycle, parallax hero, intersection observer scroll reveal
 */

/* ── GREETING CYCLE ────────────────────────────────────────── */
function initGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;

    // Use current language greeting as first item
    const lang = (document.documentElement.lang || 'en');
    const langGreetings = {
        en: ['Namaste', 'Adaab', 'Hello'],
        hi: ['नमस्ते', 'Adaab', 'Namaste'],
        ur: ['آداب', 'Namaste', 'Hello'],
        pa: ['ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', 'Namaste', 'Hello'],
    };
    const greetings = langGreetings[lang] || langGreetings.en;
    let idx = 0;

    function cycle() {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            idx = (idx + 1) % greetings.length;
            el.textContent = greetings[idx];
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 350);
    }

    el.style.transition = 'opacity 350ms ease, transform 350ms ease';
    setInterval(cycle, 3200);
}

/* ── PARALLAX HERO ─────────────────────────────────────────── */
function initParallax() {
    const heroBg = document.querySelector('.hero-background');
    if (!heroBg) return;
    // Only run on desktop (avoid janky mobile parallax)
    if (window.matchMedia('(max-width: 768px)').matches) return;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        heroBg.style.transform = `translateY(${y * 0.35}px)`;
    }, { passive: true });
}

/* ── BUTTON RIPPLE ─────────────────────────────────────────── */
function initRipple() {
    document.addEventListener('click', e => {
        const btn = e.target.closest('.btn-primary, .btn-secondary');
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x    = e.clientX - rect.left - size / 2;
        const y    = e.clientY - rect.top  - size / 2;
        const rip  = document.createElement('span');
        rip.style.cssText = `
            position:absolute; border-radius:50%; pointer-events:none;
            width:${size}px; height:${size}px;
            left:${x}px; top:${y}px;
            background:rgba(255,255,255,.25);
            transform:scale(0); animation:rippleExpand 550ms ease-out forwards;
        `;
        btn.style.position = btn.style.position || 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(rip);
        setTimeout(() => rip.remove(), 600);
    });

    // Inject keyframes once
    if (!document.getElementById('ripple-kf')) {
        const style = document.createElement('style');
        style.id = 'ripple-kf';
        style.textContent = `
            @keyframes rippleExpand {
                to { transform: scale(2.5); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ── LAZY LOAD ─────────────────────────────────────────────── */
function initLazyLoad() {
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                obs.unobserve(img);
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img => obs.observe(img));
}

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    // Only run if reduced motion isn't preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    initGreeting();
    initParallax();
    initRipple();
    initLazyLoad();
});
