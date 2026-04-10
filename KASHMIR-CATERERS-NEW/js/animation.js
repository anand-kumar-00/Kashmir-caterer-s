/* ================================
   ANIMATIONS & GREETING
   ================================ */

// Greeting animation - cycles through multiple languages
function initializeGreeting() {
    const greetingElement = document.getElementById('greeting');
    const greetings = ['Namaste', 'Adaab', 'Hello'];
    let currentIndex = 0;
    
    function updateGreeting() {
        greetingElement.textContent = greetings[currentIndex];
        currentIndex = (currentIndex + 1) % greetings.length;
    }
    
    // Update greeting every 3 seconds
    setInterval(updateGreeting, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeGreeting();
    initializeParallax();
    initializeHoverEffects();
    initializeButtonAnimations();
});

// ================================
// PARALLAX EFFECT
// ================================

function initializeParallax() {
    const heroBackground = document.querySelector('.hero-background');
    
    document.addEventListener('scroll', () => {
        if (heroBackground) {
            const scrollY = window.scrollY;
            heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    });
}

// ================================
// HOVER EFFECTS
// ================================

function initializeHoverEffects() {
    // Service card hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 300ms ease-out';
        });
    });
    
    // Gallery item hover effects
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item) => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ================================
// BUTTON ANIMATIONS
// ================================

function initializeButtonAnimations() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach((button) => {
        button.addEventListener('click', function(e) {
            // Ripple effect
            createRipple(e, this);
        });
    });
}

function createRipple(event, element) {
    const rect = element.getBoundingClientRect();
    const radius = Math.max(rect.width, rect.height) / 2;
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;
    
    const ripple = document.createElement('span');
    ripple.style.width = ripple.style.height = radius * 2 + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ================================
// SCROLL-TRIGGERED ANIMATIONS
// ================================

const observerConfig = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        } else {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
        }
    });
}, observerConfig);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatingElements = document.querySelectorAll(
        '.service-card, .gallery-item, .location-card'
    );
    
    animatingElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 600ms ease-out, transform 600ms ease-out';
        observer.observe(el);
    });
});

// ================================
// SMOOTH PAGE TRANSITIONS
// ================================

function transitionToPage(url) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 300ms ease-out';
    
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// ================================
// INTERSECTION OBSERVER FOR LAZY LOADING
// ================================

const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            lazyLoadObserver.unobserve(img);
        }
    });
});

// Observe lazy load images
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img[data-src]').forEach((img) => {
        lazyLoadObserver.observe(img);
    });
});

// ================================
// TYPED TEXT EFFECT (Optional)
// ================================

function typeText(element, text, speed = 50) {
    let index = 0;
    element.innerHTML = '';
    
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ================================
// MOUSE FOLLOW EFFECT
// ================================

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // You can use this for interactive cursor effects
});

// ================================
// PERFORMANCE OPTIMIZATION
// ================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for frequent events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}