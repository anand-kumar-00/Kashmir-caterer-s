/* ================================
   BOOKING SYSTEM
   ================================ */

let currentStep = 1;
const totalSteps = 4;

// Step Navigation
function goToStep(stepNumber) {
    // Validate current step before moving
    if (stepNumber > currentStep && !validateCurrentStep()) {
        showNotification('Please complete all required fields', 'error');
        return;
    }
    
    // Hide all steps
    document.querySelectorAll('.step-content').forEach((content) => {
        content.classList.remove('active');
    });
    
    // Show selected step
    const stepElement = document.getElementById(`step${stepNumber}`);
    if (stepElement) {
        stepElement.classList.add('active');
    }
    
    // Update step indicator
    updateStepIndicator(stepNumber);
    
    currentStep = stepNumber;
    
    // Update review if moving to step 4
    if (stepNumber === 4) {
        updateReviewDisplay();
    }
}

function updateStepIndicator(activeStep) {
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < activeStep) {
            step.classList.add('completed');
        } else if (stepNum === activeStep) {
            step.classList.add('active');
        }
    });
}

// ================================
// STEP 1: DATE VALIDATION
// ================================

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateDateSelection();
        case 2:
            return validateMenuSelection();
        case 3:
            return true; // Requirements are optional
        default:
            return true;
    }
}

function validateDateSelection() {
    const dateInput = document.getElementById('eventDate');
    
    if (!dateInput.value) {
        showNotification('Please select an event date', 'error');
        return false;
    }
    
    appState.bookingData.eventDate = dateInput.value;
    saveState();
    return true;
}

// ================================
// STEP 2: MENU SELECTION
// ================================

function validateMenuSelection() {
    const selectedMenus = document.querySelectorAll('.menu-item:checked');
    
    if (selectedMenus.length === 0) {
        showNotification('Please select at least one menu item', 'error');
        return false;
    }
    
    appState.bookingData.menu = Array.from(selectedMenus).map((item) => item.value);
    saveState();
    return true;
}

// ================================
// STEP 3: ADDITIONAL REQUIREMENTS
// ================================

function saveRequirements() {
    const requirementsInput = document.getElementById('requirements');
    appState.bookingData.requirements = requirementsInput.value || 'None';
    saveState();
    return true;
}

// ================================
// STEP 4: REVIEW & SUBMIT
// ================================

function updateReviewDisplay() {
    // Save requirements first
    saveRequirements();
    
    // Update review date
    const reviewDate = document.getElementById('reviewDate');
    reviewDate.textContent = formatDate(appState.bookingData.eventDate);
    
    // Update review menu
    const reviewMenu = document.getElementById('reviewMenu');
    const menuLabels = {
        'breakfast-snacks': 'Breakfast Snacks',
        'breakfast-main': 'Breakfast Main',
        'lunch-snacks': 'Lunch Snacks',
        'lunch-main': 'Lunch Main',
        'dinner-snacks': 'Dinner Snacks',
        'dinner-main': 'Dinner Main',
    };
    
    const menuList = appState.bookingData.menu
        .map((item) => menuLabels[item] || item)
        .join(', ');
    reviewMenu.textContent = menuList || '-';
    
    // Update review requirements
    const reviewRequirements = document.getElementById('reviewRequirements');
    reviewRequirements.textContent = appState.bookingData.requirements || 'None';
    
    // Calculate and update estimated total
    updateEstimatedTotal();
}

function updateEstimatedTotal() {
    const basePrice = 10000; // Base catering price
    const perPersonPrice = 500; // Price per person
    const menuCount = appState.bookingData.menu.length;
    
    // Simple calculation: base + (menu items * per-item price)
    const estimatedTotal = basePrice + (menuCount * perPersonPrice * 5); // Assuming 5 people per item
    
    const reviewTotal = document.getElementById('estimatedTotal');
    reviewTotal.textContent = `₹${estimatedTotal.toLocaleString('en-IN')}`;
    
    // Store for payment
    appState.bookingData.estimatedTotal = estimatedTotal;
    saveState();
}

// ================================
// SUBMIT BOOKING
// ================================

async function submitBooking() {
    // Validate all data
    if (!appState.bookingData.eventDate || appState.bookingData.menu.length === 0) {
        showNotification('Please complete all required fields', 'error');
        return;
    }
    
    // Create booking object
    const booking = {
        id: generateBookingId(),
        customerName: 'Guest', // Would be from authenticated user
        eventDate: appState.bookingData.eventDate,
        menu: appState.bookingData.menu,
        requirements: appState.bookingData.requirements,
        estimatedTotal: appState.bookingData.estimatedTotal,
        status: 'pending_payment',
        createdAt: new Date().toISOString(),
    };
    
    try {
        // Save booking to localStorage (In production, send to backend)
        saveBookingLocally(booking);
        
        // Show success message
        showNotification('Booking created successfully! Proceeding to payment...', 'success');
        
        // Redirect to payment
        setTimeout(() => {
            proceedToPayment(booking);
        }, 1500);
        
    } catch (error) {
        handleError(error, 'Failed to create booking');
    }
}

function generateBookingId() {
    return 'BK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function saveBookingLocally(booking) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function proceedToPayment(booking) {
    // Simulate payment gateway integration
    const paymentModal = document.createElement('div');
    paymentModal.className = 'modal active';
    paymentModal.id = 'paymentModal';
    paymentModal.innerHTML = `
        <div class="modal-content" onclick="event.stopPropagation()">
            <button class="modal-close" onclick="closePaymentModal()">&times;</button>
            <h2>Payment Gateway</h2>
            <div style="text-align: center; padding: 2rem;">
                <p>Booking ID: <strong>${booking.id}</strong></p>
                <p style="font-size: 1.5rem; color: var(--secondary); margin: 1rem 0;">
                    ₹${booking.estimatedTotal.toLocaleString('en-IN')}
                </p>
                <p>Select payment method:</p>
                <div style="margin: 2rem 0; display: flex; gap: 1rem; flex-direction: column;">
                    <button class="btn-primary" onclick="simulatePayment('card', ${booking.estimatedTotal})">
                        Credit/Debit Card
                    </button>
                    <button class="btn-primary" onclick="simulatePayment('upi', ${booking.estimatedTotal})">
                        UPI Payment
                    </button>
                    <button class="btn-secondary" onclick="closePaymentModal()">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(paymentModal);
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.remove();
    }
}

function simulatePayment(method, amount) {
    showNotification(`Processing ${method.toUpperCase()} payment of ₹${amount}...`, 'success');
    
    // Simulate payment processing
    setTimeout(() => {
        completePayment();
    }, 2000);
}

function completePayment() {
    closePaymentModal();
    
    // Show confirmation
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal active';
    confirmationModal.innerHTML = `
        <div class="modal-content" style="text-align: center;" onclick="event.stopPropagation()">
            <h2 style="color: var(--secondary); margin-bottom: 1rem;">✓ Payment Successful!</h2>
            <p style="font-size: 1.1rem; margin-bottom: 1rem;">
                Your booking has been confirmed. A confirmation email has been sent.
            </p>
            <p style="color: var(--gray-medium); margin-bottom: 2rem;">
                An employee will contact you shortly to finalize the details.
            </p>
            <button class="btn-primary" onclick="resetBookingForm()">
                Back to Home
            </button>
        </div>
    `;
    
    document.body.appendChild(confirmationModal);
}

function resetBookingForm() {
    // Reset form
    document.getElementById('eventDate').value = '';
    document.querySelectorAll('.menu-item').forEach((item) => {
        item.checked = false;
    });
    document.getElementById('requirements').value = '';
    
    // Reset state
    appState.bookingData = {
        eventDate: null,
        menu: [],
        requirements: null,
    };
    saveState();
    
    // Close modal and reset UI
    const modal = document.querySelector('.modal.active');
    if (modal) {
        modal.remove();
    }
    
    // Go back to step 1
    currentStep = 1;
    goToStep(1);
    
    // Scroll to booking section
    scrollToSection('booking');
    
    showNotification('Thank you for booking with us!', 'success');
}

// ================================
// GALLERY LIGHTBOX
// ================================

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const img = element.querySelector('img');
    
    lightboxImage.src = img.src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close lightbox on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});