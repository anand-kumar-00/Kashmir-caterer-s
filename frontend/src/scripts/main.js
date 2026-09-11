/**
 * Kashmir Caterers — main.js
 * App state, language, menu modal, gallery, shared utilities
 */

/* ── APP STATE ─────────────────────────────────────────────── */
const appState = JSON.parse(localStorage.getItem('appState') || '{}');

function saveState() {
    localStorage.setItem('appState', JSON.stringify(appState));
}

/* ── TRANSLATIONS ──────────────────────────────────────────── */
const siteTranslations = {
    en: {
        navMenu: 'Menu', navExplore: 'Gallery', navLocations: 'Locations',
        login: 'Login', signup: 'Sign Up',
        greeting: 'Namaste',
        heroSubtitle: 'Premium Catering for Your Most Special Moments',
        heroTagline: 'Authentic Kashmiri Flavors · Impeccable Service · Unforgettable Events',
        heroCta: 'Book Your Event',
        exploreServices: 'Explore Services',
        servicesTitle: 'Our Services', servicesSubtitle: 'Tailored catering experiences for every occasion',
        serviceMarriage: 'Marriage Catering', serviceBirthday: 'Birthday Catering',
        serviceCorporate: 'Corporate Catering', serviceBbq: 'Barbecue Catering',
        seeMore: 'See More',
        galleryTitle: 'Event Gallery', gallerySubtitle: 'A glimpse of the events we have had the honour to serve',
        locationsTitle: 'Our Locations', locationsSubtitle: 'Find us across India — or call us to come to you',
        bookingTitle: 'Book Your Event', bookingSubtitle: 'Simple, transparent booking — 6 quick steps',
        step1Title: 'Choose Function & Event Date', step2Title: 'Select Menu',
        step3Title: 'Contact Details', step4Title: 'Phone & Guest Count',
        step5Title: 'Anything Else?', step6Title: 'Review Your Booking',
        functionTypeLabel: 'Which function is this for?',
        customerNameLabel: 'Full Name', customerEmailLabel: 'Email Address',
        customerPhoneLabel: 'Phone Number', guestCountLabel: 'Expected Guests',
        requirementsLabel: 'Additional Requirements',
        menuSelectionSubtitle: 'Choose dishes by meal and course.',
        reviewDate: 'Event Date:', reviewFunction: 'Function:', reviewMenu: 'Menu Items:',
        reviewRequirements: 'Special Needs:', reviewTotal: 'Estimated Total:',
        confirmPay: 'Confirm Booking', back: 'Back', next: 'Next',
        loginTitle: 'Login', signupTitle: 'Create Account',
        menuModalTitle: 'Our Menu', menuModalSubtitle: 'Authentic Kashmiri cuisine crafted with care',
    },
    hi: {
        navMenu: 'मेनू', navExplore: 'गैलरी', navLocations: 'स्थान',
        login: 'लॉगिन', signup: 'साइन अप',
        greeting: 'नमस्ते',
        heroSubtitle: 'आपके सबसे खास पलों के लिए प्रीमियम केटरिंग',
        heroTagline: 'असली कश्मीरी स्वाद · बेहतरीन सेवा · यादगार आयोजन',
        heroCta: 'अपना इवेंट बुक करें',
        exploreServices: 'सेवाएं देखें',
        servicesTitle: 'हमारी सेवाएं', servicesSubtitle: 'हर अवसर के लिए अनुकूल खानपान',
        serviceMarriage: 'विवाह केटरिंग', serviceBirthday: 'जन्मदिन केटरिंग',
        serviceCorporate: 'कॉर्पोरेट केटरिंग', serviceBbq: 'बारबेक्यू केटरिंग',
        seeMore: 'और देखें',
        galleryTitle: 'इवेंट गैलरी', gallerySubtitle: 'हमारे आयोजनों की झलक',
        locationsTitle: 'हमारे स्थान', locationsSubtitle: 'पूरे भारत में हमें खोजें',
        bookingTitle: 'अपना इवेंट बुक करें', bookingSubtitle: 'सरल और पारदर्शी बुकिंग प्रक्रिया',
        back: 'वापस', next: 'आगे',
        confirmPay: 'बुकिंग की पुष्टि करें',
        loginTitle: 'लॉगिन', signupTitle: 'खाता बनाएं',
        menuModalTitle: 'हमारा मेनू', menuModalSubtitle: 'असली कश्मीरी व्यंजन',
    },
    ur: {
        navMenu: 'مینو', navExplore: 'گیلری', navLocations: 'مقامات',
        login: 'لاگ ان', signup: 'سائن اپ',
        greeting: 'آداب',
        heroSubtitle: 'آپ کے خاص لمحات کے لیے پریمیم کیٹرنگ',
        heroTagline: 'اصل کشمیری ذائقہ · بہترین خدمت · یادگار تقریبات',
        heroCta: 'اپنا ایونٹ بک کریں',
        exploreServices: 'خدمات دیکھیں',
        servicesTitle: 'ہماری خدمات', servicesSubtitle: 'ہر موقع کے لیے موزوں کیٹرنگ',
        serviceMarriage: 'شادی کیٹرنگ', serviceBirthday: 'سالگرہ کیٹرنگ',
        serviceCorporate: 'کارپوریٹ کیٹرنگ', serviceBbq: 'باربیکیو کیٹرنگ',
        seeMore: 'مزید دیکھیں',
        galleryTitle: 'ایونٹ گیلری', gallerySubtitle: 'ہمارے تقریبات کی جھلک',
        locationsTitle: 'ہمارے مقامات', locationsSubtitle: 'پورے ہندوستان میں',
        bookingTitle: 'ایونٹ بک کریں', bookingSubtitle: 'آسان اور شفاف بکنگ',
        back: 'واپس', next: 'آگے',
        confirmPay: 'بکنگ کی تصدیق کریں',
        loginTitle: 'لاگ ان', signupTitle: 'اکاؤنٹ بنائیں',
        menuModalTitle: 'ہمارا مینو', menuModalSubtitle: 'اصل کشمیری کھانا',
    },
    pa: {
        navMenu: 'ਮੀਨੂ', navExplore: 'ਗੈਲਰੀ', navLocations: 'ਟਿਕਾਣੇ',
        login: 'ਲੌਗਇਨ', signup: 'ਸਾਈਨ ਅੱਪ',
        greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
        heroSubtitle: 'ਤੁਹਾਡੇ ਖਾਸ ਪਲਾਂ ਲਈ ਪ੍ਰੀਮੀਅਮ ਕੈਟਰਿੰਗ',
        heroTagline: 'ਅਸਲ ਕਸ਼ਮੀਰੀ ਸੁਆਦ · ਸ਼ਾਨਦਾਰ ਸੇਵਾ · ਯਾਦਗਾਰ ਸਮਾਗਮ',
        heroCta: 'ਆਪਣਾ ਇਵੈਂਟ ਬੁੱਕ ਕਰੋ',
        exploreServices: 'ਸੇਵਾਵਾਂ ਦੇਖੋ',
        servicesTitle: 'ਸਾਡੀਆਂ ਸੇਵਾਵਾਂ', servicesSubtitle: 'ਹਰ ਮੌਕੇ ਲਈ ਕੈਟਰਿੰਗ',
        serviceMarriage: 'ਵਿਆਹ ਕੈਟਰਿੰਗ', serviceBirthday: 'ਜਨਮਦਿਨ ਕੈਟਰਿੰਗ',
        serviceCorporate: 'ਕਾਰਪੋਰੇਟ ਕੈਟਰਿੰਗ', serviceBbq: 'ਬਾਰਬੀਕਿਊ ਕੈਟਰਿੰਗ',
        seeMore: 'ਹੋਰ ਦੇਖੋ',
        galleryTitle: 'ਇਵੈਂਟ ਗੈਲਰੀ', gallerySubtitle: 'ਸਾਡੇ ਸਮਾਗਮਾਂ ਦੀ ਝਲਕ',
        locationsTitle: 'ਸਾਡੇ ਟਿਕਾਣੇ', locationsSubtitle: 'ਪੂਰੇ ਭਾਰਤ ਵਿੱਚ',
        bookingTitle: 'ਆਪਣਾ ਇਵੈਂਟ ਬੁੱਕ ਕਰੋ', bookingSubtitle: 'ਸਰਲ ਅਤੇ ਪਾਰਦਰਸ਼ੀ ਬੁਕਿੰਗ',
        back: 'ਵਾਪਸ', next: 'ਅੱਗੇ',
        confirmPay: 'ਬੁਕਿੰਗ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
        loginTitle: 'ਲੌਗਇਨ', signupTitle: 'ਖਾਤਾ ਬਣਾਓ',
        menuModalTitle: 'ਸਾਡਾ ਮੀਨੂ', menuModalSubtitle: 'ਅਸਲ ਕਸ਼ਮੀਰੀ ਪਕਵਾਨ',
    },
};

function applyLanguage(lang) {
    const t = siteTranslations[lang] || siteTranslations.en;
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        if (t[key]) el.textContent = t[key];
    });
    document.querySelectorAll('[data-placeholder-key]').forEach(el => {
        const key = el.dataset.placeholderKey;
        if (t[key]) el.placeholder = t[key];
    });
    // RTL for Urdu
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
}

function changeLanguage(lang) {
    appState.language = lang;
    saveState();
    applyLanguage(lang);
}

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    // Restore language
    const lang = appState.language || 'en';
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) langSelect.value = lang;
    applyLanguage(lang);

    // Restore auth UI
    if (appState.isLoggedIn && appState.currentUser) updateAuthUI();

    // Scroll animations
    setupScrollAnimations();
    setupScrollListener();
    setMinDate();

    // Load gallery from API
    loadHomepageGallery();

    // Mark hero as loaded for CSS transition
    setTimeout(() => document.querySelector('.hero')?.classList.add('loaded'), 100);
});

/* ── SCROLL HEADER ─────────────────────────────────────────── */
function setupScrollListener() {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
}

/* ── SCROLL ANIMATIONS ─────────────────────────────────────── */
function setupScrollAnimations() {
    const targets = document.querySelectorAll('.service-card, .gallery-item, .location-card, .review-card');
    if (!targets.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 560ms ease-out, transform 560ms ease-out';
        observer.observe(el);
    });
}

/* ── GALLERY ───────────────────────────────────────────────── */
async function loadHomepageGallery() {
    try {
        const res = await fetch('/api/gallery');
        if (!res.ok) return; // keep the static HTML fallback
        const items = await res.json();
        if (!items.length) return;

        const container = document.getElementById('homepage-gallery-list');
        if (!container) return;

        container.innerHTML = items.slice(0, 6).map((item, i) => `
            <div class="gallery-item" role="listitem"
                onclick="openLightbox(this)"
                tabindex="0"
                onkeydown="if(event.key==='Enter')openLightbox(this)"
                aria-label="View event photo ${i + 1}">
                <img src="${escHtml(item.image_url || item.imageUrl || '')}"
                     alt="${escHtml(item.title || 'Event photo')}"
                     loading="lazy">
                <div class="gallery-overlay" aria-hidden="true">
                    <span class="view-icon">⤢</span>
                </div>
            </div>
        `).join('');

        setupScrollAnimations();
    } catch (_) {
        // silently fall back to static HTML markup
    }
}

/* ── MENU MODAL ────────────────────────────────────────────── */
async function openMenuModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('menuModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const container = document.getElementById('menu-modal-list');
    container.innerHTML = '<p class="menu-loading-state">Loading menu…</p>';

    try {
        const res = await fetch('/api/menu');
        const items = await res.json();
        renderMenuGrid(container, items, false);
    } catch (err) {
        container.innerHTML = '<p class="menu-loading-state">Could not load menu. Please try again.</p>';
    }
}

function closeMenuModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('menuModal')?.classList.remove('active');
    document.body.style.overflow = '';
}

function renderMenuGrid(container, items, selectable = false, selectedIds = []) {
    if (!items.length) {
        container.innerHTML = '<p class="menu-loading-state">No menu items available.</p>';
        return;
    }

    // Group by category → type
    const grouped = {};
    items.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = {};
        if (!grouped[item.category][item.type]) grouped[item.category][item.type] = [];
        grouped[item.category][item.type].push(item);
    });

    const catOrder = ['breakfast', 'lunch', 'dinner'];
    container.innerHTML = catOrder
        .filter(cat => grouped[cat])
        .map(cat => {
            const typesSections = Object.entries(grouped[cat]).map(([type, catItems]) => `
                <div class="menu-course-group">
                    <p class="menu-course-label">${type === 'main' ? 'Main Course' : 'Snacks & Starters'}</p>
                    <div class="menu-items-list">
                        ${catItems.map(item => renderMenuItem(item, selectable, selectedIds)).join('')}
                    </div>
                </div>
            `).join('');

            return `
                <div class="menu-category-section">
                    <h3>${capitalize(cat)}</h3>
                    ${typesSections}
                </div>
            `;
        }).join('');
}

function renderMenuItem(item, selectable, selectedIds) {
    const isSelected = selectedIds.includes(item.id);
    const selectableClass = selectable ? ' selectable' : '';
    const selectedClass = isSelected ? ' selected' : '';
    const onclick = selectable
        ? `onclick="toggleMenuSelection('${escHtml(item.id)}')" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' ')toggleMenuSelection('${escHtml(item.id)}')"`
        : '';
    return `
        <div class="menu-item-card${selectableClass}${selectedClass}" id="menu-card-${escHtml(item.id)}"
             role="${selectable ? 'checkbox' : 'article'}"
             aria-checked="${isSelected}" ${onclick}>
            <h4>${escHtml(item.name)}</h4>
            <p>${escHtml(item.description || '')}</p>
            <div class="menu-item-price">${formatCurrency(item.price)}</div>
        </div>
    `;
}

/* ── BOOKING MODAL ─────────────────────────────────────────── */
function openBookingModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('bookingModal')?.classList.remove('active');
    document.body.style.overflow = '';
}

function startBookingForService(serviceType) {
    openBookingModal();
    setTimeout(() => {
        const select = document.getElementById('functionType');
        if (select) {
            select.value = serviceType;
            select.dispatchEvent(new Event('change'));
        }
        updateFunctionTypeChips(serviceType);
        updateBookingOverview();
    }, 100);
}

function handleServiceCardKeydown(event, serviceType) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        startBookingForService(serviceType);
    }
}

/* ── MOBILE MENU ───────────────────────────────────────────── */
function toggleMobileMenu() {
    const nav = document.getElementById('nav-menu-mobile');
    const btn = document.querySelector('.menu-toggle');
    if (!nav || !btn) return;
    const isOpen = !nav.hidden;
    nav.hidden = isOpen;
    btn.setAttribute('aria-expanded', String(!isOpen));
}

/* ── LIGHTBOX ──────────────────────────────────────────────── */
function openLightbox(element) {
    const img = element.querySelector('img');
    if (!img) return;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox')?.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeLightbox();
        closeMenuModal();
        closeBookingModal();
        closeLoginModal();
        closeSignupModal();
        document.body.style.overflow = '';
    }
});

/* ── DATE UTILITY ──────────────────────────────────────────── */
function setMinDate() {
    const input = document.getElementById('eventDate');
    if (input) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        input.min = tomorrow.toISOString().split('T')[0];
    }
}

function formatDate(dateString) {
    if (!dateString) return '—';
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? dateString
        : d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* ── NOTIFICATIONS ─────────────────────────────────────────── */
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = `notification ${type}`;
    el.textContent = message;
    container.appendChild(el);

    setTimeout(() => {
        el.style.animation = `slideOutRight ${getComputedStyle(document.documentElement).getPropertyValue('--duration-base')} ease forwards`;
        setTimeout(() => el.remove(), 350);
    }, 3500);
}

/* ── CURRENCY ──────────────────────────────────────────────── */
function formatCurrency(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

/* ── HELPERS ───────────────────────────────────────────────── */
function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function handleError(err, userMessage) {
    console.error(err);
    showNotification(userMessage || 'Something went wrong. Please try again.', 'error');
}

function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Stubs for functions called before files load
function updateFunctionTypeChips() {}
function updateBookingOverview() {}
