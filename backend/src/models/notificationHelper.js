/**
 * notificationHelper.js
 * Creates a notification row. Call this from any route that should
 * push an alert to the admin dashboard.
 */

const { v4: uuidv4 } = require('uuid');

/**
 * @param {import('better-sqlite3').Database} db
 * @param {string} type    - booking_new | lost_found_new | review_new | system
 * @param {string} title
 * @param {string} body
 * @param {string|null} refId  - ID of the related record (optional)
 */
function createNotification(db, type, title, body, refId = null) {
    try {
        const id = 'NTF-' + uuidv4().replace(/-/g,'').slice(0, 10).toUpperCase();
        db.prepare(`
            INSERT INTO notifications (id, type, title, body, ref_id)
            VALUES (?,?,?,?,?)
        `).run(id, type, title.slice(0, 200), body.slice(0, 500), refId);
    } catch (err) {
        // Notification failure should never crash the main request
        console.error('[Notification] Failed to create:', err.message);
    }
}

module.exports = { createNotification };
