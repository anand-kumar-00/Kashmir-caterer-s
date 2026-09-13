/**
 * Kashmir Caterers — admin-dashboard.js
 * All data reads/writes go through /api/* endpoints (no more localStorage for data)
 * Session-guarded: redirects to / if not logged in as employee or admin
 */

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
    await checkAccess();
    setDashboardDate();
    loadUserInfo();
    await syncDashboard();
});

async function checkAccess() {
    try {
        const res  = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) throw new Error('Not authenticated');
        const user = await res.json();
        if (user.role !== 'employee' && user.role !== 'admin') throw new Error('Access denied');
        // Store in window for convenience
        window.currentAdminUser = user;
    } catch (_) {
        window.location.href = '/';
    }
}

function loadUserInfo() {
    const user = window.currentAdminUser;
    if (!user) return;
    const nameEl   = document.getElementById('user-name');
    const roleEl   = document.getElementById('user-role-label');
    const avatarEl = document.querySelector('.user-avatar');
    if (nameEl)   nameEl.textContent   = user.name;
    if (roleEl)   roleEl.textContent   = `${formatStatus(user.role)} access${user.employeeCode ? ' | ' + user.employeeCode : ''}`;
    if (avatarEl) avatarEl.textContent = getInitials(user.name);
}

function setDashboardDate() {
    const el = document.getElementById('dashboard-date');
    if (el) el.textContent = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

async function syncDashboard() {
    await Promise.allSettled([
        loadDashboardStats(),
        loadBookings(),
        loadMenuItems(),
        loadGalleryItems(),
        loadEmployees(),
        loadExpenses(),
        loadLocations(),
        loadMeetings(),
        loadSettings(),
        loadReports(),
        loadLostFound(),
        loadEmergencyContacts(),
        loadPayments(),
    ]);
    // Poll for unread notifications every 60 s
    pollNotifications();
    setInterval(pollNotifications, 60_000);
}

/* ── TAB SWITCHING ─────────────────────────────────────────── */
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

    const tab = document.getElementById(`${tabName}-tab`);
    if (tab) tab.classList.add('active');

    const navItem = document.querySelector(`a[onclick="switchTab('${tabName}')"]`);
    if (navItem) navItem.classList.add('active');

    const titles = {
        dashboard:'Dashboard', bookings:'Booking Management', employees:'Employee Management',
        menu:'Menu Management', gallery:'Gallery Management', accounting:'Accounting & Salary',
        accounts:'Account Center', reports:'Reports', locations:'Locations', meetings:'Meetings',
        settings:'Settings', 'lost-found':'Lost & Found', emergency:'Emergency Contacts',
        payments:'Payment Management',
    };
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = titles[tabName] || 'Dashboard';
}

/* ── DASHBOARD STATS ───────────────────────────────────────── */
async function loadDashboardStats() {
    const res  = await apiFetch('/api/admin/reports');
    const data = await res.json();
    setText('total-bookings',      data.totalBookings);
    setText('confirmed-bookings',  data.confirmedBookings);
    setText('cancelled-bookings',  data.cancelledBookings);
    setText('pending-payments',    data.pendingPayments);
    setText('total-revenue',       formatCurrency(data.totalIncome));
    setText('total-income',        formatCurrency(data.totalIncome));
    setText('total-expenses',      formatCurrency(data.totalExpenses));
    setText('total-salary-payable',formatCurrency(data.totalSalary));
    setText('net-profit',          formatCurrency(data.netProfit));
    await loadRecentBookings();
}

/* ── BOOKINGS ──────────────────────────────────────────────── */
async function loadBookings() {
    const res      = await apiFetch('/api/bookings');
    const bookings = await res.json();
    displayBookings(bookings);
}

async function loadRecentBookings() {
    const res      = await apiFetch('/api/bookings?limit=5');
    const bookings = await res.json();
    const tbody    = document.getElementById('recent-bookings-list');
    if (!tbody) return;
    if (!bookings.length) { tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No bookings yet</td></tr>'; return; }
    tbody.innerHTML = bookings.slice(0, 5).map(b => `
        <tr>
            <td><strong>${escHtml(b.id)}</strong></td>
            <td>${escHtml(b.customerName || 'Guest')}</td>
            <td>${formatDate(b.eventDate)}</td>
            <td>${formatCurrency(b.estimatedTotal)}</td>
            <td><span class="status-badge ${b.status}">${formatStatus(b.status)}</span></td>
            <td>
                <button class="action-btn" onclick="viewBookingDetails('${b.id}')">View</button>
                <button class="action-btn" onclick="promptCancelBooking('${b.id}')">Cancel</button>
            </td>
        </tr>
    `).join('');
}

function displayBookings(bookings) {
    const tbody = document.getElementById('bookings-list-body');
    if (!tbody) return;
    if (!bookings.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No bookings found</td></tr>'; return; }
    tbody.innerHTML = bookings.map(b => `
        <tr>
            <td><strong>${escHtml(b.id)}</strong></td>
            <td>${escHtml(b.customerName || 'Guest')}</td>
            <td>${formatDate(b.eventDate)}</td>
            <td>${escHtml(b.functionType || '—')}</td>
            <td>${formatCurrency(b.estimatedTotal)}</td>
            <td><span class="status-badge ${b.status}">${formatStatus(b.status)}</span></td>
            <td>
                <button class="action-btn" onclick="viewBookingDetails('${b.id}')">View</button>
                <button class="action-btn" onclick="promptUpdateStatus('${b.id}')">Status</button>
                <button class="action-btn" onclick="promptCancelBooking('${b.id}')">Cancel</button>
            </td>
        </tr>
    `).join('');
}

async function filterBookings() {
    const status = document.getElementById('status-filter')?.value || '';
    const date   = document.getElementById('date-filter')?.value   || '';
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (date)   params.set('date', date);
    const res      = await apiFetch(`/api/bookings?${params}`);
    const bookings = await res.json();
    displayBookings(bookings);
}

async function viewBookingDetails(id) {
    const res     = await apiFetch(`/api/bookings/${id}`);
    const booking = await res.json();
    alert(`Booking: ${booking.id}\nCustomer: ${booking.customerName}\nEvent: ${formatDate(booking.eventDate)}\nFunction: ${booking.functionType}\nGuests: ${booking.guestCount}\nAmount: ${formatCurrency(booking.estimatedTotal)}\nStatus: ${formatStatus(booking.status)}\nRequirements: ${booking.requirements || 'None'}`);
}

async function promptUpdateStatus(id) {
    const newStatus = prompt('New status:\npending_payment | confirmed | completed | cancelled');
    if (!['pending_payment','confirmed','completed','cancelled'].includes(newStatus)) { alert('Invalid status'); return; }
    await apiFetch(`/api/bookings/${id}`, { method:'PATCH', body: JSON.stringify({ status: newStatus }) });
    await syncDashboard();
    showDashboardNotification('Booking status updated', 'success');
}

async function promptCancelBooking(id) {
    if (!confirm('Cancel this booking?')) return;
    await apiFetch(`/api/bookings/${id}`, { method: 'DELETE' });
    await syncDashboard();
    showDashboardNotification('Booking cancelled', 'success');
}

/* ── MENU ──────────────────────────────────────────────────── */
async function loadMenuItems() {
    const res   = await apiFetch('/api/menu');
    const items = await res.json();

    ['breakfast','lunch','dinner'].forEach(cat => {
        const container = document.getElementById(`${cat}-items`);
        if (!container) return;
        const catItems = items.filter(i => i.category === cat);
        if (!catItems.length) { container.innerHTML = '<p style="color:var(--color-muted)">No items yet</p>'; return; }
        container.innerHTML = catItems.map(item => `
            <div class="menu-item-card">
                <div class="menu-item-info">
                    <h4>${escHtml(item.name)}</h4>
                    <p style="color:var(--color-muted);font-size:.85rem">${escHtml(item.type)}</p>
                    <p style="font-size:.85rem">${escHtml(item.description || '')}</p>
                </div>
                <div style="text-align:right">
                    <div class="menu-item-price">${formatCurrency(item.price)}</div>
                    <button class="action-btn" onclick="promptEditMenuItem('${item.id}','${escHtml(item.name)}',${item.price},'${escHtml(item.description || '')}')">Edit</button>
                    <button class="action-btn" onclick="deleteMenuItem('${item.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    });
}

function openAddMenuModal() { document.getElementById('addMenuModal')?.classList.add('active'); }

async function handleAddMenuItem(event) {
    event.preventDefault();
    const form = event.target;
    const body = {
        name:        form.querySelector('input[type="text"]').value,
        category:    form.querySelectorAll('select')[0].value,
        type:        form.querySelectorAll('select')[1].value,
        price:       parseInt(form.querySelector('input[type="number"]').value, 10),
        description: form.querySelector('textarea').value,
    };
    const res = await apiFetch('/api/menu', { method:'POST', body: JSON.stringify(body) });
    if (res.ok) { closeModal(); form.reset(); await loadMenuItems(); showDashboardNotification('Menu item added', 'success'); }
    else { const d = await res.json(); alert(d.error); }
}

async function promptEditMenuItem(id, name, price, description) {
    const newName  = prompt('Item name', name);
    if (newName === null) return;
    const newPrice = prompt('Price (₹)', String(price));
    if (newPrice === null) return;
    const newDesc  = prompt('Description', description);
    if (newDesc === null) return;
    await apiFetch(`/api/menu/${id}`, { method:'PATCH', body: JSON.stringify({ name:newName, price:Number(newPrice), description:newDesc }) });
    await loadMenuItems();
}

async function deleteMenuItem(id) {
    if (!confirm('Delete this menu item?')) return;
    await apiFetch(`/api/menu/${id}`, { method:'DELETE' });
    await loadMenuItems();
}

/* ── GALLERY ───────────────────────────────────────────────── */
async function loadGalleryItems() {
    const res   = await apiFetch('/api/gallery');
    const items = await res.json();
    const container = document.getElementById('gallery-admin-list');
    if (!container) return;
    if (!items.length) { container.innerHTML = '<div class="empty-state-panel">No gallery items added</div>'; return; }
    container.innerHTML = items.map(item => `
        <article class="gallery-admin-card">
            <img src="${escHtml(item.image_url)}" alt="${escHtml(item.title || 'Gallery image')}">
            <div class="gallery-admin-content">
                <h4>${escHtml(item.title || 'Gallery Item')}</h4>
                <p style="font-size:.8rem;color:var(--color-muted);word-break:break-all">${escHtml(item.image_url)}</p>
                <div class="gallery-admin-actions">
                    <button class="action-btn" onclick="promptEditGalleryItem('${item.id}','${escHtml(item.title)}','${escHtml(item.image_url)}')">Edit</button>
                    <button class="action-btn" onclick="deleteGalleryItem('${item.id}')">Delete</button>
                </div>
            </div>
        </article>
    `).join('');
}

function openAddGalleryModal() { document.getElementById('addGalleryModal')?.classList.add('active'); }

async function handleAddGalleryItem(event) {
    event.preventDefault();
    const inputs = event.target.querySelectorAll('input');
    const body   = { title: inputs[0].value.trim(), imageUrl: inputs[1].value.trim() };
    const res    = await apiFetch('/api/gallery', { method:'POST', body: JSON.stringify(body) });
    if (res.ok) { closeModal(); event.target.reset(); await loadGalleryItems(); showDashboardNotification('Gallery item added', 'success'); }
    else { const d = await res.json(); alert(d.error); }
}

async function promptEditGalleryItem(id, title, imageUrl) {
    const newTitle = prompt('Title', title);
    if (newTitle === null) return;
    const newUrl   = prompt('Image URL or path', imageUrl);
    if (newUrl === null) return;
    await apiFetch(`/api/gallery/${id}`, { method:'PATCH', body: JSON.stringify({ title:newTitle, image_url:newUrl }) });
    await loadGalleryItems();
}

async function deleteGalleryItem(id) {
    if (!confirm('Delete this gallery item?')) return;
    await apiFetch(`/api/gallery/${id}`, { method:'DELETE' });
    await loadGalleryItems();
}

/* ── EMPLOYEES ─────────────────────────────────────────────── */
async function loadEmployees() {
    const res   = await apiFetch('/api/admin/employees');
    const emps  = await res.json();
    const tbody = document.getElementById('employees-list-body');
    if (!tbody) return;
    if (!emps.length) { tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No employees added</td></tr>'; return; }
    tbody.innerHTML = emps.map(e => `
        <tr>
            <td><strong>${escHtml(e.employee_code || '—')}</strong></td>
            <td>${escHtml(e.name)}</td>
            <td>${formatStatus(e.job_role)}</td>
            <td>${escHtml(e.email || '—')}</td>
            <td>${formatCurrency(e.daily_rate)}</td>
            <td>${e.days_worked || 0}</td>
            <td>${formatCurrency(e.advance_paid)}</td>
            <td>
                <button class="action-btn" onclick="promptEditEmployee('${e.id}')">Edit</button>
                <button class="action-btn" onclick="promptEditPayroll('${e.id}')">Salary</button>
            </td>
        </tr>
    `).join('');

    // Also populate salary sheet
    displaySalarySheet(emps);
}

async function promptEditEmployee(id) {
    const res = await apiFetch('/api/admin/employees');
    const emp = (await res.json()).find(e => e.id === id);
    if (!emp) return;
    const name     = prompt('Employee name', emp.name);      if (name === null) return;
    const email    = prompt('Email',         emp.email || ''); if (email === null) return;
    const jobRole  = prompt('Job role (manager/cook/waiter/co-helper/accountant/staff)', emp.job_role || 'staff'); if (jobRole === null) return;
    const dailyRate = prompt('Daily salary rate', String(emp.daily_rate || 0)); if (dailyRate === null) return;
    await apiFetch(`/api/admin/employees/${id}`, { method:'PATCH', body: JSON.stringify({ name, email, job_role:jobRole, daily_rate:Number(dailyRate) }) });
    await loadEmployees();
}

async function promptEditPayroll(id) {
    const res = await apiFetch('/api/admin/employees');
    const emp = (await res.json()).find(e => e.id === id);
    if (!emp) return;
    const days    = prompt('Days worked', String(emp.days_worked || 0));   if (days === null) return;
    const advance = prompt('Advance paid', String(emp.advance_paid || 0)); if (advance === null) return;
    const rate    = prompt('Daily rate',   String(emp.daily_rate || 0));   if (rate === null) return;
    await apiFetch(`/api/admin/employees/${id}`, { method:'PATCH', body: JSON.stringify({ days_worked:Number(days), advance_paid:Number(advance), daily_rate:Number(rate) }) });
    await loadEmployees();
    await loadDashboardStats();
}

function displaySalarySheet(employees) {
    const tbody = document.getElementById('salary-list-body');
    if (!tbody) return;
    if (!employees.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No salary data</td></tr>'; return; }
    tbody.innerHTML = employees.map(e => {
        const gross  = (e.daily_rate || 0) * (e.days_worked || 0);
        const net    = gross - (e.advance_paid || 0);
        return `
        <tr>
            <td>${escHtml(e.name)}</td>
            <td>${formatStatus(e.job_role)}</td>
            <td>${formatCurrency(e.daily_rate)}</td>
            <td>${e.days_worked || 0}</td>
            <td>${formatCurrency(e.advance_paid)}</td>
            <td>${formatCurrency(net)}</td>
            <td><button class="action-btn" onclick="promptEditPayroll('${e.id}')">Edit</button></td>
        </tr>`;
    }).join('');
}

function openAddEmployeeModal() { document.getElementById('addEmployeeModal')?.classList.add('active'); }

async function handleAddEmployee(event) {
    event.preventDefault();
    const form    = event.target;
    const inputs  = form.querySelectorAll('input');
    const selects = form.querySelectorAll('select');
    const body = {
        name:         inputs[0].value.trim(),
        employeeCode: inputs[1].value.trim().toUpperCase(),
        email:        inputs[2].value.trim(),
        password:     inputs[3].value,
        role:         selects[0].value,
        jobRole:      selects[1].value,
        dailyRate:    Number(inputs[4].value || 0),
    };
    const res = await apiFetch('/api/admin/employees', { method:'POST', body: JSON.stringify(body) });
    if (res.ok) { closeModal(); form.reset(); await loadEmployees(); showDashboardNotification('Employee added', 'success'); }
    else { const d = await res.json(); alert(d.error); }
}

/* ── EXPENSES ──────────────────────────────────────────────── */
async function loadExpenses() {
    const res      = await apiFetch('/api/admin/expenses');
    const expenses = await res.json();
    const tbody    = document.getElementById('expenses-list');
    if (!tbody) return;
    if (!expenses.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No expenses recorded</td></tr>'; return; }
    tbody.innerHTML = expenses.map(e => `
        <tr>
            <td>${formatDate(e.date)}</td>
            <td>${escHtml(e.category)}</td>
            <td>${escHtml(e.description)}</td>
            <td>${formatCurrency(e.amount)}</td>
            <td><button class="action-btn" onclick="deleteExpense('${e.id}')">Delete</button></td>
        </tr>
    `).join('');
}

function openAddExpenseModal() { document.getElementById('addExpenseModal')?.classList.add('active'); }

async function handleAddExpense(event) {
    event.preventDefault();
    const body = {
        date:        document.getElementById('expense-date').value,
        category:    document.getElementById('expense-category').value,
        description: document.getElementById('expense-description').value,
        amount:      parseInt(document.getElementById('expense-amount').value, 10),
    };
    const res = await apiFetch('/api/admin/expenses', { method:'POST', body: JSON.stringify(body) });
    if (res.ok) { closeModal(); event.target.reset(); await loadExpenses(); await loadDashboardStats(); showDashboardNotification('Expense recorded', 'success'); }
    else { const d = await res.json(); alert(d.error); }
}

async function deleteExpense(id) {
    if (!confirm('Delete this expense?')) return;
    await apiFetch(`/api/admin/expenses/${id}`, { method:'DELETE' });
    await loadExpenses(); await loadDashboardStats();
}

/* ── LOCATIONS ─────────────────────────────────────────────── */
async function loadLocations() {
    const res   = await apiFetch('/api/admin/locations');
    const locs  = await res.json();
    const tbody = document.getElementById('locations-list-body');
    if (!tbody) return;
    if (!locs.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No locations</td></tr>'; return; }
    tbody.innerHTML = locs.map(l => `
        <tr>
            <td>${escHtml(l.name)}</td>
            <td>${escHtml(l.type)}</td>
            <td>${escHtml(l.address)}</td>
            <td>${l.lat ? Number(l.lat).toFixed(4) : '—'}, ${l.lng ? Number(l.lng).toFixed(4) : '—'}</td>
            <td>
                <button class="action-btn" onclick="promptEditLocation('${l.id}')">Edit</button>
                <button class="action-btn" onclick="deleteLocation('${l.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openAddLocationModal() { document.getElementById('addLocationModal')?.classList.add('active'); }

async function handleAddLocation(event) {
    event.preventDefault();
    const inputs = event.target.querySelectorAll('input');
    const body   = { name:inputs[0].value, type:event.target.querySelector('select').value, address:inputs[1].value, lat:inputs[2].value, lng:inputs[3].value };
    const res    = await apiFetch('/api/admin/locations', { method:'POST', body: JSON.stringify(body) });
    if (res.ok) { closeModal(); event.target.reset(); await loadLocations(); }
    else { const d = await res.json(); alert(d.error); }
}

async function promptEditLocation(id) {
    const res  = await apiFetch('/api/admin/locations');
    const loc  = (await res.json()).find(l => l.id === id);
    if (!loc) return;
    const name    = prompt('Name',      loc.name);    if (name === null) return;
    const address = prompt('Address',   loc.address); if (address === null) return;
    const lat     = prompt('Latitude',  String(loc.lat || '')); if (lat === null) return;
    const lng     = prompt('Longitude', String(loc.lng || '')); if (lng === null) return;
    await apiFetch(`/api/admin/locations/${id}`, { method:'PATCH', body: JSON.stringify({ name, address, lat:Number(lat), lng:Number(lng) }) });
    await loadLocations();
}

async function deleteLocation(id) {
    if (!confirm('Delete this location?')) return;
    await apiFetch(`/api/admin/locations/${id}`, { method:'DELETE' });
    await loadLocations();
}

/* ── MEETINGS ──────────────────────────────────────────────── */
async function loadMeetings() {
    const res      = await apiFetch('/api/admin/meetings');
    const meetings = await res.json();
    const tbody    = document.getElementById('meetings-list-body');
    if (!tbody) return;
    if (!meetings.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No meetings scheduled</td></tr>'; return; }
    tbody.innerHTML = meetings.map(m => `
        <tr>
            <td>${escHtml(m.customer_name)}</td>
            <td>${formatDate(m.date_time)}</td>
            <td>${escHtml(m.type)}</td>
            <td>${m.zoom_link ? `<a href="${escHtml(m.zoom_link)}" target="_blank" rel="noopener">Join Meeting</a>` : '—'}</td>
            <td><button class="action-btn" onclick="deleteMeeting('${m.id}')">Delete</button></td>
        </tr>
    `).join('');
}

function openScheduleMeetingModal() { document.getElementById('scheduleMeetingModal')?.classList.add('active'); }

async function handleScheduleMeeting(event) {
    event.preventDefault();
    const form = event.target;
    const body = {
        customerName: form.querySelectorAll('input')[0].value,
        dateTime:     form.querySelector('input[type="datetime-local"]').value,
        type:         form.querySelector('select').value,
        zoomLink:     form.querySelectorAll('input')[1]?.value || '',
    };
    const res = await apiFetch('/api/admin/meetings', { method:'POST', body: JSON.stringify(body) });
    if (res.ok) { closeModal(); form.reset(); await loadMeetings(); }
    else { const d = await res.json(); alert(d.error); }
}

async function deleteMeeting(id) {
    if (!confirm('Cancel this meeting?')) return;
    await apiFetch(`/api/admin/meetings/${id}`, { method:'DELETE' });
    await loadMeetings();
}

/* ── SETTINGS ──────────────────────────────────────────────── */
async function loadSettings() {
    const res      = await apiFetch('/api/admin/settings');
    const settings = await res.json();
    const map = {
        businessName:    'setting-business-name',
        businessPhone:   'setting-business-phone',
        businessEmail:   'setting-business-email',
        businessAddress: 'setting-business-address',
    };
    Object.entries(map).forEach(([key, elId]) => {
        const el = document.getElementById(elId);
        if (el && settings[key]) el.value = settings[key];
    });
}

async function saveSettings(event) {
    event.preventDefault();
    const body = {
        businessName:    document.getElementById('setting-business-name')?.value || '',
        businessPhone:   document.getElementById('setting-business-phone')?.value || '',
        businessEmail:   document.getElementById('setting-business-email')?.value || '',
        businessAddress: document.getElementById('setting-business-address')?.value || '',
    };
    await apiFetch('/api/admin/settings', { method:'PATCH', body: JSON.stringify(body) });
    showDashboardNotification('Settings saved', 'success');
}

/* ── REPORTS ───────────────────────────────────────────────── */
async function loadReports() {
    // Stats already loaded by loadDashboardStats
    // Could render charts here if needed
}

/* ── LOST & FOUND ───────────────────────────────────────────── */
async function loadLostFound() {
    const res   = await apiFetch('/api/lost-found');
    const tbody = document.getElementById('lost-found-tbody');
    if (!tbody) return;
    if (!res.ok) { tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Failed to load</td></tr>'; return; }
    const items = await res.json();
    if (!items.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No reports yet</td></tr>'; return; }
    tbody.innerHTML = items.map(item => `
        <tr>
            <td><code>${escHtml(item.ref_id)}</code></td>
            <td><span class="badge badge-${item.type === 'lost' ? 'warning' : 'success'}">${escHtml(item.type)}</span></td>
            <td>${escHtml(item.item_name)}</td>
            <td>${escHtml(item.location)}</td>
            <td>${escHtml(item.contact_name)}<br><small>${escHtml(item.contact_phone)}</small></td>
            <td><span class="badge badge-${item.status === 'open' ? 'info' : item.status === 'resolved' ? 'success' : 'muted'}">${escHtml(item.status)}</span></td>
            <td class="action-cell">
                <button class="action-btn" onclick="resolveLostFound('${item.id}','${item.status}')">
                    ${item.status === 'open' ? 'Resolve' : 'Reopen'}
                </button>
                <button class="action-btn danger" onclick="deleteLostFound('${item.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function resolveLostFound(id, currentStatus) {
    const newStatus = currentStatus === 'open' ? 'resolved' : 'open';
    const res = await apiFetch(`/api/lost-found/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) { await loadLostFound(); showDashboardNotification(`Marked as ${newStatus}`); }
    else { const d = await res.json(); showDashboardNotification(d.error, 'error'); }
}

async function deleteLostFound(id) {
    if (!confirm('Permanently delete this report?')) return;
    await apiFetch(`/api/lost-found/${id}`, { method: 'DELETE' });
    await loadLostFound();
}

/* ── EMERGENCY CONTACTS ────────────────────────────────────── */
async function loadEmergencyContacts() {
    const res   = await apiFetch('/api/emergency/all');
    const tbody = document.getElementById('emergency-tbody');
    if (!tbody) return;
    if (!res.ok) { tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Failed to load</td></tr>'; return; }
    const contacts = await res.json();
    if (!contacts.length) { tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No contacts configured</td></tr>'; return; }
    tbody.innerHTML = contacts.map(c => `
        <tr>
            <td>${escHtml(c.name)}</td>
            <td>${escHtml(c.role)}</td>
            <td><a href="tel:${escHtml(c.phone)}">${escHtml(c.phone)}</a>${c.phone_alt ? `<br><small>${escHtml(c.phone_alt)}</small>` : ''}</td>
            <td><span class="badge badge-${c.category}">${escHtml(c.category)}</span></td>
            <td>${c.is_active ? '✓ Active' : '✗ Inactive'}</td>
            <td class="action-cell">
                <button class="action-btn" onclick="toggleEmergencyContact('${c.id}',${c.is_active})">
                    ${c.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button class="action-btn danger" onclick="deleteEmergencyContact('${c.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openAddEmergencyModal() {
    document.getElementById('addEmergencyModal')?.classList.add('active');
}

async function handleAddEmergency(event) {
    event.preventDefault();
    const form = event.target;
    const body = {
        name:      form.querySelector('#ec-name').value.trim(),
        role:      form.querySelector('#ec-role').value.trim(),
        phone:     form.querySelector('#ec-phone').value.trim(),
        phoneAlt:  form.querySelector('#ec-phone-alt').value.trim(),
        category:  form.querySelector('#ec-category').value,
        sortOrder: Number(form.querySelector('#ec-sort').value || 0),
    };
    const res = await apiFetch('/api/emergency', { method: 'POST', body: JSON.stringify(body) });
    if (res.ok) { closeModal(); form.reset(); await loadEmergencyContacts(); }
    else { const d = await res.json(); showDashboardNotification(d.error || 'Failed to add', 'error'); }
}

async function toggleEmergencyContact(id, isActive) {
    await apiFetch(`/api/emergency/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: isActive ? 0 : 1 }),
    });
    await loadEmergencyContacts();
}

async function deleteEmergencyContact(id) {
    if (!confirm('Delete this emergency contact?')) return;
    await apiFetch(`/api/emergency/${id}`, { method: 'DELETE' });
    await loadEmergencyContacts();
}

/* ── NOTIFICATIONS BELL ─────────────────────────────────────── */
async function pollNotifications() {
    try {
        const res  = await apiFetch('/api/notifications/unread');
        const data = await res.json();
        const bell = document.getElementById('notif-bell');
        const badge = document.getElementById('notif-badge');
        if (!bell || !badge) return;
        const count = data.count || 0;
        badge.textContent  = count > 9 ? '9+' : String(count);
        badge.style.display = count > 0 ? 'flex' : 'none';
    } catch (_) {}
}

async function openNotificationsPanel() {
    const panel = document.getElementById('notifications-panel');
    if (!panel) return;
    panel.classList.toggle('active');
    if (!panel.classList.contains('active')) return;

    const res    = await apiFetch('/api/notifications');
    const items  = await res.json();
    const list   = document.getElementById('notif-list');
    if (!list) return;

    if (!items.length) {
        list.innerHTML = '<li class="notif-empty">No notifications</li>';
        return;
    }
    list.innerHTML = items.map(n => `
        <li class="notif-item${n.is_read ? '' : ' unread'}" onclick="markNotifRead('${n.id}',this)">
            <span class="notif-type">${escHtml(n.type.replace(/_/g,' '))}</span>
            <strong>${escHtml(n.title)}</strong>
            <p>${escHtml(n.body)}</p>
            <small>${formatDate(n.created_at)}</small>
        </li>
    `).join('');
}

async function markNotifRead(id, el) {
    await apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    el?.classList.remove('unread');
    pollNotifications();
}

async function markAllNotifsRead() {
    await apiFetch('/api/notifications/mark-all-read', { method: 'PATCH' });
    document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
    const badge = document.getElementById('notif-badge');
    if (badge) badge.style.display = 'none';
}

/* ── PAYMENTS ───────────────────────────────────────────────── */

const PAYMENT_STATUS_LABELS = {
    unpaid:       { label: 'Unpaid',        cls: 'badge-warning' },
    advance_paid: { label: 'Advance Paid',  cls: 'badge-info' },
    paid:         { label: 'Fully Paid',    cls: 'badge-success' },
    refunded:     { label: 'Refunded',      cls: 'badge-muted' },
};

async function loadPayments() {
    // Load payment summary cards
    const sumRes = await apiFetch('/api/payments/summary');
    if (sumRes.ok) {
        const s = await sumRes.json();
        setText('pay-stat-unpaid',    s.unpaid?.count ?? '—');
        setText('pay-stat-advance',   s.advance_paid?.count ?? '—');
        setText('pay-stat-paid',      s.paid?.count ?? '—');
        setText('pay-pending-value',  formatCurrency((s.unpaid?.totalBalance || 0) + (s.advance_paid?.totalBalance || 0)));
        setText('pay-collected',      formatCurrency(s.advance_paid?.totalAdvance || 0));
        setText('pay-full-collected', formatCurrency(s.paid?.totalValue || 0));
    }

    // Load payment rows (all bookings, sorted by payment_status)
    const bRes = await apiFetch('/api/bookings');
    const tbody = document.getElementById('payments-tbody');
    if (!tbody) return;
    if (!bRes.ok) { tbody.innerHTML = '<tr><td colspan="8" class="empty-state">Failed to load</td></tr>'; return; }
    const bookings = await bRes.json();
    if (!bookings.length) { tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No bookings yet</td></tr>'; return; }

    tbody.innerHTML = bookings.map(b => {
        const ps = PAYMENT_STATUS_LABELS[b.paymentStatus || 'unpaid'] || PAYMENT_STATUS_LABELS.unpaid;
        const proofHtml = b.paymentProof
            ? `<a href="${escHtml(b.paymentProof)}" target="_blank" rel="noopener" class="action-btn" style="text-decoration:none">View Proof</a>`
            : '<span style="color:#aaa;font-size:.78rem">No proof</span>';
        return `
        <tr>
            <td><code style="font-size:.8rem">${escHtml(b.id)}</code></td>
            <td>${escHtml(b.customerName || '—')}<br><small>${escHtml(b.customerPhone || '')}</small></td>
            <td>${formatDate(b.eventDate)}<br><small>${escHtml(b.functionType || '—')}</small></td>
            <td>${formatCurrency(b.estimatedTotal)}</td>
            <td>${formatCurrency(b.advanceAmount || 0)}</td>
            <td>${formatCurrency(b.balanceAmount || 0)}</td>
            <td>
                <span class="badge ${ps.cls}">${ps.label}</span>
                ${b.paymentMethod ? `<br><small>${escHtml(b.paymentMethod)}</small>` : ''}
            </td>
            <td class="action-cell">
                ${proofHtml}
                <button class="action-btn" onclick="openPaymentUpdateModal('${b.id}','${b.paymentStatus || 'unpaid'}',${b.advanceAmount || 0},${b.balanceAmount || 0},'${escHtml(b.paymentMethod || '')}')">Update</button>
            </td>
        </tr>`;
    }).join('');
}

function openPaymentUpdateModal(bookingId, payStatus, advance, balance, method) {
    const modal = document.getElementById('paymentUpdateModal');
    if (!modal) return;
    document.getElementById('pu-booking-id').value   = bookingId;
    document.getElementById('pu-payment-status').value = payStatus;
    document.getElementById('pu-advance').value        = advance;
    document.getElementById('pu-balance').value        = balance;
    document.getElementById('pu-method').value         = method;
    document.getElementById('pu-notes').value          = '';
    modal.classList.add('active');
}

async function handlePaymentUpdate(event) {
    event.preventDefault();
    const id      = document.getElementById('pu-booking-id').value;
    const body = {
        payment_status: document.getElementById('pu-payment-status').value,
        advance_amount: Number(document.getElementById('pu-advance').value || 0),
        balance_amount: Number(document.getElementById('pu-balance').value || 0),
        payment_method: document.getElementById('pu-method').value,
        payment_notes:  document.getElementById('pu-notes').value.trim(),
    };
    const res = await apiFetch(`/api/payments/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
    if (res.ok) {
        closeModal();
        await loadPayments();
        showDashboardNotification('Payment updated');
    } else {
        const d = await res.json();
        showDashboardNotification(d.error || 'Update failed', 'error');
    }
}

/* ── LOGOUT ────────────────────────────────────────────────── */
async function logoutFromDashboard() {
    await fetch('/api/auth/logout', { method:'POST', credentials:'include' });
    window.location.href = '/';
}

/* ── MODAL HELPERS ─────────────────────────────────────────── */
function closeModal() {
    document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
}
document.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) closeModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.toggle('collapsed');
}

/* ── API HELPER ────────────────────────────────────────────── */
async function apiFetch(url, options = {}) {
    const defaults = {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    };
    try {
        return await fetch(url, { ...defaults, ...options });
    } catch (err) {
        console.error('API error:', url, err);
        return { ok: false, json: async () => ({ error: 'Network error' }) };
    }
}

/* ── SHARED UTILITIES ──────────────────────────────────────── */
function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}
function formatCurrency(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN');
}
function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr
        : d.toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' });
}
function formatStatus(status) {
    if (!status) return '—';
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function getInitials(name) {
    return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function showDashboardNotification(msg, type = 'success') {
    // Simple alert fallback — can be enhanced with toast
    const existing = document.getElementById('dash-notif');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.id = 'dash-notif';
    el.style.cssText = `position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;padding:.75rem 1.5rem;
        border-radius:8px;font-weight:600;color:#fff;font-size:.9rem;
        background:${type === 'success' ? '#27ae60' : '#c0392b'};
        box-shadow:0 4px 12px rgba(0,0,0,.15);`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}
