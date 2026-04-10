/* ================================
   AUTHENTICATION SYSTEM
   ================================ */

// User database (In production, this would be a backend)
const usersDatabase = JSON.parse(localStorage.getItem('usersDatabase') || '[]');

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
    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;
    
    // Validate inputs
    if (!validateEmail(email)) {
        showNotification('Invalid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        // Simulate API call
        const user = authenticateUser(email, password);
        
        if (user) {
            // Determine user role
            const role = user.role || 'customer';
            
            // Set app state
            appState.isLoggedIn = true;
            appState.userRole = role;
            appState.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: role,
            };
            saveState();
            
            // Update UI
            updateAuthUI();
            
            // Close modal
            closeLoginModal();
            
            // Show success and redirect
            showNotification(`Welcome back, ${user.name}!`, 'success');
            
            // Redirect based on role
            setTimeout(() => {
                if (role === 'employee' || role === 'admin') {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    // Keep on main site for customers
                    window.location.reload();
                }
            }, 1500);
        } else {
            showNotification('Invalid email or password', 'error');
        }
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
    
    // Validate inputs
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
        // Check if user already exists
        const existingUser = usersDatabase.find((u) => u.email === email);
        if (existingUser) {
            showNotification('Email already registered', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: generateUserId(),
            name: name,
            email: email,
            password: hashPassword(password), // In production, hash on server
            role: 'customer',
            createdAt: new Date().toISOString(),
        };
        
        // Save to database
        usersDatabase.push(newUser);
        localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase));
        
        // Auto-login
        appState.isLoggedIn = true;
        appState.userRole = 'customer';
        appState.currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        };
        saveState();
        
        // Update UI
        updateAuthUI();
        
        // Close modal
        closeSignupModal();
        
        // Show success
        showNotification(`Welcome, ${name}! Account created successfully.`, 'success');
        
        // Reload page
        setTimeout(() => {
            window.location.reload();
        }, 1500);
        
    } catch (error) {
        handleError(error, 'Signup failed');
    }
}

// ================================
// AUTHENTICATION HELPERS
// ================================

function authenticateUser(email, password) {
    const user = usersDatabase.find((u) => u.email === email);
    
    if (user && comparePassword(password, user.password)) {
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    
    return null;
}

function generateUserId() {
    return 'USR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function hashPassword(password) {
    // Simple hash for demo (use bcrypt in production)
    return btoa(password);
}

function comparePassword(password, hash) {
    // Simple comparison for demo (use bcrypt in production)
    return btoa(password) === hash;
}

// ================================
// UPDATE AUTH UI
// ================================

function updateAuthUI() {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    
    if (appState.isLoggedIn && appState.currentUser) {
        // Replace auth buttons with user profile
        const userName = appState.currentUser.name.split(' ')[0]; // First name only
        
        loginBtn.textContent = `${userName}`;
        loginBtn.onclick = (e) => {
            e.preventDefault();
            openUserMenu();
        };
        
        signupBtn.textContent = 'Dashboard';
        signupBtn.onclick = (e) => {
            e.preventDefault();
            if (appState.userRole === 'employee' || appState.userRole === 'admin') {
                window.location.href = 'admin/dashboard.html';
            }
        };
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
                    box-shadow: 0 10px 20px rgba(0,0,0,0.15); z-index: 4000; min-width: 200px;">
            <div style="padding: 16px;">
                <p style="margin: 0 0 8px 0; font-weight: 600;">
                    ${appState.currentUser.name}
                </p>
                <p style="margin: 0 0 16px 0; font-size: 0.9rem; color: #999;">
                    ${appState.currentUser.email}
                </p>
                <a href="#" onclick="viewBookings(event)" 
                   style="display: block; padding: 8px 0; color: var(--secondary); text-decoration: none; margin-bottom: 8px;">
                    My Bookings
                </a>
                <a href="#" onclick="viewProfile(event)"
                   style="display: block; padding: 8px 0; color: var(--secondary); text-decoration: none; margin-bottom: 8px;">
                    Profile Settings
                </a>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
                <a href="#" onclick="logoutUser(event)"
                   style="display: block; padding: 8px 0; color: #ff6b6b; text-decoration: none;">
                    Logout
                </a>
            </div>
        </div>
    `;
    
    // Remove existing menu if any
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    document.body.appendChild(menu);
    
    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !e.target.classList.contains('login-btn')) {
                menu.remove();
            }
        });
    }, 100);
}

// ================================
// USER ACTIONS
// ================================

function viewBookings(event) {
    event.preventDefault();
    showNotification('My Bookings feature coming soon', 'info');
}

function viewProfile(event) {
    event.preventDefault();
    showNotification('Profile Settings feature coming soon', 'info');
}

function logoutUser(event) {
    event.preventDefault();
    
    // Clear auth state
    appState.isLoggedIn = false;
    appState.userRole = null;
    appState.currentUser = null;
    saveState();
    
    // Close menu
    const menu = document.querySelector('.user-menu');
    if (menu) {
        menu.remove();
    }
    
    // Reload page
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}

// ================================
// CHECK AUTH STATUS ON PAGE LOAD
// ================================

document.addEventListener('DOMContentLoaded', () => {
    if (appState.isLoggedIn && appState.currentUser) {
        updateAuthUI();
    }
});

// ================================
// JWT TOKEN MANAGEMENT (For API calls)
// ================================

function generateJWT(user) {
    // Simplified JWT generation (use proper JWT library in production)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    }));
    const signature = btoa('secret-key'); // In production, sign on server
    
    return `${header}.${payload}.${signature}`;
}

function getAuthToken() {
    const token = localStorage.getItem('authToken');
    return token || null;
}

function saveAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}