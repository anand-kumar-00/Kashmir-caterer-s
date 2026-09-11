/**
 * Auth middleware — requires a valid session
 */

function requireAuth(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
}

/**
 * Role guard — requires employee or admin role
 */
function requireAdmin(req, res, next) {
    if (!req.session || !['employee', 'admin'].includes(req.session.role)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
}

module.exports = { requireAuth, requireAdmin };
