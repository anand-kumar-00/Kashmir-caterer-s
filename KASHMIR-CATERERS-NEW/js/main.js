/* ================================
   MAIN JAVASCRIPT
   ================================ */

// Global state
const appState = {
    isLoggedIn: false,
    userRole: null, // 'customer' or 'employee'
    currentLanguage: 'en',
    bookingData: {
        eventDate: null,
        menu: [],
        customerDetails: null,
        requirements: null,
    },
};

const defaultHomepageMenuItems = [
    { id: 'breakfast-kahwa', name: 'Kashmiri Kahwa', category: 'breakfast', type: 'snacks', price: 1800, description: 'Traditional welcome beverage' },
    { id: 'breakfast-bakerkhani', name: 'Bakerkhani', category: 'breakfast', type: 'snacks', price: 2200, description: 'Flaky bakery special' },
    { id: 'breakfast-harissa-bites', name: 'Harissa Bites', category: 'breakfast', type: 'snacks', price: 2600, description: 'Chef-served mini portions' },
    { id: 'breakfast-nadru-yakhni', name: 'Nadru Yakhni', category: 'breakfast', type: 'main', price: 3400, description: 'Lotus stem yogurt curry' },
    { id: 'breakfast-chaman-qaliya', name: 'Chaman Qaliya', category: 'breakfast', type: 'main', price: 3200, description: 'Paneer in saffron gravy' },
    { id: 'lunch-seekh-kebab', name: 'Seekh Kebab', category: 'lunch', type: 'snacks', price: 3000, description: 'Chargrilled signature starter' },
    { id: 'lunch-paneer-tikka', name: 'Paneer Tikka', category: 'lunch', type: 'snacks', price: 2800, description: 'Smoky vegetarian classic' },
    { id: 'lunch-rogan-josh', name: 'Rogan Josh', category: 'lunch', type: 'main', price: 4200, description: 'Slow-cooked Kashmiri mutton curry' },
    { id: 'lunch-gushtaba', name: 'Gushtaba', category: 'lunch', type: 'main', price: 4500, description: 'Royal meatball delicacy' },
    { id: 'dinner-mutton-shami', name: 'Mutton Shami Kebab', category: 'dinner', type: 'snacks', price: 3400, description: 'Soft kebabs with rich aroma' },
    { id: 'dinner-cheese-cigars', name: 'Cheese Cigars', category: 'dinner', type: 'snacks', price: 2600, description: 'Crisp party starter' },
    { id: 'dinner-rista', name: 'Rista', category: 'dinner', type: 'main', price: 4300, description: 'Classic red-gravy meatballs' },
    { id: 'dinner-yakhni', name: 'Mutton Yakhni', category: 'dinner', type: 'main', price: 4100, description: 'Aromatic yogurt-based curry' },
];

const defaultHomepageGalleryItems = [
    { id: 'gallery-1', title: 'Wedding Service Setup', image: '/KASHMIR-CATERERS-NEW/images/gallery-1.png' },
    { id: 'gallery-2', title: 'Celebration Decor', image: '/KASHMIR-CATERERS-NEW/images/gallery-2.png' },
    { id: 'gallery-3', title: 'Signature Dining Layout', image: '/KASHMIR-CATERERS-NEW/images/gallery-3.png' },
    { id: 'gallery-4', title: 'Premium Buffet Arrangement', image: '/KASHMIR-CATERERS-NEW/images/gallery-4.png' },
    { id: 'gallery-5', title: 'Event Service Team', image: '/KASHMIR-CATERERS-NEW/images/gallery-5.png' },
];

const defaultHomepageLocations = [
    { id: 'office', name: 'Office Location', type: 'office', address: 'Srinagar, Jammu & Kashmir', fullAddress: 'Main Office, Lal Chowk, Srinagar', lat: 34.083651, lng: 74.797371 },
    { id: 'current-event', name: 'Current Event', type: 'event', address: 'Mumbai, Maharashtra', fullAddress: 'Royal Grand Hotel Ballroom, Mumbai', lat: 19.076, lng: 72.8777 },
    { id: 'upcoming-event', name: 'Upcoming Event', type: 'event', address: 'Delhi, Delhi', fullAddress: 'Garden Palace Convention Center, Delhi', lat: 28.6139, lng: 77.2090 },
];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    renderHomepageContent();
    setupScrollAnimations();
    setupScrollListener();
    setMinDate();
});

window.addEventListener('storage', (event) => {
    if (!event.key || ['menuItems', 'galleryItems', 'locations'].includes(event.key)) {
        renderHomepageContent();
    }
});

window.addEventListener('focus', renderHomepageContent);

function initializeApp() {
    console.log('Initializing Kashmiri Caterers App');
    ensureHomepageData();
    
    // Check localStorage for saved state
    const savedState = localStorage.getItem('appState');
    if (savedState) {
        Object.assign(appState, JSON.parse(savedState));
    }
    
    // Setup language selector
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });

    document.getElementById('languageSelect').value = appState.currentLanguage || 'en';
    applyLanguage(appState.currentLanguage || 'en');
}

function ensureHomepageData() {
    if (!JSON.parse(localStorage.getItem('menuItems') || '[]').length) {
        localStorage.setItem('menuItems', JSON.stringify(defaultHomepageMenuItems));
    }

    if (!JSON.parse(localStorage.getItem('galleryItems') || '[]').length) {
        localStorage.setItem('galleryItems', JSON.stringify(defaultHomepageGalleryItems));
    }

    if (!JSON.parse(localStorage.getItem('locations') || '[]').length) {
        localStorage.setItem('locations', JSON.stringify(defaultHomepageLocations));
    }
}

function renderHomepageContent() {
    renderMenuModalContent();
    renderHomepageGallery();
    if (typeof renderLocationsList === 'function') {
        renderLocationsList();
    }
    setupScrollAnimations();
}

function renderMenuModalContent() {
    const menuContainer = document.getElementById('menu-modal-list');
    if (!menuContainer) {
        return;
    }

    const groupedMenu = getGroupedMenuData();

    if (!groupedMenu.length) {
        menuContainer.innerHTML = `<div class="menu-loading-state">${getTranslationValue('menuEmpty')}</div>`;
        return;
    }

    menuContainer.innerHTML = groupedMenu
        .map(
            (section) => `
                <section class="menu-modal-section">
                    <div class="menu-modal-heading">
                        <h3>${section.label}</h3>
                    </div>
                    <div class="menu-modal-courses">
                        ${section.courses
                            .map(
                                (course) => `
                                    <article class="menu-modal-course">
                                        <div class="menu-course-title">${course.label}</div>
                                        <div class="menu-modal-items">
                                            ${course.items
                                                .map(
                                                    (item) => `
                                                        <div class="menu-modal-item">
                                                            <div>
                                                                <strong>${item.name}</strong>
                                                                <p>${item.description || getTranslationValue('chefCurated')}</p>
                                                            </div>
                                                            <span>Rs ${Number(item.price || 0).toLocaleString('en-IN')}</span>
                                                        </div>
                                                    `
                                                )
                                                .join('')}
                                        </div>
                                    </article>
                                `
                            )
                            .join('')}
                    </div>
                </section>
            `
        )
        .join('');
}

function getGroupedMenuData() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const categories = [
        { key: 'breakfast', label: getTranslationValue('menuCategoryBreakfast') },
        { key: 'lunch', label: getTranslationValue('menuCategoryLunch') },
        { key: 'dinner', label: getTranslationValue('menuCategoryDinner') },
    ];
    const courses = [
        { key: 'snacks', label: getTranslationValue('menuCourseSnacks') },
        { key: 'main', label: getTranslationValue('menuCourseMain') },
    ];

    return categories
        .map((category) => ({
            label: category.label,
            courses: courses
                .map((course) => ({
                    label: course.label,
                    items: menuItems.filter(
                        (item) => item.category === category.key && normalizeMenuType(item.type) === course.key
                    ),
                }))
                .filter((course) => course.items.length > 0),
        }))
        .filter((section) => section.courses.length > 0);
}

function openMenuModal(event) {
    if (event) {
        event.preventDefault();
    }

    renderMenuModalContent();
    const modal = document.getElementById('menuModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeMenuModal(event) {
    if (event && event.target !== event.currentTarget) {
        return;
    }

    const modal = document.getElementById('menuModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function renderHomepageGallery() {
    const galleryContainer = document.getElementById('homepage-gallery-list');
    if (!galleryContainer) {
        return;
    }

    const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');

    if (!galleryItems.length) {
        galleryContainer.innerHTML = '<div class="menu-loading-state">No gallery items added yet.</div>';
        return;
    }

    galleryContainer.innerHTML = galleryItems
        .map(
            (item) => `
                <div class="gallery-item" onclick="openLightbox(this)">
                    <img src="${item.image}" alt="${item.title || 'Gallery image'}">
                    <div class="gallery-overlay">
                        <span class="view-icon">View</span>
                    </div>
                </div>
            `
        )
        .join('');
}

function formatLabel(value) {
    return String(value || '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMenuType(value) {
    const normalized = normalizeMenuType(value);
    return normalized === 'main' ? 'Main Course' : 'Snacks';
}

function normalizeMenuType(value) {
    const normalized = String(value || '').toLowerCase();
    return normalized.includes('main') ? 'main' : 'snacks';
}

// ================================
// LANGUAGE SUPPORT
// ================================

const translations = {
    en: {
        namaste: 'Namaste',
        adaab: 'Adaab',
        hello: 'Hello',
        booking: 'Book Your Event',
        selectDate: 'Select Event Date',
        selectMenu: 'Select Menu',
        addRequirements: 'Additional Requirements',
        review: 'Review Your Booking',
    },
    hi: {
        namaste: 'नमस्ते',
        adaab: 'अदब',
        hello: 'नमस्कार',
    },
    ur: {
        namaste: 'السلام علیکم',
        adaab: 'ادب',
        hello: 'سلام',
    },
    pa: {
        namaste: 'ਨਮਸਕਾਰ',
        adaab: 'ਅਦਾਬ',
        hello: 'ਨਮਸਤੇ',
    },
};

function changeLanguage(lang) {
    appState.currentLanguage = lang;
    saveState();
    // Note: Full language implementation would require updating all text content
    console.log(`Language changed to: ${lang}`);
}

const siteTranslations = {
    en: {
        dir: 'ltr',
        greeting: 'Namaste',
        navMenu: 'Menu',
        navBooking: 'Booking',
        navExplore: 'Explore',
        login: 'Login',
        signup: 'Signup',
        heroSubtitle: 'Premium Catering for Your Most Special Moments',
        heroTagline: 'Authentic Kashmiri Flavors | Impeccable Service | Unforgettable Events',
        heroCta: 'Book Your Event',
        servicesTitle: 'Our Services',
        servicesSubtitle: 'Tailored catering experiences for every occasion',
        serviceMarriage: 'Marriage Catering',
        serviceBirthday: 'Birthday Catering',
        serviceCorporate: 'Corporate Catering',
        serviceBbq: 'Barbecue Catering',
        galleryTitle: 'Event Gallery',
        gallerySubtitle: 'Photos and highlights managed from the admin dashboard',
        locationsTitle: 'Our Locations',
        locationsSubtitle: 'Find us at multiple locations across the city',
        bookingTitle: 'Book Your Event',
        bookingSubtitle: 'Simple, transparent booking process',
        step1Title: 'Select Event Date',
        step2Title: 'Select Menu',
        step3Title: 'Customer Details',
        step4Title: 'Review Your Booking',
        customerNameLabel: 'Full Name',
        customerEmailLabel: 'Email Address',
        customerPhoneLabel: 'Phone Number',
        guestCountLabel: 'Expected Guests',
        requirementsLabel: 'Additional Requirements',
        customerNamePlaceholder: 'Enter your full name',
        customerEmailPlaceholder: 'Enter your email address',
        customerPhonePlaceholder: 'Enter your phone number',
        guestCountPlaceholder: 'How many guests are expected?',
        requirementsPlaceholder: 'Enter any special requirements, dietary restrictions, or additional notes...',
        menuSelectionSubtitle: 'Choose dishes by meal and course. Each item shows its rate so customers can plan clearly.',
        next: 'Next',
        back: 'Back',
        reviewDate: 'Event Date:',
        reviewMenu: 'Selected Menu:',
        reviewRequirements: 'Special Requirements:',
        reviewTotal: 'Estimated Total:',
        confirmPay: 'Confirm & Pay',
        menuModalTitle: 'Our Menu',
        menuModalSubtitle: 'Breakfast, lunch, and dinner menu managed from the dashboard.',
        menuCategoryBreakfast: 'Breakfast',
        menuCategoryLunch: 'Lunch',
        menuCategoryDinner: 'Dinner',
        menuCourseSnacks: 'Snacks',
        menuCourseMain: 'Main Course',
        menuEmpty: 'No menu items available yet.',
        chefCurated: 'Chef curated selection',
        loginTitle: 'Login',
        loginIdentifierPlaceholder: 'Email or Employee ID',
        loginPasswordPlaceholder: 'Password',
        loginToggleText: "Don't have an account?",
        signupTitle: 'Signup',
        signupNamePlaceholder: 'Full Name',
        signupEmailPlaceholder: 'Email',
        signupPasswordPlaceholder: 'Password',
        signupConfirmPlaceholder: 'Confirm Password',
        signupToggleText: 'Already have an account?',
    },
    hi: {
        dir: 'ltr',
        greeting: 'नमस्ते',
        navMenu: 'मेन्यू',
        navBooking: 'बुकिंग',
        navExplore: 'एक्सप्लोर',
        login: 'लॉगिन',
        signup: 'साइनअप',
        heroSubtitle: 'आपके खास पलों के लिए प्रीमियम कैटरिंग',
        heroTagline: 'असली कश्मीरी स्वाद | बेहतरीन सेवा | यादगार आयोजन',
        heroCta: 'अपना इवेंट बुक करें',
        servicesTitle: 'हमारी सेवाएं',
        servicesSubtitle: 'हर अवसर के लिए खास कैटरिंग अनुभव',
        serviceMarriage: 'शादी कैटरिंग',
        serviceBirthday: 'जन्मदिन कैटरिंग',
        serviceCorporate: 'कॉरपोरेट कैटरिंग',
        serviceBbq: 'बारबेक्यू कैटरिंग',
        galleryTitle: 'इवेंट गैलरी',
        gallerySubtitle: 'एडमिन डैशबोर्ड से मैनेज की गई तस्वीरें और झलकियां',
        locationsTitle: 'हमारी लोकेशन',
        locationsSubtitle: 'शहर में हमारी लोकेशन देखें',
        bookingTitle: 'अपना इवेंट बुक करें',
        bookingSubtitle: 'सरल और पारदर्शी बुकिंग प्रक्रिया',
        step1Title: 'इवेंट की तारीख चुनें',
        step2Title: 'मेन्यू चुनें',
        step3Title: 'ग्राहक विवरण',
        step4Title: 'अपनी बुकिंग देखें',
        customerNameLabel: 'पूरा नाम',
        customerEmailLabel: 'ईमेल पता',
        customerPhoneLabel: 'फोन नंबर',
        guestCountLabel: 'अनुमानित मेहमान',
        requirementsLabel: 'अतिरिक्त आवश्यकताएं',
        customerNamePlaceholder: 'अपना पूरा नाम दर्ज करें',
        customerEmailPlaceholder: 'अपना ईमेल पता दर्ज करें',
        customerPhonePlaceholder: 'अपना फोन नंबर दर्ज करें',
        guestCountPlaceholder: 'कितने मेहमान आने वाले हैं?',
        requirementsPlaceholder: 'कोई विशेष आवश्यकताएं, डाइट संबंधी जानकारी या नोट्स लिखें...',
        menuSelectionSubtitle: 'भोजन और कोर्स के हिसाब से डिश चुनें। हर आइटम के साथ उसका रेट दिखेगा।',
        next: 'आगे',
        back: 'वापस',
        reviewDate: 'इवेंट तिथि:',
        reviewMenu: 'चुना गया मेन्यू:',
        reviewRequirements: 'विशेष आवश्यकताएं:',
        reviewTotal: 'अनुमानित कुल:',
        confirmPay: 'कन्फर्म और पे',
        menuModalTitle: 'हमारा मेन्यू',
        menuModalSubtitle: 'ब्रेकफास्ट, लंच और डिनर मेन्यू डैशबोर्ड से मैनेज होता है।',
        menuCategoryBreakfast: 'ब्रेकफास्ट',
        menuCategoryLunch: 'लंच',
        menuCategoryDinner: 'डिनर',
        menuCourseSnacks: 'स्नैक्स',
        menuCourseMain: 'मेन कोर्स',
        menuEmpty: 'अभी कोई मेन्यू आइटम उपलब्ध नहीं है।',
        chefCurated: 'शेफ द्वारा चुना गया विकल्प',
        loginTitle: 'लॉगिन',
        loginIdentifierPlaceholder: 'ईमेल या कर्मचारी आईडी',
        loginPasswordPlaceholder: 'पासवर्ड',
        loginToggleText: 'क्या आपका अकाउंट नहीं है?',
        signupTitle: 'साइनअप',
        signupNamePlaceholder: 'पूरा नाम',
        signupEmailPlaceholder: 'ईमेल',
        signupPasswordPlaceholder: 'पासवर्ड',
        signupConfirmPlaceholder: 'पासवर्ड कन्फर्म करें',
        signupToggleText: 'क्या आपका अकाउंट पहले से है?',
    },
    ur: {
        dir: 'rtl',
        greeting: 'السلام علیکم',
        navMenu: 'مینو',
        navBooking: 'بکنگ',
        navExplore: 'دیکھیں',
        login: 'لاگ اِن',
        signup: 'سائن اپ',
        heroSubtitle: 'آپ کے خاص لمحات کے لیے پریمیم کیٹرنگ',
        heroTagline: 'اصل کشمیری ذائقے | بہترین سروس | یادگار تقریبات',
        heroCta: 'اپنا ایونٹ بک کریں',
        servicesTitle: 'ہماری خدمات',
        servicesSubtitle: 'ہر موقع کے لیے خاص کیٹرنگ تجربہ',
        serviceMarriage: 'شادی کیٹرنگ',
        serviceBirthday: 'سالگرہ کیٹرنگ',
        serviceCorporate: 'کارپوریٹ کیٹرنگ',
        serviceBbq: 'باربی کیو کیٹرنگ',
        galleryTitle: 'ایونٹ گیلری',
        gallerySubtitle: 'ایڈمن ڈیش بورڈ سے منیج کی گئی تصاویر اور جھلکیاں',
        locationsTitle: 'ہماری لوکیشنز',
        locationsSubtitle: 'شہر میں ہماری لوکیشنز دیکھیں',
        bookingTitle: 'اپنا ایونٹ بک کریں',
        bookingSubtitle: 'سادہ اور شفاف بکنگ عمل',
        step1Title: 'ایونٹ کی تاریخ منتخب کریں',
        step2Title: 'مینو منتخب کریں',
        step3Title: 'گاہک کی تفصیل',
        step4Title: 'اپنی بکنگ دیکھیں',
        customerNameLabel: 'پورا نام',
        customerEmailLabel: 'ای میل پتہ',
        customerPhoneLabel: 'فون نمبر',
        guestCountLabel: 'متوقع مہمان',
        requirementsLabel: 'اضافی ضروریات',
        customerNamePlaceholder: 'اپنا پورا نام درج کریں',
        customerEmailPlaceholder: 'اپنا ای میل پتہ درج کریں',
        customerPhonePlaceholder: 'اپنا فون نمبر درج کریں',
        guestCountPlaceholder: 'کتنے مہمان متوقع ہیں؟',
        requirementsPlaceholder: 'کسی بھی خصوصی ضروریات، غذائی پابندیوں یا نوٹس یہاں لکھیں...',
        menuSelectionSubtitle: 'کھانے اور کورس کے حساب سے ڈش منتخب کریں۔ ہر آئٹم کے ساتھ اس کی قیمت دکھائی جاتی ہے۔',
        next: 'اگلا',
        back: 'واپس',
        reviewDate: 'ایونٹ تاریخ:',
        reviewMenu: 'منتخب مینو:',
        reviewRequirements: 'خصوصی ضروریات:',
        reviewTotal: 'کل تخمینہ:',
        confirmPay: 'تصدیق اور ادائیگی',
        menuModalTitle: 'ہمارا مینو',
        menuModalSubtitle: 'بریک فاسٹ، لنچ اور ڈنر مینو ڈیش بورڈ سے منیج ہوتا ہے۔',
        menuCategoryBreakfast: 'بریک فاسٹ',
        menuCategoryLunch: 'لنچ',
        menuCategoryDinner: 'ڈنر',
        menuCourseSnacks: 'اسنیکس',
        menuCourseMain: 'مین کورس',
        menuEmpty: 'ابھی کوئی مینو آئٹم دستیاب نہیں ہے۔',
        chefCurated: 'شیف کی منتخب پیشکش',
        loginTitle: 'لاگ اِن',
        loginIdentifierPlaceholder: 'ای میل یا ملازم آئی ڈی',
        loginPasswordPlaceholder: 'پاس ورڈ',
        loginToggleText: 'اکاؤنٹ نہیں ہے؟',
        signupTitle: 'سائن اپ',
        signupNamePlaceholder: 'پورا نام',
        signupEmailPlaceholder: 'ای میل',
        signupPasswordPlaceholder: 'پاس ورڈ',
        signupConfirmPlaceholder: 'پاس ورڈ دوبارہ لکھیں',
        signupToggleText: 'کیا آپ کا اکاؤنٹ پہلے سے موجود ہے؟',
    },
};

function getTranslationValue(key) {
    const language = siteTranslations[appState.currentLanguage] || siteTranslations.en;
    return language[key] || siteTranslations.en[key] || '';
}

function applyLanguage(lang) {
    const language = siteTranslations[lang] || siteTranslations.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = language.dir || 'ltr';
    document.body.classList.toggle('rtl-language', (language.dir || 'ltr') === 'rtl');

    document.querySelectorAll('[data-key]').forEach((element) => {
        const key = element.dataset.key;
        if (language[key]) {
            element.textContent = language[key];
        }
    });

    document.querySelectorAll('[data-placeholder-key]').forEach((element) => {
        const key = element.dataset.placeholderKey;
        if (language[key]) {
            element.placeholder = language[key];
        }
    });
}

function changeLanguage(lang) {
    appState.currentLanguage = lang;
    saveState();
    applyLanguage(lang);
    renderMenuModalContent();
}

// ================================
// LOCAL STORAGE
// ================================

function saveState() {
    localStorage.setItem('appState', JSON.stringify(appState));
}

// ================================
// NAVIGATION & SCROLLING
// ================================

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = 70;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: elementPosition - headerHeight,
            behavior: 'smooth',
        });
    }
}

let scrollTimeout;
function setupScrollListener() {
    const header = document.querySelector('.header');
    
    document.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Trigger animations for visible elements
        scrollTimeout = setTimeout(() => {
            animateOnScroll();
        }, 50);
    });
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .gallery-item, .location-card');
    
    elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible && !el.classList.contains('animated')) {
            el.classList.add('animated');
        }
    });
}

// ================================
// MOBILE MENU
// ================================

function toggleMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ================================
// SCROLL ANIMATIONS
// ================================

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
    });
    
    // Observe service cards
    document.querySelectorAll('.service-card').forEach((card) => {
        observer.observe(card);
    });
    
    // Observe gallery items
    document.querySelectorAll('.gallery-item').forEach((item) => {
        observer.observe(item);
    });
    
    // Observe location cards
    document.querySelectorAll('.location-card').forEach((card) => {
        observer.observe(card);
    });
}

// ================================
// UTILITY FUNCTIONS
// ================================

function setMinDate() {
    const dateInput = document.getElementById('eventDate');
    const today = new Date();
    const minDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    
    const year = minDate.getFullYear();
    const month = String(minDate.getMonth() + 1).padStart(2, '0');
    const day = String(minDate.getDate()).padStart(2, '0');
    
    dateInput.min = `${year}-${month}-${day}`;
    dateInput.value = `${year}-${month}-${day}`;
}

function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function showNotification(message, type = 'success') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // You can implement a toast notification system here
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ================================
// ERROR HANDLING
// ================================

function handleError(error, userMessage) {
    console.error('Error:', error);
    showNotification(userMessage, 'error');
}

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});
