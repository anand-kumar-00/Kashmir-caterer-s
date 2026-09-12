/* ================================
   BOOKING SYSTEM
   ================================ */

let currentStep = 1;
const totalSteps = 6;
const defaultBookingMenuCatalog = [
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

const bookingFunctionOptions = [
    'Marriage Catering',
    'Birthday Catering',
    'Corporate Catering',
    'BBQ Catering',
    'Indoor Catering',
    'Outdoor Catering',
    'Engagement Catering',
    'Reception Catering',
    'Private Party Catering',
    'Other',
];

document.addEventListener('DOMContentLoaded', () => {
    ensureMenuStorage();
    loadPreselectedMenuFromMenuPage();  // ← picks up menu-page selections
    renderBookingMenuOptions();
    initializeFunctionTypeField();
    initializeBookingRealtimeSync();
    prefillCustomerDetails();
    applyFunctionTypeFromUrl();
    prefillFunctionType();
    updateBookingOverview();

    // Auto-open booking modal if redirected from menu page
    if (window.location.hash === '#bookingModal') {
        setTimeout(() => {
            if (typeof openBookingModal === 'function') {
                openBookingModal();
            }
        }, 400);
    }
});

/* ================================================================
   PRESELECTED MENU INTEGRATION (from pages/menu.html)
   When a customer builds their menu on the menu page and clicks
   "Continue Booking", the selection is stored in localStorage
   under 'kcPreselectedMenu'. We read it here and inject it into
   appState.bookingData.menu so Step 2 already shows their choices.
   ================================================================ */

function loadPreselectedMenuFromMenuPage() {
    try {
        const raw = localStorage.getItem('kcPreselectedMenu');
        if (!raw) return;

        const items = JSON.parse(raw);
        if (!Array.isArray(items) || !items.length) return;

        // Convert KC selected-menu format → booking.js itemId array
        const itemIds = items.map(i => i.id);
        appState.bookingData.menu = itemIds;

        // Also store rich menu data for review display
        appState.bookingData.kcMenuItems = items;

        // Pre-select package if one was chosen
        const pkgId = localStorage.getItem('kcPreselectedPackage');
        if (pkgId) {
            appState.bookingData.kcPackage = pkgId;
        }

        saveState();

        // Clear after consuming so refreshing doesn't re-inject
        localStorage.removeItem('kcPreselectedMenu');
        localStorage.removeItem('kcPreselectedPackage');

        console.log('[KC Booking] Pre-loaded', itemIds.length, 'items from menu page.');
    } catch (e) {
        console.warn('[KC Booking] Could not load preselected menu:', e);
    }
}

// Step Navigation
function initializeFunctionTypeField() {
    const functionTypeSelect = document.getElementById('functionType');

    if (!functionTypeSelect) {
        return;
    }

    functionTypeSelect.addEventListener('change', () => {
        setBookingFunctionType(functionTypeSelect.value);
    });

    document.querySelectorAll('.booking-function-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            setBookingFunctionType(chip.dataset.function || '');
        });
    });
}

function initializeBookingRealtimeSync() {
    const eventDateInput = document.getElementById('eventDate');

    if (!eventDateInput) {
        return;
    }

    if (appState.bookingData.eventDate) {
        eventDateInput.value = appState.bookingData.eventDate;
    } else if (eventDateInput.value) {
        appState.bookingData.eventDate = eventDateInput.value;
        saveState();
    }

    eventDateInput.addEventListener('change', () => {
        appState.bookingData.eventDate = eventDateInput.value || null;
        saveState();
        updateBookingOverview();
    });
}

function normalizeFunctionType(functionType) {
    const normalizedValue = String(functionType || '').trim().toLowerCase();
    const aliases = {
        marriage: 'Marriage Catering',
        'marriage catering': 'Marriage Catering',
        wedding: 'Marriage Catering',
        birthday: 'Birthday Catering',
        'birthday catering': 'Birthday Catering',
        corporate: 'Corporate Catering',
        'corporate catering': 'Corporate Catering',
        bbq: 'BBQ Catering',
        barbecue: 'BBQ Catering',
        'barbecue catering': 'BBQ Catering',
        'bbq catering': 'BBQ Catering',
        indoor: 'Indoor Catering',
        'indoor catering': 'Indoor Catering',
        outdoor: 'Outdoor Catering',
        'outdoor catering': 'Outdoor Catering',
        engagement: 'Engagement Catering',
        'engagement catering': 'Engagement Catering',
        reception: 'Reception Catering',
        'reception catering': 'Reception Catering',
        'private party': 'Private Party Catering',
        'private party catering': 'Private Party Catering',
        other: 'Other',
    };

    return aliases[normalizedValue] || bookingFunctionOptions.find((option) => option.toLowerCase() === normalizedValue) || '';
}

function setBookingFunctionType(functionType) {
    const normalizedFunctionType = normalizeFunctionType(functionType);
    const functionTypeSelect = document.getElementById('functionType');

    if (!normalizedFunctionType) {
        appState.bookingData.functionType = null;
        if (functionTypeSelect) {
            functionTypeSelect.value = '';
        }
        updateFunctionTypeChips('');
        updateBookingOverview();
        saveState();
        return;
    }

    appState.bookingData.functionType = normalizedFunctionType;

    if (functionTypeSelect) {
        functionTypeSelect.value = normalizedFunctionType;
    }

    updateFunctionTypeChips(normalizedFunctionType);
    updateBookingOverview();
    saveState();
}

function updateFunctionTypeChips(activeFunctionType) {
    document.querySelectorAll('.booking-function-chip').forEach((chip) => {
        chip.classList.toggle('active', chip.dataset.function === activeFunctionType);
    });
}

function prefillFunctionType() {
    if (appState.bookingData.functionType) {
        setBookingFunctionType(appState.bookingData.functionType);
    } else {
        updateFunctionTypeChips('');
    }
}

function applyFunctionTypeFromUrl() {
    const url = new URL(window.location.href);
    const functionTypeFromUrl = url.searchParams.get('service');

    if (functionTypeFromUrl) {
        setBookingFunctionType(functionTypeFromUrl);
    }
}

function goToStep(stepNumber) {
    if (stepNumber >= 3 && !ensureCustomerLoggedIn()) {
        return;
    }

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
    updateBookingOverview();

    if (stepNumber === totalSteps) {
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
            return validateCustomerContactStep();
        case 4:
            return validateCustomerEventStep();
        case 5:
            return saveRequirements();
        default:
            return true;
    }
}

function ensureCustomerLoggedIn() {
    if (appState.isLoggedIn && appState.currentUser) {
        prefillCustomerDetails();
        return true;
    }

    showNotification('Please login or signup before booking your event', 'error');
    if (typeof openLoginModal === 'function') {
        openLoginModal();
    }
    return false;
}

function validateDateSelection() {
    const dateInput = document.getElementById('eventDate');
    const functionType = normalizeFunctionType(document.getElementById('functionType').value);

    if (!functionType) {
        showNotification('Please choose the function before continuing', 'error');
        return false;
    }

    if (!dateInput.value) {
        showNotification('Please select an event date', 'error');
        return false;
    }

    appState.bookingData.functionType = functionType;
    appState.bookingData.eventDate = dateInput.value;
    saveState();
    updateBookingOverview();
    return true;
}

// ================================
// STEP 2: MENU SELECTION
// ================================

function validateMenuSelection() {
    // Accept menu built on the dedicated menu page (kcMenuItems already injected)
    if (appState.bookingData.kcMenuItems && appState.bookingData.kcMenuItems.length > 0) {
        updateBookingOverview();
        return true;
    }

    const selectedMenus = document.querySelectorAll('.menu-item:checked');

    if (selectedMenus.length === 0) {
        showNotification('Please select at least one menu item', 'error');
        return false;
    }

    appState.bookingData.menu = Array.from(selectedMenus).map((item) => item.value);
    saveState();
    updateBookingOverview();
    return true;
}

function renderBookingMenuOptions() {
    // Show KC preloaded banner if applicable
    const banner  = document.getElementById('kcPreloadedMenuBanner');
    const summary = document.getElementById('kcPreloadedMenuSummary');
    if (banner && summary && appState.bookingData.kcMenuItems && appState.bookingData.kcMenuItems.length) {
        const names = appState.bookingData.kcMenuItems
            .slice(0, 6)
            .map(i => `${i.name}${i.quantity > 1 ? ' ×' + i.quantity : ''}`)
            .join(', ');
        const total = appState.bookingData.kcMenuItems.reduce((s, i) => s + (i.quantity || 1), 0);
        summary.textContent = `${total} item${total === 1 ? '' : 's'} selected: ${names}${appState.bookingData.kcMenuItems.length > 6 ? '…' : ''}`;
        banner.classList.remove('hidden');
    } else if (banner) {
        banner.classList.add('hidden');
    }

    const container = document.getElementById('bookingMenuCategories');

    if (!container) {
        return;
    }

    const bookingMenuCatalog = getBookingMenuCatalog();

    if (!bookingMenuCatalog.length) {
        const emptyLabel = typeof getTranslationValue === 'function' ? getTranslationValue('menuEmpty') : 'No menu items available yet.';
        container.innerHTML = `<div class="menu-loading-state">${emptyLabel}</div>`;
        return;
    }

    container.innerHTML = bookingMenuCatalog
        .map(
            (section) => `
            <section class="menu-modal-section">
                <div class="menu-modal-heading">
                    <h3>${section.meal}</h3>
                </div>
                <p class="category-description">${section.description}</p>
                <div class="menu-modal-courses">
                    ${section.courses
                        .map(
                            (course) => `
                            <article class="menu-modal-course">
                                <div class="menu-course-title">${course.title}</div>
                                <div class="menu-modal-items">
                                    ${course.items.map((item) => renderBookingSelectableMenuItem(item)).join('')}
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

    document.querySelectorAll('.menu-item').forEach((menuItem) => {
        menuItem.addEventListener('change', updateBookingMenuSelectionState);
    });

    updateBookingOverview();
}

function updateBookingMenuSelectionState() {
    appState.bookingData.menu = Array.from(document.querySelectorAll('.menu-item:checked')).map((item) => item.value);
    // Booking and the dedicated Book Menu page now share the exact same PDF
    // catalog and rich selection payload.
    appState.bookingData.kcMenuItems = appState.bookingData.menu
        .map((itemId) => window.KCMenuData && window.KCMenuData.getById(itemId))
        .filter(Boolean)
        .map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            type: item.type,
            quantity: 1,
            price: item.price || null,
        }));
    saveState();
    updateBookingOverview();
}

function renderBookingSelectableMenuItem(item) {
    const isChecked = appState.bookingData.menu.includes(item.id) ? 'checked' : '';
    const price = item.price ? `₹${item.price.toLocaleString('en-IN')}` : 'Price on request';

    return `
        <label class="booking-menu-option">
            <input type="checkbox" value="${item.id}" class="menu-item" ${isChecked}>
            <span class="menu-modal-item booking-menu-option-card">
                <span class="booking-menu-option-main">
                    <span class="booking-menu-option-check"></span>
                    <span>
                        <strong>${item.name}</strong>
                        <p>${item.note || 'PDF menu selection'}</p>
                    </span>
                </span>
                <span>${price}</span>
            </span>
        </label>
    `;
}

function findMenuItemById(itemId) {
    for (const section of getBookingMenuCatalog()) {
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

function ensureMenuStorage() {
    const existingMenuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');

    if (!existingMenuItems.length) {
        localStorage.setItem('menuItems', JSON.stringify(getDefaultMenuItems()));
    }
}

function getDefaultMenuItems() {
    return defaultBookingMenuCatalog.flatMap((section) =>
        section.courses.flatMap((course) =>
            course.items.map((item) => ({
                id: item.id,
                name: item.name,
                category: section.meal.toLowerCase(),
                type: course.title.toLowerCase().includes('main') ? 'main' : 'snacks',
                price: item.price,
                description: item.note,
            }))
        )
    );
}

function getBookingMenuCatalog() {
    if (!window.KCMenuData) return [];

    return window.KCMenuData.CATEGORIES
        .filter((category) => category.key !== 'all')
        .map((category) => {
            const items = window.KCMenuData.getByCategory(category.key).map((item) => ({
                id: item.id,
                name: item.name,
                price: Number(item.price || 0),
                note: item.subcategory || item.description || (item.type === 'veg' ? 'Vegetarian' : 'Non-vegetarian'),
            }));

            return {
                meal: category.label,
                description: 'Selections from the supplied Kashmir Caterers menu card.',
                courses: items.length ? [{ title: category.label, items }] : [],
            };
        })
        .filter((category) => category.courses.length > 0);
}

function normalizeCourseType(type) {
    return String(type || '')
        .toLowerCase()
        .includes('main')
        ? 'main'
        : 'snacks';
}

// ================================
// STEP 3-5: CUSTOMER DETAILS
// ================================

function saveRequirements() {
    const requirementsInput = document.getElementById('requirements');
    appState.bookingData.requirements = requirementsInput ? requirementsInput.value || 'None' : 'None';
    saveState();
    return true;
}

function prefillCustomerDetails() {
    const currentUser = appState.currentUser || {};
    const bookingCustomerDetails = appState.bookingData.customerDetails || {};
    const customerNameInput = document.getElementById('customerName');
    const customerEmailInput = document.getElementById('customerEmail');
    const customerPhoneInput = document.getElementById('customerPhone');
    const guestCountInput = document.getElementById('guestCount');
    const requirementsInput = document.getElementById('requirements');

    if (customerNameInput && !customerNameInput.value) {
        customerNameInput.value = bookingCustomerDetails.customerName || currentUser.name || '';
    }

    if (customerEmailInput && !customerEmailInput.value) {
        customerEmailInput.value = bookingCustomerDetails.customerEmail || currentUser.email || '';
    }

    if (customerPhoneInput && !customerPhoneInput.value && bookingCustomerDetails.customerPhone) {
        customerPhoneInput.value = bookingCustomerDetails.customerPhone;
    }

    if (guestCountInput && !guestCountInput.value && bookingCustomerDetails.guestCount) {
        guestCountInput.value = bookingCustomerDetails.guestCount;
    }

    if (requirementsInput && !requirementsInput.value && appState.bookingData.requirements && appState.bookingData.requirements !== 'None') {
        requirementsInput.value = appState.bookingData.requirements;
    }
}

function updateBookingOverview() {
    const functionLabel = document.getElementById('booking-overview-function');
    const dateLabel = document.getElementById('booking-overview-date');
    const menuCountLabel = document.getElementById('booking-overview-menu-count');

    if (!functionLabel || !dateLabel || !menuCountLabel) {
        return;
    }

    functionLabel.textContent = appState.bookingData.functionType || 'Not selected';
    dateLabel.textContent = appState.bookingData.eventDate ? formatBookingOverviewDate(appState.bookingData.eventDate) : 'Not selected';

    const menuCount = appState.bookingData.menu.length;
    menuCountLabel.textContent = menuCount === 1 ? '1 selected' : `${menuCount} selected`;
}

function formatBookingOverviewDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function syncCustomerDetailsToState() {
    const functionType = normalizeFunctionType(document.getElementById('functionType').value);
    const customerName = document.getElementById('customerName').value.trim();
    const customerEmail = document.getElementById('customerEmail').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const guestCount = Number(document.getElementById('guestCount').value || 0);

    appState.bookingData.functionType = functionType || appState.bookingData.functionType;
    appState.bookingData.customerDetails = {
        customerName,
        customerEmail,
        customerPhone,
        guestCount,
    };
    saveState();
    updateBookingOverview();

    return {
        functionType,
        customerName,
        customerEmail,
        customerPhone,
        guestCount,
    };
}

function validateCustomerContactStep() {
    const { functionType, customerName, customerEmail } = syncCustomerDetailsToState();

    if (!functionType) {
        showNotification('Please select which function this booking is for', 'error');
        return false;
    }

    if (!customerName || customerName.length < 3) {
        showNotification('Please enter your full name', 'error');
        return false;
    }

    if (!validateEmail(customerEmail)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    return true;
}

function validateCustomerEventStep() {
    const { functionType, customerPhone, guestCount } = syncCustomerDetailsToState();

    if (!functionType) {
        showNotification('Please select which function this booking is for', 'error');
        return false;
    }

    if (!customerPhone || customerPhone.length < 10) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }

    if (!guestCount || guestCount < 1) {
        showNotification('Please enter expected guest count', 'error');
        return false;
    }

    return true;
}

// ================================
// STEP 4: REVIEW & SUBMIT
// ================================

function updateReviewDisplay() {
    syncCustomerDetailsToState();
    saveRequirements();

    const reviewDate = document.getElementById('reviewDate');
    reviewDate.textContent = formatDate(appState.bookingData.eventDate);

    const reviewFunction = document.getElementById('reviewFunction');
    reviewFunction.textContent = appState.bookingData.functionType || '-';

    const reviewMenu = document.getElementById('reviewMenu');

    // Prefer the richer KC menu items (from the new menu page) if available
    let menuList;
    if (appState.bookingData.kcMenuItems && appState.bookingData.kcMenuItems.length) {
        menuList = appState.bookingData.kcMenuItems
            .map(i => `${i.name}${i.quantity > 1 ? ' ×' + i.quantity : ''}`)
            .join(', ');
    } else {
        menuList = appState.bookingData.menu
            .map((itemId) => {
                const menuItem = findMenuItemById(itemId);
                return menuItem ? `${menuItem.name} (${menuItem.meal} ${menuItem.course})` : itemId;
            })
            .join(', ');
    }
    reviewMenu.textContent = menuList || '-';

    const reviewRequirements = document.getElementById('reviewRequirements');
    reviewRequirements.textContent = appState.bookingData.requirements || 'None';

    const customerDetails = appState.bookingData.customerDetails || {};
    document.getElementById('reviewCustomerName').textContent = customerDetails.customerName || '-';
    document.getElementById('reviewCustomerEmail').textContent = customerDetails.customerEmail || '-';
    document.getElementById('reviewCustomerPhone').textContent = customerDetails.customerPhone || '-';
    document.getElementById('reviewGuestCount').textContent = customerDetails.guestCount || '-';

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
    if (!ensureCustomerLoggedIn()) {
        return;
    }

    if (!validateCustomerContactStep() || !validateCustomerEventStep()) {
        return;
    }

    const hasKcMenu = appState.bookingData.kcMenuItems && appState.bookingData.kcMenuItems.length > 0;
    if (!appState.bookingData.eventDate || (appState.bookingData.menu.length === 0 && !hasKcMenu)) {
        showNotification('Please complete all required fields', 'error');
        return;
    }

    const customerDetails = appState.bookingData.customerDetails || {};
    const booking = {
        id: generateBookingId(),
        customerId: appState.currentUser ? appState.currentUser.id : null,
        customerName: customerDetails.customerName || appState.currentUser?.name || 'Guest',
        customerEmail: customerDetails.customerEmail || appState.currentUser?.email || '',
        customerPhone: customerDetails.customerPhone || '',
        guestCount: customerDetails.guestCount || 0,
        functionType: appState.bookingData.functionType,
        eventDate: appState.bookingData.eventDate,
        package: appState.bookingData.kcPackage || null,
        menu: appState.bookingData.menu,
        menuItems: appState.bookingData.kcMenuItems || [],  // rich items from menu page
        totalMenuItems: hasKcMenu
            ? appState.bookingData.kcMenuItems.reduce((s, i) => s + (i.quantity || 1), 0)
            : appState.bookingData.menu.length,
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
    confirmationModal.id = 'bookingConfirmationModal';
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
    const eventDateInput = document.getElementById('eventDate');
    if (eventDateInput) {
        eventDateInput.value = '';
    }

    document.querySelectorAll('.menu-item').forEach((item) => {
        item.checked = false;
    });

    ['functionType', 'customerName', 'customerEmail', 'customerPhone', 'guestCount', 'requirements'].forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = '';
        }
    });

    appState.bookingData = {
        functionType: null,
        eventDate: null,
        menu: [],
        customerDetails: null,
        requirements: null,
    };
    saveState();
    renderBookingMenuOptions();
    prefillCustomerDetails();
    updateFunctionTypeChips('');
    updateBookingOverview();

    const confirmationModal = document.getElementById('bookingConfirmationModal');
    if (confirmationModal) {
        confirmationModal.remove();
    }

    currentStep = 1;
    goToStep(1);

    if (typeof closeBookingModal === 'function') {
        closeBookingModal();
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });

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
