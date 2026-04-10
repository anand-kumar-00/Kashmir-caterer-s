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
        requirements: null,
    },
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupScrollAnimations();
    setupScrollListener();
    setMinDate();
});

function initializeApp() {
    console.log('Initializing Kashmiri Caterers App');
    
    // Check localStorage for saved state
    const savedState = localStorage.getItem('appState');
    if (savedState) {
        Object.assign(appState, JSON.parse(savedState));
    }
    
    // Setup language selector
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
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