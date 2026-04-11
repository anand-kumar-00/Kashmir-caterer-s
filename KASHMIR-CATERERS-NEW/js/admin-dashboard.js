/* ================================
   ADMIN DASHBOARD JAVASCRIPT
   ================================ */

// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

function initializeDashboard() {
    // Check if user is logged in and is employee/admin
    let appState = JSON.parse(localStorage.getItem('appState') || '{}');
    const hasDashboardAccess =
        appState.isLoggedIn &&
        (appState.userRole === 'employee' || appState.userRole === 'admin');
    
    // Fall back to a preview admin user instead of redirecting during local development
    if (!hasDashboardAccess) {
        appState = {
            isLoggedIn: true,
            userRole: 'admin',
            currentUser: { name: 'Admin Preview' },
        };
        localStorage.setItem('appState', JSON.stringify(appState));
    }
    
    // Update user name in header
    if (appState.currentUser) {
        document.getElementById('user-name').textContent = appState.currentUser.name;
    }
    
    // Load dashboard data
    loadDashboardData();
    loadBookings();
    loadMenuItems();
    loadExpenses();
    loadLocations();
    loadMeetings();
}

// ================================
// TAB SWITCHING
// ================================

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach((tab) => {
        tab.classList.remove('active');
    });
    
    // Remove active state from nav items
    document.querySelectorAll('.nav-item').forEach((item) => {
        item.classList.remove('active');
    });
    
    // Show selected tab
    const tabElement = document.getElementById(`${tabName}-tab`);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    // Update nav item active state
    const navItem = document.querySelector(`a[onclick="switchTab('${tabName}')"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        bookings: 'Booking Management',
        menu: 'Menu Management',
        accounting: 'Accounting',
        reports: 'Reports',
        locations: 'Locations',
        meetings: 'Meetings',
        settings: 'Settings',
    };
    
    document.getElementById('page-title').textContent = titles[tabName] || 'Dashboard';
}

// ================================
// DASHBOARD DATA
// ================================

function loadDashboardData() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Calculate statistics
    const totalBookings = bookings.length;
    const confirmedEvents = bookings.filter((b) => b.status === 'confirmed').length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.estimatedTotal || 0), 0);
    const pendingPayments = bookings.filter((b) => b.status === 'pending_payment').length;
    
    // Update stat cards
    document.getElementById('total-bookings').textContent = totalBookings;
    document.getElementById('confirmed-events').textContent = confirmedEvents;
    document.getElementById('total-revenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
    document.getElementById('pending-payments').textContent = pendingPayments;
    
    // Load recent bookings
    loadRecentBookings(bookings);
}

function loadRecentBookings(bookings) {
    const tbody = document.getElementById('recent-bookings-list');
    const recentBookings = bookings.slice(-5).reverse();
    
    if (recentBookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No bookings yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = recentBookings
        .map(
            (booking) => `
            <tr>
                <td><strong>${booking.id}</strong></td>
                <td>${booking.customerName}</td>
                <td>${formatDate(booking.eventDate)}</td>
                <td>₹${booking.estimatedTotal.toLocaleString('en-IN')}</td>
                <td><span class="status-badge ${booking.status}">${booking.status.replace('_', ' ')}</span></td>
                <td>
                    <button class="action-btn" onclick="viewBookingDetails('${booking.id}')">👁️</button>
                    <button class="action-btn" onclick="editBooking('${booking.id}')">✏️</button>
                </td>
            </tr>
        `
        )
        .join('');
}

// ================================
// BOOKINGS MANAGEMENT
// ================================

function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    displayBookings(bookings);
}

function displayBookings(bookings) {
    const tbody = document.getElementById('bookings-list-body');
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No bookings found</td></tr>';
        return;
    }
    
    tbody.innerHTML = bookings
        .map(
            (booking) => `
            <tr>
                <td><strong>${booking.id}</strong></td>
                <td>${booking.customerName}</td>
                <td>${formatDate(booking.eventDate)}</td>
                <td>${booking.menu.join(', ')}</td>
                <td>₹${booking.estimatedTotal.toLocaleString('en-IN')}</td>
                <td><span class="status-badge ${booking.status}">${booking.status.replace('_', ' ')}</span></td>
                <td>
                    <button class="action-btn" onclick="updateBookingStatus('${booking.id}')">📝</button>
                    <button class="action-btn" onclick="contactCustomer('${booking.id}')">📞</button>
                </td>
            </tr>
        `
        )
        .join('');
}

function filterBookings() {
    const statusFilter = document.getElementById('status-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    if (statusFilter) {
        bookings = bookings.filter((b) => b.status === statusFilter);
    }
    
    if (dateFilter) {
        bookings = bookings.filter((b) => b.eventDate === dateFilter);
    }
    
    displayBookings(bookings);
}

function updateBookingStatus(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = bookings.find((b) => b.id === bookingId);
    
    if (!booking) {
        alert('Booking not found');
        return;
    }
    
    const newStatus = prompt(
        'Select new status: \n1. pending_payment\n2. confirmed\n3. completed\n4. cancelled',
        booking.status
    );
    
    if (newStatus) {
        booking.status = newStatus;
        localStorage.setItem('bookings', JSON.stringify(bookings));
        loadBookings();
        alert('Booking status updated');
    }
}

function contactCustomer(bookingId) {
    alert('Contact feature will integrate with email/SMS service');
}

function viewBookingDetails(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = bookings.find((b) => b.id === bookingId);
    
    if (!booking) return;
    
    alert(`
Booking Details:
ID: ${booking.id}
Customer: ${booking.customerName}
Event Date: ${formatDate(booking.eventDate)}
Menu: ${booking.menu.join(', ')}
Requirements: ${booking.requirements}
Amount: ₹${booking.estimatedTotal}
Status: ${booking.status}
    `);
}

function editBooking(bookingId) {
    alert('Edit functionality will be available in full version');
}

// ================================
// MENU MANAGEMENT
// ================================

function loadMenuItems() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    
    const categories = ['breakfast', 'lunch', 'dinner'];
    
    categories.forEach((category) => {
        const items = menuItems.filter((item) => item.category === category);
        const container = document.getElementById(`${category}-items`);
        
        if (items.length === 0) {
            container.innerHTML = '<p style="color: #999;">No items yet</p>';
            return;
        }
        
        container.innerHTML = items
            .map(
                (item) => `
            <div class="menu-item-card">
                <div class="menu-item-info">
                    <h4>${item.name}</h4>
                    <p style="color: #999; font-size: 0.85rem;">${item.type}</p>
                    <p style="font-size: 0.85rem;">${item.description}</p>
                </div>
                <div style="text-align: right;">
                    <div class="menu-item-price">₹${item.price}</div>
                    <button class="action-btn" onclick="editMenuItem('${item.id}')">✏️</button>
                    <button class="action-btn" onclick="deleteMenuItem('${item.id}')">🗑️</button>
                </div>
            </div>
        `
            )
            .join('');
    });
}

function openAddMenuModal() {
    document.getElementById('addMenuModal').classList.add('active');
}

function handleAddMenuItem(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const menuItem = {
        id: 'ITEM-' + Date.now(),
        name: form.querySelector('input[type="text"]').value,
        category: form.querySelectorAll('select')[0].value,
        type: form.querySelectorAll('select')[1].value,
        price: parseInt(form.querySelector('input[type="number"]').value),
        description: form.querySelector('textarea').value,
    };
    
    let menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    menuItems.push(menuItem);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    alert('Menu item added successfully');
    closeModal();
    loadMenuItems();
    form.reset();
}

function editMenuItem(itemId) {
    alert('Edit functionality coming soon');
}

function deleteMenuItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        let menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        menuItems = menuItems.filter((item) => item.id !== itemId);
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        loadMenuItems();
        alert('Menu item deleted');
    }
}

// ================================
// ACCOUNTING
// ================================

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    displayExpenses(expenses);
    updateAccountingSummary(expenses);
}

function displayExpenses(expenses) {
    const tbody = document.getElementById('expenses-list');
    
    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No expenses recorded</td></tr>';
        return;
    }
    
    tbody.innerHTML = expenses
        .map(
            (expense) => `
            <tr>
                <td>${formatDate(expense.date)}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>₹${expense.amount.toLocaleString('en-IN')}</td>
                <td>
                    <button class="action-btn" onclick="deleteExpense('${expense.id}')">🗑️</button>
                </td>
            </tr>
        `
        )
        .join('');
}

function updateAccountingSummary(expenses) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    const totalIncome = bookings.reduce((sum, b) => sum + (b.estimatedTotal || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit = totalIncome - totalExpenses;
    
    document.getElementById('total-income').textContent = `₹${totalIncome.toLocaleString('en-IN')}`;
    document.getElementById('total-expenses').textContent = `₹${totalExpenses.toLocaleString('en-IN')}`;
    document.getElementById('net-profit').textContent = `₹${netProfit.toLocaleString('en-IN')}`;
}

function openAddExpenseModal() {
    document.getElementById('addExpenseModal').classList.add('active');
}

function handleAddExpense(event) {
    event.preventDefault();
    
    const form = event.target;
    const expense = {
        id: 'EXP-' + Date.now(),
        date: form.querySelector('input[type="date"]').value,
        category: form.querySelectorAll('select')[0].value,
        description: form.querySelector('input[type="text"]').value,
        amount: parseInt(form.querySelector('input[type="number"]').value),
    };
    
    let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    alert('Expense added successfully');
    closeModal();
    loadExpenses();
    form.reset();
}

function deleteExpense(expenseId) {
    if (confirm('Delete this expense?')) {
        let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
        expenses = expenses.filter((e) => e.id !== expenseId);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        loadExpenses();
    }
}

function exportAccountingData() {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    let csv = 'Type,Date,Description,Amount\n';
    
    bookings.forEach((b) => {
        csv += `Income,${b.eventDate},Booking ${b.id},${b.estimatedTotal}\n`;
    });
    
    expenses.forEach((e) => {
        csv += `Expense,${e.date},${e.description},${-e.amount}\n`;
    });
    
    downloadCSV(csv, 'accounting-report.csv');
}

// ================================
// REPORTS
// ================================

function generateReport() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    
    const totalIncome = bookings.reduce((sum, b) => sum + (b.estimatedTotal || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    
    document.getElementById('report-total-events').textContent = bookings.length;
    document.getElementById('report-total-revenue').textContent = `₹${totalIncome.toLocaleString('en-IN')}`;
    document.getElementById('report-total-expenses').textContent = `₹${totalExpenses.toLocaleString('en-IN')}`;
    document.getElementById('report-net-profit').textContent = `₹${(totalIncome - totalExpenses).toLocaleString('en-IN')}`;
}

function downloadReport() {
    alert('PDF export functionality coming soon');
}

// ================================
// LOCATIONS
// ================================

function loadLocations() {
    // This would load from backend in production
    const locations = [
        {
            id: 'office',
            name: 'Office Location',
            type: 'office',
            address: 'Srinagar, Jammu & Kashmir',
            lat: 34.083651,
            lng: 74.797371,
        },
        {
            id: 'event1',
            name: 'Current Event',
            type: 'event',
            address: 'Mumbai, Maharashtra',
            lat: 19.0760,
            lng: 72.8777,
        },
    ];
    
    displayLocations(locations);
}

function displayLocations(locations) {
    const tbody = document.getElementById('locations-list-body');
    
    if (locations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No locations</td></tr>';
        return;
    }
    
    tbody.innerHTML = locations
        .map(
            (loc) => `
            <tr>
                <td>${loc.name}</td>
                <td>${loc.type}</td>
                <td>${loc.address}</td>
                <td>${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</td>
                <td>
                    <button class="action-btn" onclick="editLocation('${loc.id}')">✏️</button>
                    <button class="action-btn" onclick="deleteLocation('${loc.id}')">🗑️</button>
                </td>
            </tr>
        `
        )
        .join('');
}

function openAddLocationModal() {
    document.getElementById('addLocationModal').classList.add('active');
}

function handleAddLocation(event) {
    event.preventDefault();
    alert('Location added. This will sync with the frontend map.');
    closeModal();
    event.target.reset();
}

function editLocation(locationId) {
    alert('Edit functionality coming soon');
}

function deleteLocation(locationId) {
    if (confirm('Delete this location?')) {
        alert('Location deleted');
    }
}

// ================================
// MEETINGS
// ================================

function loadMeetings() {
    const meetings = JSON.parse(localStorage.getItem('meetings') || '[]');
    displayMeetings(meetings);
}

function displayMeetings(meetings) {
    const tbody = document.getElementById('meetings-list-body');
    
    if (meetings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No meetings scheduled</td></tr>';
        return;
    }
    
    tbody.innerHTML = meetings
        .map(
            (meeting) => `
            <tr>
                <td>${meeting.customerName}</td>
                <td>${formatDate(meeting.dateTime)}</td>
                <td>${meeting.type}</td>
                <td><a href="${meeting.zoomLink}" target="_blank">Join Meeting</a></td>
                <td>Scheduled</td>
                <td>
                    <button class="action-btn" onclick="deleteMeeting('${meeting.id}')">🗑️</button>
                </td>
            </tr>
        `
        )
        .join('');
}

function openScheduleMeetingModal() {
    document.getElementById('scheduleMeetingModal').classList.add('active');
}

function handleScheduleMeeting(event) {
    event.preventDefault();
    
    const form = event.target;
    const meeting = {
        id: 'MTG-' + Date.now(),
        customerName: form.querySelectorAll('input')[0].value,
        dateTime: form.querySelector('input[type="datetime-local"]').value,
        type: form.querySelector('select').value,
        zoomLink: form.querySelectorAll('input')[1].value,
    };
    
    let meetings = JSON.parse(localStorage.getItem('meetings') || '[]');
    meetings.push(meeting);
    localStorage.setItem('meetings', JSON.stringify(meetings));
    
    alert('Meeting scheduled successfully');
    closeModal();
    loadMeetings();
    form.reset();
}

function deleteMeeting(meetingId) {
    if (confirm('Cancel this meeting?')) {
        let meetings = JSON.parse(localStorage.getItem('meetings') || '[]');
        meetings = meetings.filter((m) => m.id !== meetingId);
        localStorage.setItem('meetings', JSON.stringify(meetings));
        loadMeetings();
    }
}

// ================================
// MODAL MANAGEMENT
// ================================

function closeModal(event) {
    if (event && event.target.className !== 'modal') return;
    
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
        activeModal.classList.remove('active');
    }
}

// ================================
// SIDEBAR
// ================================

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// ================================
// LOGOUT
// ================================

function logoutFromDashboard() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('appState');
        window.location.href = '../index.html';
    }
}

// ================================
// UTILITY FUNCTIONS
// ================================

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Initialize on load
document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', closeModal);
});

// Generate initial report
generateReport();
