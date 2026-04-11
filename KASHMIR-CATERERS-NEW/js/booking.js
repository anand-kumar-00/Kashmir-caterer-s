/* ================================
   BOOKING SYSTEM
   ================================ */

let currentStep = 1;
const totalSteps = 4;
const bookingMenuCatalog = [
    {
        meal: 'Breakfast',
        description: 'Morning selections for elegant starts and light gatherings.',
        courses: [
            {
                title: 'Snacks',
                items: [
                    { id: 'breakfast-kahwa', name: 'Kashmiri Kahwa', price: 1800, note: 'Traditional welcome beverage' },
                    { id: 'breakfast-bakerkhani', name: 'Bakerkhani', price: 2200, note: 'Flaky bakery special' },
                    { id: 'breakfast-harissa-bites', name: 'Harissa Bites', price: 2600, note: 'Chef-served mini portions' },
                ],
            },
            {
                title: 'Main Course',
                items: [
                    { id: 'breakfast-nadru-yakhni', name: 'Nadru Yakhni', price: 3400, note: 'Lotus stem yogurt curry' },
                    { id: 'breakfast-chaman-qaliya', name: 'Chaman Qaliya', price: 3200, note: 'Paneer in saffron gravy' },
                    { id: 'breakfast-lavasa-platter', name: 'Lavasa Breakfast Platter', price: 2800, note: 'Bread assortment with accompaniments' },
                ],
            },
        ],
    },
    {
        meal: 'Lunch',
        description: 'Balanced menu choices suited for family events and celebrations.',
        courses: [
            {
                title: 'Snacks',
                items: [
                    { id: 'lunch-seekh-kebab', name: 'Seekh Kebab', price: 3000, note: 'Chargrilled signature starter' },
                    { id: 'lunch-paneer-tikka', name: 'Paneer Tikka', price: 2800, note: 'Smoky vegetarian classic' },
                    { id: 'lunch-nadru-chips', name: 'Nadru Chips', price: 2400, note: 'Crisp lotus stem snack' },
                ],
            },
            {
                title: 'Main Course',
                items: [
                    { id: 'lunch-rogan-josh', name: 'Rogan Josh', price: 4200, note: 'Slow-cooked Kashmiri mutton curry' },
                    { id: 'lunch-dum-aloo', name: 'Kashmiri Dum Aloo', price: 3100, note: 'Spiced baby potato speciality' },
                    { id: 'lunch-gushtaba', name: 'Gushtaba', price: 4500, note: 'Royal meatball delicacy' },
                ],
            },
        ],
    },
    {
        meal: 'Dinner',
        description: 'Refined evening dishes for premium dining and wedding service.',
        courses: [
            {
                title: 'Snacks',
                items: [
                    { id: 'dinner-mutton-shami', name: 'Mutton Shami Kebab', price: 3400, note: 'Soft kebabs with rich aroma' },
                    { id: 'dinner-cheese-cigars', name: 'Cheese Cigars', price: 2600, note: 'Crisp party starter' },
                    { id: 'dinner-veg-nuggets', name: 'Vegetable Saffron Nuggets', price: 2300, note: 'Golden fried vegetarian bites' },
                ],
            },
            {
                title: 'Main Course',
                items: [
                    { id: 'dinner-rista', name: 'Rista', price: 4300, note: 'Classic red-gravy meatballs' },
                    { id: 'dinner-yakhni', name: 'Mutton Yakhni', price: 4100, note: 'Aromatic yogurt-based curry' },
                    { id: 'dinner-veg-pulao', name: 'Kashmiri Veg Pulao', price: 2900, note: 'Fragrant rice with dry fruits' },
                ],
            },
        ],
    },
];

document.addEventListener('DOMContentLoaded', () => {
    renderBookingMenuOptions();
});

// Step Navigation
function goToStep(stepNumber) {
    if (stepNumber > currentStep && !validateCurrentStep()) {
        showNotification('Please complete all required fields', 'error');
        return;
    }

    document.querySelectorAll('.step-content').forEach((content) => {
        content.classList.remove('active');
    });

    const stepElement = document.getElementById(`step${stepNumber}`);
    if (stepElement) {
        stepElement.classList.add('active');
    }

    updateStepIndicator(stepNumber);
    currentStep = stepNumber;

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
            return true;
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

function renderBookingMenuOptions() {
    const container = document.getElementById('bookingMenuCategories');

    if (!container) {
        return;
    }

    container.innerHTML = bookingMenuCatalog
        .map(
            (section) => `
            <div class="category">
                <h4>${section.meal}</h4>
                <p class="category-description">${section.description}</p>
                ${section.courses
                    .map(
                        (course) => `
                        <div class="menu-course">
                            <div class="menu-course-title">${course.title}</div>
                            <div class="menu-dish-list">
                                ${course.items.map((item) => renderMenuDishCard(item)).join('')}
                            </div>
                        </div>
                    `
                    )
                    .join('')}
            </div>
        `
        )
        .join('');
}

function renderMenuDishCard(item) {
    const isChecked = appState.bookingData.menu.includes(item.id) ? 'checked' : '';

    return `
        <label class="menu-dish">
            <input type="checkbox" value="${item.id}" class="menu-item" ${isChecked}>
            <span class="menu-dish-card">
                <span class="menu-dish-card-main">
                    <span class="menu-dish-check"></span>
                    <span>
                        <span class="menu-dish-title">${item.name}</span>
                        <span class="menu-dish-meta">${item.note}</span>
                    </span>
                </span>
                <span class="menu-dish-price">Rs ${item.price.toLocaleString('en-IN')}</span>
            </span>
        </label>
    `;
}

function findMenuItemById(itemId) {
    for (const section of bookingMenuCatalog) {
        for (const course of section.courses) {
            const item = course.items.find((dish) => dish.id === itemId);

            if (item) {
                return {
                    ...item,
                    meal: section.meal,
                    course: course.title,
                };
            }
        }
    }

    return null;
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
    saveRequirements();

    const reviewDate = document.getElementById('reviewDate');
    reviewDate.textContent = formatDate(appState.bookingData.eventDate);

    const reviewMenu = document.getElementById('reviewMenu');
    const menuList = appState.bookingData.menu
        .map((itemId) => {
            const menuItem = findMenuItemById(itemId);
            return menuItem ? `${menuItem.name} (${menuItem.meal} ${menuItem.course})` : itemId;
        })
        .join(', ');
    reviewMenu.textContent = menuList || '-';

    const reviewRequirements = document.getElementById('reviewRequirements');
    reviewRequirements.textContent = appState.bookingData.requirements || 'None';

    updateEstimatedTotal();
}

function updateEstimatedTotal() {
    const estimatedTotal = appState.bookingData.menu.reduce((sum, itemId) => {
        const menuItem = findMenuItemById(itemId);
        return sum + (menuItem ? menuItem.price : 0);
    }, 0);

    const reviewTotal = document.getElementById('estimatedTotal');
    reviewTotal.textContent = `Rs ${estimatedTotal.toLocaleString('en-IN')}`;

    appState.bookingData.estimatedTotal = estimatedTotal;
    saveState();
}

// ================================
// SUBMIT BOOKING
// ================================

async function submitBooking() {
    if (!appState.bookingData.eventDate || appState.bookingData.menu.length === 0) {
        showNotification('Please complete all required fields', 'error');
        return;
    }

    const booking = {
        id: generateBookingId(),
        customerName: 'Guest',
        eventDate: appState.bookingData.eventDate,
        menu: appState.bookingData.menu,
        requirements: appState.bookingData.requirements,
        estimatedTotal: appState.bookingData.estimatedTotal,
        status: 'pending_payment',
        createdAt: new Date().toISOString(),
    };

    try {
        saveBookingLocally(booking);
        showNotification('Booking created successfully! Proceeding to payment...', 'success');

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

function updateStoredBooking(bookingId, updates) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookingIndex = bookings.findIndex((booking) => booking.id === bookingId);

    if (bookingIndex === -1) {
        return;
    }

    bookings[bookingIndex] = {
        ...bookings[bookingIndex],
        ...updates,
    };

    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function proceedToPayment(booking) {
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
                    Rs ${booking.estimatedTotal.toLocaleString('en-IN')}
                </p>
                <p>Select payment method:</p>
                <div style="margin: 2rem 0; display: flex; gap: 1rem; flex-direction: column;">
                    <button class="btn-primary" onclick="simulatePayment('${booking.id}', 'card', ${booking.estimatedTotal})">
                        Credit/Debit Card
                    </button>
                    <button class="btn-primary" onclick="simulatePayment('${booking.id}', 'upi', ${booking.estimatedTotal})">
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

function simulatePayment(bookingId, method, amount) {
    showNotification(`Processing ${method.toUpperCase()} payment of Rs ${amount}...`, 'success');

    setTimeout(() => {
        completePayment(bookingId);
    }, 2000);
}

function completePayment(bookingId) {
    updateStoredBooking(bookingId, {
        status: 'confirmed',
        paidAt: new Date().toISOString(),
    });

    closePaymentModal();

    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal active';
    confirmationModal.innerHTML = `
        <div class="modal-content" style="text-align: center;" onclick="event.stopPropagation()">
            <h2 style="color: var(--secondary); margin-bottom: 1rem;">Payment Successful!</h2>
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
    document.getElementById('eventDate').value = '';
    document.querySelectorAll('.menu-item').forEach((item) => {
        item.checked = false;
    });
    document.getElementById('requirements').value = '';

    appState.bookingData = {
        eventDate: null,
        menu: [],
        requirements: null,
    };
    saveState();
    renderBookingMenuOptions();

    const modal = document.querySelector('.modal.active');
    if (modal) {
        modal.remove();
    }

    currentStep = 1;
    goToStep(1);
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

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
