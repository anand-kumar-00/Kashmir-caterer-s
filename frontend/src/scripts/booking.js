/**
 * Kashmir Caterers — booking.js
 * 7-step booking wizard: Event → Menu → Contact → Guests → Notes → Review → Payment
 * Wired to POST /api/bookings + POST /api/payments/:id/proof
 */

let currentStep    = 1;
const totalSteps   = 7;
let bookingMenuItems = [];
let selectedMenuIds  = [];
let confirmedBookingId = null;   // set after step 6 confirms, used in step 7

/* ── INIT ──────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    setMinDate();
    setupFunctionChips();
    prefillIfLoggedIn();
});

/* ── STEP NAVIGATION ───────────────────────────────────────────── */
async function goToStep(step) {
    if (step > currentStep) {
        const valid = await validateCurrentStep();
        if (!valid) return;
    }

    document.querySelectorAll('.step-panel').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${step}`)?.classList.add('active');

    updateStepIndicator(step);
    currentStep = step;
    updateBookingOverview();

    if (step === 2 && !bookingMenuItems.length) await loadBookingMenu();
    if (step === 6) updateReviewDisplay();
    // Step 7 is opened after submitBooking() success — see that function
}

function updateStepIndicator(activeStep) {
    document.querySelectorAll('.step').forEach((el, i) => {
        const n = i + 1;
        el.classList.remove('active', 'completed');
        if (n === activeStep) el.classList.add('active');
        else if (n < activeStep) el.classList.add('completed');
    });
}

/* ── VALIDATION ────────────────────────────────────────────────── */
async function validateCurrentStep() {
    switch (currentStep) {
        case 1: return validateStep1();
        case 2: return true;               // menu optional
        case 3: return validateStep3();
        case 4: return validateStep4();
        case 5: return true;               // notes optional
        case 6: return true;
        default: return true;
    }
}

function validateStep1() {
    const fn   = document.getElementById('functionType').value;
    const date = document.getElementById('eventDate').value;
    if (!fn)   { showNotification('Please select a function type', 'error'); return false; }
    if (!date) { showNotification('Please select an event date', 'error'); return false; }
    const sel = new Date(date);
    const tmr = new Date(); tmr.setDate(tmr.getDate() + 1); tmr.setHours(0,0,0,0);
    if (sel < tmr) { showNotification('Event date must be at least tomorrow', 'error'); return false; }
    return true;
}

function validateStep3() {
    const name  = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    if (name.length < 2)       { showNotification('Please enter your full name', 'error'); return false; }
    if (!validateEmail(email)) { showNotification('Please enter a valid email', 'error'); return false; }
    return true;
}

function validateStep4() {
    const phone = document.getElementById('customerPhone').value.trim();
    const guests = document.getElementById('guestCount').value;
    if (!phone)                        { showNotification('Please enter your phone number', 'error'); return false; }
    if (!guests || Number(guests) < 1) { showNotification('Please enter the expected guest count', 'error'); return false; }
    return true;
}

/* ── LOAD BOOKING MENU ─────────────────────────────────────────── */
async function loadBookingMenu() {
    const container = document.getElementById('bookingMenuCategories');
    if (!container) return;
    container.innerHTML = '<p class="menu-loading-state">Loading menu options…</p>';
    try {
        const res = await fetch('/api/menu');
        bookingMenuItems = await res.json();
        renderMenuGrid(container, bookingMenuItems, true, selectedMenuIds);
    } catch (_) {
        container.innerHTML = '<p class="menu-loading-state">Could not load menu. You can still continue.</p>';
    }
}

/* ── MENU SELECTION ────────────────────────────────────────────── */
function toggleMenuSelection(itemId) {
    const idx = selectedMenuIds.indexOf(itemId);
    if (idx === -1) selectedMenuIds.push(itemId);
    else selectedMenuIds.splice(idx, 1);

    const card = document.getElementById(`menu-card-${itemId}`);
    if (card) {
        const sel = selectedMenuIds.includes(itemId);
        card.classList.toggle('selected', sel);
        card.setAttribute('aria-checked', String(sel));
    }
    updateBookingOverview();
    updateEstimatedTotal();
}

/* ── BOOKING OVERVIEW ──────────────────────────────────────────── */
function updateBookingOverview() {
    const fnEl    = document.getElementById('booking-overview-function');
    const dateEl  = document.getElementById('booking-overview-date');
    const countEl = document.getElementById('booking-overview-menu-count');
    const fn   = document.getElementById('functionType')?.value;
    const date = document.getElementById('eventDate')?.value;
    if (fnEl)    fnEl.textContent    = fn || 'Not selected';
    if (dateEl)  dateEl.textContent  = date ? formatDate(date) : 'Not selected';
    if (countEl) countEl.textContent = selectedMenuIds.length
        ? `${selectedMenuIds.length} item${selectedMenuIds.length === 1 ? '' : 's'} selected`
        : '0 selected';
}

/* ── FUNCTION CHIPS ────────────────────────────────────────────── */
function setupFunctionChips() {
    document.querySelectorAll('.booking-function-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const fn = chip.dataset.function;
            const sel = document.getElementById('functionType');
            if (sel) sel.value = fn;
            updateFunctionTypeChips(fn);
            updateBookingOverview();
        });
    });
}

function updateFunctionTypeChips(activeFunction) {
    document.querySelectorAll('.booking-function-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.function === activeFunction);
    });
}

function prefillIfLoggedIn() {
    if (!appState.isLoggedIn || !appState.currentUser) return;
    const n = document.getElementById('customerName');
    const e = document.getElementById('customerEmail');
    if (n && !n.value) n.value = appState.currentUser.name  || '';
    if (e && !e.value) e.value = appState.currentUser.email || '';
}

/* ── REVIEW DISPLAY ────────────────────────────────────────────── */
function updateReviewDisplay() {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
    const menuNames = selectedMenuIds.map(id => {
        const item = bookingMenuItems.find(m => m.id === id);
        return item ? item.name : id;
    });
    set('reviewDate',          formatDate(document.getElementById('eventDate')?.value));
    set('reviewFunction',      document.getElementById('functionType')?.value);
    set('reviewMenu',          menuNames.length ? menuNames.join(', ') : 'None selected');
    set('reviewCustomerName',  document.getElementById('customerName')?.value);
    set('reviewCustomerEmail', document.getElementById('customerEmail')?.value);
    set('reviewCustomerPhone', document.getElementById('customerPhone')?.value);
    set('reviewGuestCount',    document.getElementById('guestCount')?.value);
    set('reviewRequirements',  document.getElementById('requirements')?.value || 'None');
    updateEstimatedTotal();
}

function updateEstimatedTotal() {
    let total = 10000;
    selectedMenuIds.forEach(id => {
        const item = bookingMenuItems.find(m => m.id === id);
        if (item) total += Number(item.price || 0);
    });
    const el = document.getElementById('estimatedTotal');
    if (el) el.textContent = formatCurrency(total);
    // also update payment step total display
    const payEl = document.getElementById('payment-total-display');
    if (payEl) payEl.textContent = formatCurrency(total);
    return total;
}

/* ── SUBMIT BOOKING (Step 6 → Step 7) ─────────────────────────── */
async function submitBooking() {
    const btn = document.getElementById('confirm-pay-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Confirming…'; }

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

    if (!payload.customerName || !payload.customerEmail || !payload.customerPhone ||
        !payload.functionType || !payload.eventDate || payload.guestCount < 1) {
        showNotification('Please fill in all required fields before confirming.', 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Confirm & Pay Advance'; }
        return;
    }

    try {
        const res  = await fetch('/api/bookings', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body:    JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
            showNotification(data.error || 'Booking failed. Please try again.', 'error');
            return;
        }

        // Store the booking ID for payment step
        confirmedBookingId = data.bookingId;

        // Populate payment step
        const idDisplay = document.getElementById('payment-booking-id');
        if (idDisplay) idDisplay.textContent = data.bookingId;
        updateEstimatedTotal(); // refresh total in payment panel

        // Advance to payment step
        document.querySelectorAll('.step-panel').forEach(el => el.classList.remove('active'));
        document.getElementById('step7')?.classList.add('active');
        updateStepIndicator(7);
        currentStep = 7;

        showNotification(`✓ Booking ${data.bookingId} confirmed! Now complete your advance payment.`, 'success');

    } catch (err) {
        handleError(err, 'Booking submission failed. Please try again.');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Confirm & Pay Advance'; }
    }
}

/* ── SUBMIT PAYMENT PROOF (Step 7) ─────────────────────────────── */
async function submitPaymentProof(event) {
    event.preventDefault();
    if (!confirmedBookingId) {
        showNotification('Booking not confirmed yet. Please go back.', 'error');
        return;
    }

    const method   = document.getElementById('pay-method')?.value;
    const advance  = document.getElementById('pay-advance')?.value;
    const proofFile = document.getElementById('pay-proof-file')?.files[0];
    const btn       = document.getElementById('pay-proof-btn');

    if (!method) { showNotification('Please select a payment method', 'error'); return; }
    if (!advance || Number(advance) < 0) { showNotification('Please enter the advance amount', 'error'); return; }

    if (btn) { btn.disabled = true; btn.textContent = 'Uploading…'; }

    try {
        if (proofFile) {
            // Upload proof + update payment in one go
            const formData = new FormData();
            formData.append('proof', proofFile);
            formData.append('payment_method', method);
            formData.append('advance_amount', advance);

            const res  = await fetch(`/api/payments/${confirmedBookingId}/proof`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) {
                showNotification(data.error || 'Upload failed. Try again.', 'error');
                return;
            }
        } else {
            // No proof file — just record payment method / advance
            const res = await fetch(`/api/payments/${confirmedBookingId}`, {
                method:  'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    payment_method: method,
                    advance_amount: Number(advance),
                    payment_status: Number(advance) > 0 ? 'advance_paid' : 'unpaid',
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                showNotification(data.error || 'Could not record payment info.', 'error');
                return;
            }
        }

        // Show success screen
        showPaymentSuccess();

    } catch (err) {
        handleError(err, 'Payment submission failed. Please try again.');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Submit Payment Info'; }
    }
}

function showPaymentSuccess() {
    const panel = document.getElementById('step7');
    if (!panel) return;
    const idEl = document.getElementById('payment-success-booking-id');
    if (idEl) idEl.textContent = confirmedBookingId;
    panel.querySelector('.payment-form-area')?.classList.add('hidden');
    panel.querySelector('.payment-success-area')?.classList.remove('hidden');
}

/* ── SKIP PAYMENT (pay later) ───────────────────────────────────── */
function skipPayment() {
    closeBookingModal();
    showNotification(
        `✓ Booking ${confirmedBookingId} received! Our team will contact you with payment details.`,
        'success'
    );
    resetBookingForm();
}

/* ── RESET ──────────────────────────────────────────────────────── */
function resetBookingForm() {
    currentStep       = 1;
    selectedMenuIds   = [];
    bookingMenuItems  = [];
    confirmedBookingId = null;

    document.querySelectorAll('.step-panel').forEach((el, i) => {
        el.classList.toggle('active', i === 0);
    });
    updateStepIndicator(1);

    ['functionType','eventDate','customerName','customerEmail','customerPhone','guestCount','requirements',
     'pay-method','pay-advance','pay-proof-file'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const formArea    = document.querySelector('.payment-form-area');
    const successArea = document.querySelector('.payment-success-area');
    if (formArea)    formArea.classList.remove('hidden');
    if (successArea) successArea.classList.add('hidden');

    updateBookingOverview();
    const mc = document.getElementById('bookingMenuCategories');
    if (mc) mc.innerHTML = '<p class="menu-loading-state">Loading menu options…</p>';
}
