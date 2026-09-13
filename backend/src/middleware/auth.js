/**
 * Auth middleware
 *
 * requireAuth   — any logged-in user (customer, employee, admin)
 * requireStaff  — employee OR admin (can access admin dashboard but with limited write ops)
 * requireAdmin  — admin role only (full management capabilities)
 */

function requireAuth(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
}

/**
 * requireStaff — employee or admin.
 * Used for read-only admin views that employees should also see.
 */
function requireStaff(req, res, next) {
    if (!req.session || !['employee', 'admin'].includes(req.session.role)) {
        return res.status(403).json({ error: 'Staff access required' });
    }
    next();
}

/**
 * requireAdmin — admin role only.
 * Write operations (add/edit/delete employees, expenses, settings, etc.)
 * are locked to this role.
 *
 * IMPORTANT: The legacy code used requireAdmin to allow 'employee' too.
 * This has been tightened: only 'admin' passes. Routes that employees
 * legitimately need are switched to requireStaff.
 */
function requireAdmin(req, res, next) {
    if (!req.session || req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

module.exports = { requireAuth, requireStaff, requireAdmin };
