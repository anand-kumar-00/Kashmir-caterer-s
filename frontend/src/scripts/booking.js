/**
 * Kashmir Caterers — booking.js
 * 6-step booking wizard, wired to POST /api/bookings
 */

let currentStep = 1;
const totalSteps = 6;
let bookingMenuItems = [];     // loaded from API
let selectedMenuIds  = [];     // user selections

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    setMinDate();
    setupFunctionChips();
    prefillIfLoggedIn();

    // Load menu items when booking modal opens
    document.getElementById('bookingModal')?.addEventListener('transitionend', () => {}, { once: true });
});

/* ── STEP NAVIGATION ───────────────────────────────────────── */
async function goToStep(step) {
    if (step > currentStep) {
        const valid = await validateCurrentStep();
        if (!valid) return;
    }

    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${step}`)?.classList.add('active');

    updateStepIndicator(step);
    currentStep = step;
    updateBookingOverview();

    // Load menu for step 2 on first visit
    if (step === 2 && !bookingMenuItems.length) {
        await loadBookingMenu();
    }

    // Populate review on step 6
    if (step === 6) updateReviewDisplay();
}

function updateStepIndicator(activeStep) {
    document.querySelectorAll('.step').forEach((el, i) => {
        const stepNum = i + 1;
        el.classList.remove('active', 'completed');
        if (stepNum === activeStep) el.classList.add('active');
        else if (stepNum < activeStep) el.classList.add('completed');
    });
}

/* ── VALIDATION ────────────────────────────────────────────── */
async function validateCurrentStep() {
    switch (currentStep) {
        case 1: return validateStep1();
        case 2: return validateStep2();
        case 3: return validateStep3();
        case 4: return validateStep4();
        case 5: return true; // optional
        case 6: return true;
        default: return true;
    }
}

function validateStep1() {
    const functionType = document.getElementById('functionType').value;
    const eventDate    = document.getElementById('eventDate').value;
    if (!functionType) { showNotification('Please select a function type', 'error'); return false; }
    if (!eventDate)    { showNotification('Please select an event date', 'error'); return false; }
    const selected = new Date(eventDate);
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0,0,0,0);
    if (selected < tomorrow) { showNotification('Event date must be at least tomorrow', 'error'); return false; }
    return true;
}

function validateStep2() {
    // Menu is optional — they can proceed without selecting
    return true;
}

function validateStep3() {
    const name  = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    if (name.length < 2)     { showNotification('Please enter your full name', 'error'); return false; }
    if (!validateEmail(email)) { showNotification('Please enter a valid email', 'error'); return false; }
    return true;
}

function validateStep4() {
    const phone      = document.getElementById('customerPhone').value.trim();
    const guestCount = document.getElementById('guestCount').value;
    if (!phone)                    { showNotification('Please enter your phone number', 'error'); return false; }
    if (!guestCount || Number(guestCount) < 1) { showNotification('Please enter the expected guest count', 'error'); return false; }
    return true;
}

/* ── LOAD BOOKING MENU ─────────────────────────────────────── */
async function loadBookingMenu() {
    const container = document.getElementById('bookingMenuCategories');
    if (!container) return;

    container.innerHTML = '<p class="menu-loading-state">Loading menu options…</p>';
    try {
        const res = await fetch('/api/menu');
        bookingMenuItems = await res.json();
        renderMenuGrid(container, bookingMenuItems, true, selectedMenuIds);
    } catch (_) {
        container.innerHTML = '<p class="menu-loading-state">Could not load menu. You can still continue without selecting items.</p>';
    }
}

/* ── MENU SELECTION ────────────────────────────────────────── */
function toggleMenuSelection(itemId) {
    const idx = selectedMenuIds.indexOf(itemId);
    if (idx === -1) {
        selectedMenuIds.push(itemId);
    } else {
        selectedMenuIds.splice(idx, 1);
    }

    // Update card visual state
    const card = document.getElementById(`menu-card-${itemId}`);
    if (card) {
        const isNowSelected = selectedMenuIds.includes(itemId);
        card.classList.toggle('selected', isNowSelected);
        card.setAttribute('aria-checked', String(isNowSelected));
    }

    updateBookingOverview();
    updateEstimatedTotal();
}

/* ── BOOKING OVERVIEW ──────────────────────────────────────── */
function updateBookingOverview() {
    const fnEl    = document.getElementById('booking-overview-function');
    const dateEl  = document.getElementById('booking-overview-date');
    const countEl = document.getElementById('booking-overview-menu-count');

    const functionType = document.getElementById('functionType')?.value;
    const eventDate    = document.getElementById('eventDate')?.value;

    if (fnEl)    fnEl.textContent    = functionType || 'Not selected';
    if (dateEl)  dateEl.textContent  = eventDate ? formatDate(eventDate) : 'Not selected';
    if (countEl) countEl.textContent = selectedMenuIds.length
        ? `${selectedMenuIds.length} item${selectedMenuIds.length === 1 ? '' : 's'} selected`
        : '0 selected';
}

/* ── FUNCTION TYPE CHIPS ───────────────────────────────────── */
function setupFunctionChips() {
    document.querySelectorAll('.booking-function-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const fn = chip.dataset.function;
            const select = document.getElementById('functionType');
            if (select) select.value = fn;
            updateFunctionTypeChips(fn);
            updateBookingOverview();
        });
    });
}

// Override stub from main.js
function updateFunctionTypeChips(activeFunction) {
    document.querySelectorAll('.booking-function-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.function === activeFunction);
    });
}

function prefillIfLoggedIn() {
    if (!appState.isLoggedIn || !appState.currentUser) return;
    const nameInput  = document.getElementById('customerName');
    const emailInput = document.getElementById('customerEmail');
    if (nameInput  && !nameInput.value)  nameInput.value  = appState.currentUser.name  || '';
    if (emailInput && !emailInput.value) emailInput.value = appState.currentUser.email || '';
}

/* ── REVIEW DISPLAY ────────────────────────────────────────── */
function updateReviewDisplay() {
    const setValue = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };

    const eventDate    = document.getElementById('eventDate')?.value;
    const functionType = document.getElementById('functionType')?.value;
    const menuNames    = selectedMenuIds.map(id => {
        const item = bookingMenuItems.find(m => m.id === id);
        return item ? item.name : id;
    });

    setValue('reviewDate',         formatDate(eventDate));
    setValue('reviewFunction',     functionType);
    setValue('reviewMenu',         menuNames.length ? menuNames.join(', ') : 'None selected');
    setValue('reviewCustomerName', document.getElementById('customerName')?.value);
    setValue('reviewCustomerEmail',document.getElementById('customerEmail')?.value);
    setValue('reviewCustomerPhone',document.getElementById('customerPhone')?.value);
    setValue('reviewGuestCount',   document.getElementById('guestCount')?.value);
    setValue('reviewRequirements', document.getElementById('requirements')?.value || 'None');

    updateEstimatedTotal();
}

function updateEstimatedTotal() {
    let total = 10000; // base fee
    selectedMenuIds.forEach(id => {
        const item = bookingMenuItems.find(m => m.id === id);
        if (item) total += Number(item.price || 0);
    });
    const el = document.getElementById('estimatedTotal');
    if (el) el.textContent = formatCurrency(total);
}

/* ── SUBMIT BOOKING ────────────────────────────────────────── */
async function submitBooking() {
    const btn = document.getElementById('confirm-pay-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }

    const payload = {
        customerName:  document.getElementById('customerName')?.value?.trim(),
        customerEmail: document.getElementById('customerEmail')?.value?.trim(),
        customerPhone: document.getElementById('customerPhone')?.value?.trim(),
        functionType:  document.getElementById('functionType')?.value,
        eventDate:     document.getElementById('eventDate')?.value,
        guestCount:    Number(document.getElementById('guestCount')?.value || 0),
        menuItems:     selectedMenuIds,
        requirements:  document.getElementById('requirements')?.value?.trim() || '',
    };

    // Final client-side validation
    if (!payload.customerName || !payload.customerEmail || !payload.customerPhone ||
        !payload.functionType || !payload.eventDate || payload.guestCount < 1) {
        showNotification('Please fill in all required fields before confirming.', 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Confirm Booking'; }
        return;
    }

    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
            showNotification(data.error || 'Booking failed. Please try again.', 'error');
            return;
        }

        // Success!
        closeBookingModal();
        showNotification(
            `✓ Booking confirmed! Your ID: ${data.bookingId}. We will contact you shortly.`,
            'success'
        );
        resetBookingForm();

    } catch (err) {
        handleError(err, 'Booking submission failed. Please try again.');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Confirm Booking'; }
    }
}

/* ── RESET ─────────────────────────────────────────────────── */
function resetBookingForm() {
    currentStep     = 1;
    selectedMenuIds = [];
    bookingMenuItems = [];

    document.querySelectorAll('.step-content').forEach((el, i) => {
        el.classList.toggle('active', i === 0);
    });
    updateStepIndicator(1);

    const fields = ['functionType','eventDate','customerName','customerEmail','customerPhone','guestCount','requirements'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    updateBookingOverview();
    document.getElementById('bookingMenuCategories').innerHTML = '<p class="menu-loading-state">Loading menu options…</p>';
}
