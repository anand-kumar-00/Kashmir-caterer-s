const showcaseServices = [
    {
        title: 'Marriage Catering',
        category: 'indoor',
        bookingType: 'Marriage Catering',
        image: 'images/service-marriage.png',
        description: 'Grand indoor wedding dining with ceremonial setup, wazwan service, and guest coordination.',
        highlights: ['Banquet halls', 'Wazwan counters', 'Guest service'],
    },
    {
        title: 'Birthday Catering',
        category: 'indoor',
        bookingType: 'Birthday Catering',
        image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=900',
        description: 'Colorful party menus for kids and adults with dessert corners, snacks, and fast service flow.',
        highlights: ['Dessert tables', 'Kids menu', 'Live counters'],
    },
    {
        title: 'Corporate Catering',
        category: 'indoor',
        bookingType: 'Corporate Catering',
        image: 'images/service-corporate.png',
        description: 'Professional event catering for conferences, launches, office celebrations, and executive dinners.',
        highlights: ['Buffet setup', 'Tea service', 'Formal presentation'],
    },
    {
        title: 'Engagement Catering',
        category: 'indoor',
        bookingType: 'Engagement Catering',
        image: 'images/gallery-3.png',
        description: 'Elegant indoor hosting for ring ceremonies, family meetups, and premium seated meals.',
        highlights: ['Family dining', 'Premium decor', 'Starter service'],
    },
    {
        title: 'BBQ Catering',
        category: 'outdoor',
        bookingType: 'BBQ Catering',
        image: 'images/service-bbq.png',
        description: 'Live grill stations and smoky outdoor menus for evening functions, lawn events, and private parties.',
        highlights: ['Live grill', 'Evening setup', 'Open-air service'],
    },
    {
        title: 'Outdoor Wedding Catering',
        category: 'outdoor',
        bookingType: 'Outdoor Catering',
        image: 'images/gallery-1.png',
        description: 'Large-scale garden or lawn catering designed for baraat welcome, feasts, and flexible layouts.',
        highlights: ['Garden venues', 'Entry service', 'Large guest flow'],
    },
    {
        title: 'Reception Catering',
        category: 'outdoor',
        bookingType: 'Reception Catering',
        image: 'images/gallery-4.png',
        description: 'Stylish buffet and plated service for receptions with spacious layouts and smooth guest circulation.',
        highlights: ['Buffet islands', 'Dessert station', 'Night events'],
    },
    {
        title: 'Private Party Catering',
        category: 'outdoor',
        bookingType: 'Private Party Catering',
        image: 'images/gallery-5.png',
        description: 'Flexible menus for rooftop parties, family get-togethers, festive daawats, and custom celebrations.',
        highlights: ['Custom menu', 'Flexible seating', 'Fast service'],
    },
];

const fallbackGalleryImages = [
    { id: 'gallery-1', title: 'Wedding Service Setup', image: 'images/gallery-1.png' },
    { id: 'gallery-2', title: 'Celebration Decor', image: 'images/gallery-2.png' },
    { id: 'gallery-3', title: 'Signature Dining Layout', image: 'images/gallery-3.png' },
    { id: 'gallery-4', title: 'Premium Buffet Arrangement', image: 'images/gallery-4.png' },
    { id: 'gallery-5', title: 'Event Service Team', image: 'images/gallery-5.png' },
];

const showcaseVideoItems = [
    {
        id: 'video-1',
        type: 'video',
        title: 'Outdoor Celebration Reel',
        description: 'A sample moving highlight card for customers who want a richer feel for open-air event energy.',
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        poster: 'images/gallery-2.png',
    },
    {
        id: 'video-2',
        type: 'video',
        title: 'Premium Setup Walkthrough',
        description: 'A second sample video card showing how larger presentation moments can be featured on the page.',
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        poster: 'images/gallery-4.png',
    },
];

document.addEventListener('DOMContentLoaded', () => {
    setupShowcaseFilters();
    renderShowcaseServices();
    renderShowcaseMedia();
});

function setupShowcaseFilters() {
    document.querySelectorAll('.showcase-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.showcase-chip').forEach((button) => button.classList.remove('active'));
            chip.classList.add('active');
            renderShowcaseServices(chip.dataset.filter || 'all');
        });
    });
}

function renderShowcaseServices(filter = 'all') {
    const container = document.getElementById('showcase-services-grid');

    if (!container) {
        return;
    }

    const services = filter === 'all'
        ? showcaseServices
        : showcaseServices.filter((service) => service.category === filter);

    if (!services.length) {
        container.innerHTML = '<div class="showcase-empty-state">No services available for this filter yet.</div>';
        return;
    }

    container.innerHTML = services
        .map(
            (service) => `
                <article class="showcase-service-card">
                    <div class="showcase-service-card__media">
                        <img src="${service.image}" alt="${service.title}">
                        <span class="showcase-service-card__pill">${formatServiceCategory(service.category)}</span>
                    </div>
                    <div class="showcase-service-card__body">
                        <h3>${service.title}</h3>
                        <p>${service.description}</p>
                        <div class="showcase-service-card__meta">
                            ${service.highlights.map((highlight) => `<span>${highlight}</span>`).join('')}
                        </div>
                        <div class="showcase-service-card__actions">
                            <a href="${buildBookingLink(service.bookingType)}" class="btn-primary">Book This Service</a>
                            <a href="#gallery-showcase" class="btn-secondary">See Event Media</a>
                        </div>
                    </div>
                </article>
            `
        )
        .join('');
}

function renderShowcaseMedia() {
    const container = document.getElementById('showcase-media-grid');

    if (!container) {
        return;
    }

    const galleryItems = getGalleryItemsForShowcase()
        .map((item) => ({
            ...item,
            type: 'image',
            description: 'A featured event photo from our current gallery collection.',
        }))
        .concat(showcaseVideoItems);

    container.innerHTML = galleryItems
        .map((item) => renderMediaCard(item))
        .join('');
}

function renderMediaCard(item) {
    const frame = item.type === 'video'
        ? `
            <video controls preload="metadata" poster="${item.poster}">
                <source src="${item.src}" type="video/mp4">
            </video>
        `
        : `<img src="${item.image}" alt="${item.title}">`;

    return `
        <article class="showcase-media-card">
            <div class="showcase-media-card__frame">
                ${frame}
            </div>
            <div class="showcase-media-card__body">
                <span class="showcase-media-card__type">${item.type}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        </article>
    `;
}

function getGalleryItemsForShowcase() {
    const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
    return galleryItems.length ? galleryItems : fallbackGalleryImages;
}

function buildBookingLink(serviceType) {
    return `index.html?service=${encodeURIComponent(serviceType)}#booking`;
}

function formatServiceCategory(category) {
    return category === 'outdoor' ? 'Outdoor' : 'Indoor';
}
