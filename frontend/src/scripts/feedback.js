/**
 * Kashmir Caterers — feedback.js
 * Reviews: load from API, submit to API, filter, pagination
 */

let allReviews = [];
let filteredReviews = [];
let currentFilter = 'all';
let currentPage = 1;
const reviewsPerPage = 5;

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    setupStarRating();
    loadReviews();
});

/* ── STAR RATING ───────────────────────────────────────────── */
function setupStarRating() {
    const stars      = document.querySelectorAll('#starRating .star');
    const ratingVal  = document.getElementById('ratingValue');
    const ratingText = document.getElementById('ratingText');
    if (!stars.length) return;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = Number(star.dataset.value);
            if (ratingVal) ratingVal.value = value;

            stars.forEach(s => {
                const isSelected = Number(s.dataset.value) <= value;
                s.classList.toggle('active', isSelected);
                s.setAttribute('aria-checked', String(isSelected && Number(s.dataset.value) === value));
            });

            const labels = ['', '😞 Poor', '😐 Fair', '😊 Good', '😄 Very Good', '😍 Excellent'];
            if (ratingText) ratingText.textContent = labels[value] || '';
        });
    });
}

/* ── LOAD REVIEWS ──────────────────────────────────────────── */
async function loadReviews() {
    try {
        const res = await fetch('/api/reviews');
        if (!res.ok) throw new Error('Failed to load reviews');
        allReviews = await res.json();
    } catch (_) {
        allReviews = [];
    }

    currentPage = 1;
    applyFilter(currentFilter);
    updateRatingStats();
}

/* ── SUBMIT REVIEW ─────────────────────────────────────────── */
async function submitReview(event) {
    event.preventDefault();

    const name      = document.getElementById('reviewName').value.trim();
    const email     = document.getElementById('reviewEmail').value.trim();
    const rating    = Number(document.getElementById('ratingValue').value);
    const review    = document.getElementById('reviewText').value.trim();
    const eventType = document.getElementById('eventType').value || null;

    if (!name)           { showNotification('Please enter your name', 'error'); return; }
    if (!validateEmail(email)) { showNotification('Please enter a valid email', 'error'); return; }
    if (!rating)         { showNotification('Please select a star rating', 'error'); return; }
    if (review.length < 10) { showNotification('Review must be at least 10 characters', 'error'); return; }

    const btn = event.target.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Submitting…';

    try {
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, email, rating, review, eventType }),
        });

        const data = await res.json();
        if (!res.ok) { showNotification(data.error || 'Review submission failed', 'error'); return; }

        showNotification('Thank you for your review!', 'success');
        event.target.reset();
        document.querySelectorAll('#starRating .star').forEach(s => {
            s.classList.remove('active');
            s.setAttribute('aria-checked', 'false');
        });
        const ratingText = document.getElementById('ratingText');
        if (ratingText) ratingText.textContent = '';

        // Reload reviews
        await loadReviews();
    } catch (err) {
        handleError(err, 'Review submission failed. Please try again.');
    } finally {
        btn.disabled = false; btn.textContent = 'Submit Review';
    }
}

/* ── FILTER ────────────────────────────────────────────────── */
function filterReviews(filter) {
    currentFilter = filter;
    currentPage   = 1;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        const btnFilter = btn.textContent.includes('All') ? 'all'
            : parseInt(btn.textContent.trim());
        btn.classList.toggle('active', btnFilter === filter || btn.textContent.trim() === 'All' && filter === 'all');
    });

    applyFilter(filter);
}

function applyFilter(filter) {
    filteredReviews = filter === 'all'
        ? [...allReviews]
        : allReviews.filter(r => r.rating === filter);
    displayReviews();
}

/* ── DISPLAY ───────────────────────────────────────────────── */
function displayReviews() {
    const container = document.getElementById('reviewsList');
    if (!container) return;

    const pageReviews = filteredReviews.slice(0, currentPage * reviewsPerPage);

    if (!filteredReviews.length) {
        container.innerHTML = '<p style="text-align:center;color:var(--color-muted);padding:2rem">No reviews yet. Be the first!</p>';
        const btn = document.getElementById('loadMoreBtn');
        if (btn) btn.style.display = 'none';
        return;
    }

    container.innerHTML = pageReviews.map(review => `
        <article class="review-card">
            <div class="review-card-header">
                <div class="reviewer-info">
                    <h4>${escHtml(review.name)}</h4>
                    <div class="reviewer-meta">
                        <span class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                        ${review.event_type ? `<span>· ${escHtml(review.event_type)}</span>` : ''}
                        ${review.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}
                    </div>
                </div>
                <time style="font-size:var(--text-xs);color:var(--color-muted);white-space:nowrap;" datetime="${review.created_at}">
                    ${formatDate(review.created_at)}
                </time>
            </div>
            <p class="review-text">${escHtml(review.review)}</p>
        </article>
    `).join('');

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        const hasMore = filteredReviews.length > currentPage * reviewsPerPage;
        loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';
    }
}

function loadMoreReviews() {
    currentPage++;
    displayReviews();
}

/* ── STATS ─────────────────────────────────────────────────── */
function updateRatingStats() {
    const avgEl   = document.getElementById('avgRating');
    const totalEl = document.getElementById('totalReviews');
    if (!allReviews.length) {
        if (avgEl) avgEl.textContent = '—';
        if (totalEl) totalEl.textContent = '0';
        return;
    }

    const avg = (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1);
    if (avgEl)   avgEl.textContent   = avg;
    if (totalEl) totalEl.textContent = String(allReviews.length);

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(r => counts[r.rating]++);

    for (let i = 5; i >= 1; i--) {
        const pct = Math.round((counts[i] / allReviews.length) * 100);
        const bar  = document.getElementById(`rating${i}`);
        const pEl  = document.getElementById(`percent${i}`);
        if (bar) bar.style.width = `${pct}%`;
        if (pEl) pEl.textContent = `${pct}%`;
    }
}
