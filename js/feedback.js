/* ================================
   FEEDBACK & REVIEWS SYSTEM
   ================================ */

let allReviews = [];
let filteredReviews = [];
let currentFilter = 'all';
let reviewsPerPage = 5;
let currentPage = 1;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupStarRating();
    loadReviewsFromStorage();
    updateRatingStats();
    displayReviews();
});

// Star Rating
function setupStarRating() {
    const stars = document.querySelectorAll('#starRating .star');
    const ratingValue = document.getElementById('ratingValue');
    const ratingText = document.getElementById('ratingText');
    
    if (!stars.length) return;
    
    stars.forEach((star) => {
        star.addEventListener('click', () => {
            const value = star.dataset.value;
            ratingValue.value = value;
            stars.forEach((s) => s.classList.toggle('active', s.dataset.value <= value));
            const texts = ['', '😞 Poor', '😐 Fair', '😊 Good', '😄 Very Good', '😍 Excellent'];
            ratingText.textContent = texts[value];
        });
    });
}

// Form Submission
function submitReview(event) {
    event.preventDefault();
    const name = document.getElementById('reviewName').value.trim();
    const email = document.getElementById('reviewEmail').value.trim();
    const rating = parseInt(document.getElementById('ratingValue').value);
    const text = document.getElementById('reviewText').value.trim();
    const eventType = document.getElementById('eventType').value;
    
    if (!name || !email || !rating || text.length < 10) {
        alert('Please fill all fields correctly');
        return;
    }
    
    const review = {
        id: 'REV-' + Date.now(),
        name, email, rating, text, eventType: eventType || null,
        verified: document.getElementById('verifiedCheckbox').checked,
        createdAt: new Date().toISOString(),
        helpful: 0, unhelpful: 0
    };
    
    allReviews.unshift(review);
    saveReviewsToStorage();
    updateRatingStats();
    document.getElementById('reviewForm').reset();
    filterReviews('all');
}

// Stats
function updateRatingStats() {
    if (!allReviews.length) return;
    const avg = (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1);
    document.getElementById('avgRating').textContent = avg;
    document.getElementById('totalReviews').textContent = `${allReviews.length} Reviews`;
    
    const breakdown = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
    allReviews.forEach(r => breakdown[r.rating]++);
    
    for (let i = 5; i >= 1; i--) {
        const pct = Math.round((breakdown[i] / allReviews.length) * 100);
        const el = document.getElementById(`rating${i}`);
        const pEl = document.getElementById(`percent${i}`);
        if (el) el.style.width = `${pct}%`;
        if (pEl) pEl.textContent = `${pct}%`;
    }
}

// Filter
function filterReviews(rating) {
    filteredReviews = rating === 'all' ? [...allReviews] : allReviews.filter(r => r.rating === rating);
    currentPage = 1;
    displayReviews();
}

// Display
function displayReviews() {
    const container = document.getElementById('reviewsList');
    if (!container) return;
    
    const start = (currentPage - 1) * reviewsPerPage;
    const reviews = filteredReviews.slice(0, start + reviewsPerPage);
    
    if (!reviews.length) {
        container.innerHTML = '<div class="empty-state"><p>No reviews found</p></div>';
        return;
    }
    
    container.innerHTML = reviews.map(r => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${r.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
                    <div class="reviewer-details">
                        <h4>${r.name}</h4>
                        <div class="reviewer-meta"><span>📅 ${new Date(r.createdAt).toLocaleDateString()}</span>${r.verified ? '<span class="review-badge">✓ Verified</span>' : ''}</div>
                    </div>
                </div>
                <div class="review-rating">${'⭐'.repeat(r.rating)}</div>
            </div>
            ${r.eventType ? `<span class="review-event-type">${r.eventType}</span>` : ''}
            <div class="review-body">${r.text}</div>
            <div class="review-footer">
                <button class="helpful-btn" onclick="markHelpful('${r.id}')">👍 <span id="h-${r.id}">${r.helpful}</span></button>
                <button class="helpful-btn" onclick="markUnhelpful('${r.id}')">👎 <span id="uh-${r.id}">${r.unhelpful}</span></button>
            </div>
        </div>
    `).join('');
    
    const loadBtn = document.getElementById('loadMoreBtn');
    if (loadBtn) loadBtn.style.display = filteredReviews.length > start + reviewsPerPage ? 'block' : 'none';
}

// Helpful
function markHelpful(id) {
    const r = allReviews.find(x => x.id === id);
    if (r) {
        r.helpful++;
        saveReviewsToStorage();
        const el = document.getElementById(`h-${id}`);
        if (el) el.textContent = r.helpful;
    }
}

function markUnhelpful(id) {
    const r = allReviews.find(x => x.id === id);
    if (r) {
        r.unhelpful++;
        saveReviewsToStorage();
        const el = document.getElementById(`uh-${id}`);
        if (el) el.textContent = r.unhelpful;
    }
}

// Storage
function saveReviewsToStorage() {
    localStorage.setItem('catering-reviews', JSON.stringify(allReviews));
}

function loadReviewsFromStorage() {
    const stored = localStorage.getItem('catering-reviews');
    allReviews = stored ? JSON.parse(stored) : [
        { id: 'REV-1', name: 'Priya Sharma', rating: 5, text: 'Absolutely excellent service! The food was delicious and the staff was very professional.', eventType: 'Marriage', verified: true, createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(), helpful: 12, unhelpful: 1 },
        { id: 'REV-2', name: 'Rajesh Kumar', rating: 4, text: 'Great catering service for our corporate event. The menu was diverse and everyone loved it.', eventType: 'Corporate', verified: true, createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString(), helpful: 8, unhelpful: 0 },
        { id: 'REV-3', name: 'Anjali Patel', rating: 5, text: 'Perfect for our daughter\'s birthday! Decorations, food, and service were all outstanding.', eventType: 'Birthday', verified: true, createdAt: new Date(Date.now() - 15*24*60*60*1000).toISOString(), helpful: 15, unhelpful: 0 },
        { id: 'REV-4', name: 'Vikram Singh', rating: 4, text: 'Loved the barbecue spread. Fresh ingredients and amazing flavors. Great experience overall.', eventType: 'Barbecue', verified: true, createdAt: new Date(Date.now() - 20*24*60*60*1000).toISOString(), helpful: 6, unhelpful: 1 },
        { id: 'REV-5', name: 'Meera Desai', rating: 5, text: 'Outstanding attention to detail. They listened to all our requirements and delivered perfectly.', eventType: null, verified: false, createdAt: new Date(Date.now() - 25*24*60*60*1000).toISOString(), helpful: 20, unhelpful: 0 }
    ];
    if (!stored) saveReviewsToStorage();
}

function loadMoreReviews() {
    currentPage++;
    displayReviews();
}