/* ================================
   AUTHENTICATION SYSTEM
   ================================ */

const defaultEmployeeUsers = [
    {
        id: 'EMP-ADMIN-001',
        employeeCode: 'KC-ADMIN-001',
        name: 'Kashmir Admin',
        email: 'admin@kashmircaterers.local',
        password: btoa('admin123'),
        role: 'admin',
        jobRole: 'manager',
        dailyRate: 2500,
        daysWorked: 26,
        advancePaid: 5000,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'EMP-MANAGER-001',
        employeeCode: 'KC-EMP-101',
        name: 'Operations Manager',
        email: 'manager@kashmircaterers.local',
        password: btoa('manager123'),
        role: 'employee',
        jobRole: 'manager',
        dailyRate: 1800,
        daysWorked: 24,
        advancePaid: 3000,
        createdAt: new Date().toISOString(),
    },
];

let usersDatabase = JSON.parse(localStorage.getItem('usersDatabase') || '[]');
let employeesDatabase = JSON.parse(localStorage.getItem('employeesDatabase') || '[]');

initializeAuthData();

function initializeAuthData() {
    if (usersDatabase.length === 0) {
        usersDatabase = [...defaultEmployeeUsers];
        localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase));
    }

    if (employeesDatabase.length === 0) {
        employeesDatabase = defaultEmployeeUsers.map((user) => createEmployeeRecordFromUser(user));
        localStorage.setItem('employeesDatabase', JSON.stringify(employeesDatabase));
    }
}

function createEmployeeRecordFromUser(user) {
    return {
        id: user.id,
        employeeCode: user.employeeCode,
        name: user.name,
        email: user.email,
        role: user.role,
        jobRole: user.jobRole || 'staff',
        dailyRate: Number(user.dailyRate || 0),
        daysWorked: Number(user.daysWorked || 0),
        advancePaid: Number(user.advancePaid || 0),
        isActive: user.isActive !== false,
        createdAt: user.createdAt || new Date().toISOString(),
    };
}

function syncEmployeesDatabaseFromUsers() {
    employeesDatabase = JSON.parse(localStorage.getItem('employeesDatabase') || '[]');
    usersDatabase.forEach((user) => {
        if (user.role !== 'employee' && user.role !== 'admin') {
            return;
        }

        const existingEmployeeIndex = employeesDatabase.findIndex((employee) => employee.id === user.id);
        const employeeRecord = createEmployeeRecordFromUser(user);

        if (existingEmployeeIndex === -1) {
            employeesDatabase.push(employeeRecord);
        } else {
            employeesDatabase[existingEmployeeIndex] = {
                ...employeesDatabase[existingEmployeeIndex],
                ...employeeRecord,
            };
        }
    });

    localStorage.setItem('employeesDatabase', JSON.stringify(employeesDatabase));
}

// ================================
// LOGIN MODAL
// ================================

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
}

function closeLoginModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('loginModal');
    modal.classList.remove('active');
}

// ================================
// SIGNUP MODAL
// ================================

function openSignupModal() {
    const modal = document.getElementById('signupModal');
    modal.classList.add('active');
}

function closeSignupModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('signupModal');
    modal.classList.remove('active');
}

// ================================
// SWITCH BETWEEN LOGIN & SIGNUP
// ================================

function switchToSignup(event) {
    event.preventDefault();
    closeLoginModal();
    setTimeout(() => {
        openSignupModal();
    }, 300);
}

function switchToLogin(event) {
    event.preventDefault();
    closeSignupModal();
    setTimeout(() => {
        openLoginModal();
    }, 300);
}

// ================================
// HANDLE LOGIN
// ================================

async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const identifier = form.querySelector('input[type="text"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;

    if (!identifier) {
        showNotification('Enter your email or employee ID', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    try {
        const user = authenticateUser(identifier, password);

        if (!user) {
            showNotification('Invalid login details', 'error');
            return;
        }

        const role = user.role || 'customer';
        appState.isLoggedIn = true;
        appState.userRole = role;
        appState.currentUser = {
            id: user.id,
            employeeCode: user.employeeCode || null,
            name: user.name,
            email: user.email,
            role,
        };
        saveState();
        updateAuthUI();
        closeLoginModal();
        showNotification(`Welcome back, ${user.name}!`, 'success');

        setTimeout(() => {
            if (role === 'employee' || role === 'admin') {
                window.location.href = 'admin/dashboard.html';
            } else {
                window.location.reload();
            }
        }, 1000);
    } catch (error) {
        handleError(error, 'Login failed');
    }
}

// ================================
// HANDLE SIGNUP
// ================================

async function handleSignup(event) {
    event.preventDefault();

    const form = event.target;
    const inputs = form.querySelectorAll('input');
    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;

    if (!name || name.length < 3) {
        showNotification('Name must be at least 3 characters', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Invalid email address', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    try {
        usersDatabase = JSON.parse(localStorage.getItem('usersDatabase') || '[]');
        const existingUser = usersDatabase.find((user) => user.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            showNotification('Email already registered', 'error');
            return;
        }

        const newUser = {
            id: generateUserId(),
            name,
            email,
            password: hashPassword(password),
            role: 'customer',
            createdAt: new Date().toISOString(),
        };

        usersDatabase.push(newUser);
        localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase));

        appState.isLoggedIn = true;
        appState.userRole = 'customer';
        appState.currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        };
        saveState();
        updateAuthUI();
        closeSignupModal();
        showNotification(`Welcome, ${name}! Account created successfully.`, 'success');

        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        handleError(error, 'Signup failed');
    }
}

// ================================
// AUTHENTICATION HELPERS
// ================================

function authenticateUser(identifier, password) {
    usersDatabase = JSON.parse(localStorage.getItem('usersDatabase') || '[]');
    syncEmployeesDatabaseFromUsers();

    const normalizedIdentifier = identifier.toLowerCase();
    const user = usersDatabase.find((candidate) => {
        const emailMatch = candidate.email && candidate.email.toLowerCase() === normalizedIdentifier;
        const employeeMatch = candidate.employeeCode && candidate.employeeCode.toLowerCase() === normalizedIdentifier;
        return emailMatch || employeeMatch;
    });

    if (user && comparePassword(password, user.password)) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    return null;
}

function generateUserId() {
    return 'USR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function hashPassword(password) {
    return btoa(password);
}

function comparePassword(password, hash) {
    return btoa(password) === hash;
}

// ================================
// UPDATE AUTH UI
// ================================

function updateAuthUI() {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');

    if (!loginBtn || !signupBtn) {
        return;
    }

    if (appState.isLoggedIn && appState.currentUser) {
        const userName = appState.currentUser.name.split(' ')[0];
        loginBtn.textContent = userName;
        loginBtn.onclick = (e) => {
            e.preventDefault();
            openUserMenu();
        };

        if (appState.userRole === 'employee' || appState.userRole === 'admin') {
            signupBtn.style.display = 'inline-flex';
            signupBtn.textContent = 'Dashboard';
            signupBtn.onclick = (e) => {
                e.preventDefault();
                window.location.href = 'admin/dashboard.html';
            };
        } else {
            signupBtn.textContent = 'Account';
            signupBtn.onclick = (e) => {
                e.preventDefault();
                openUserMenu();
            };
        }
    }
}

// ================================
// USER MENU
// ================================

function openUserMenu() {
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div style="position: fixed; top: 70px; right: 20px; background: white; border-radius: 8px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15); z-index: 4000; min-width: 220px;">
            <div style="padding: 16px;">
                <p style="margin: 0 0 8px 0; font-weight: 600;">${appState.currentUser.name}</p>
                <p style="margin: 0 0 6px 0; font-size: 0.9rem; color: #999;">${appState.currentUser.email || ''}</p>
                ${appState.currentUser.employeeCode ? `<p style="margin: 0 0 16px 0; font-size: 0.85rem; color: #999;">Employee ID: ${appState.currentUser.employeeCode}</p>` : ''}
                <a href="#" onclick="viewBookings(event)" style="display: block; padding: 8px 0; color: var(--secondary); text-decoration: none; margin-bottom: 8px;">My Bookings</a>
                ${(appState.userRole === 'employee' || appState.userRole === 'admin')
                    ? '<a href="admin/dashboard.html" style="display: block; padding: 8px 0; color: var(--secondary); text-decoration: none; margin-bottom: 8px;">Open Dashboard</a>'
                    : ''}
                <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
                <a href="#" onclick="logoutUser(event)" style="display: block; padding: 8px 0; color: #ff6b6b; text-decoration: none;">Logout</a>
            </div>
        </div>
    `;

    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    document.body.appendChild(menu);

    setTimeout(() => {
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !e.target.classList.contains('login-btn')) {
                menu.remove();
            }
        }, { once: true });
    }, 100);
}

function viewBookings(event) {
    event.preventDefault();
    showNotification('My Bookings feature coming soon', 'info');
}

function logoutUser(event) {
    event.preventDefault();
    appState.isLoggedIn = false;
    appState.userRole = null;
    appState.currentUser = null;
    saveState();

    const menu = document.querySelector('.user-menu');
    if (menu) {
        menu.remove();
    }

    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    if (appState.isLoggedIn && appState.currentUser) {
        updateAuthUI();
    }
});

function generateJWT(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
    }));
    const signature = btoa('secret-key');
    return `${header}.${payload}.${signature}`;
}

function getAuthToken() {
    return localStorage.getItem('authToken') || null;
}

function saveAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}
