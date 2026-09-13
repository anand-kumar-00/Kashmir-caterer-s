/**
 * Kashmir Caterers — migrate_v2_payments.js
 * Run: node migrate_v2_payments.js
 * Adds payment columns to existing bookings table (safe, idempotent)
 */

require('dotenv').config();
const path     = require('path');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH
    ? path.resolve(__dirname, '../../', process.env.DB_PATH)
    : path.resolve(__dirname, '../../../database/kashmir_caterers.db');

const db = new Database(DB_PATH);

const existingCols = db.prepare('PRAGMA table_info(bookings)').all().map(c => c.name);
console.log('Existing columns:', existingCols.join(', '));

const migrations = [
    { col: 'advance_amount',  def: 'REAL DEFAULT 0' },
    { col: 'balance_amount',  def: 'REAL DEFAULT 0' },
    { col: 'payment_method',  def: "TEXT DEFAULT ''" },
    { col: 'payment_status',  def: "TEXT DEFAULT 'unpaid'" },
    { col: 'payment_proof',   def: "TEXT DEFAULT ''" },
    { col: 'payment_notes',   def: "TEXT DEFAULT ''" },
];

migrations.forEach(({ col, def }) => {
    if (!existingCols.includes(col)) {
        db.exec(`ALTER TABLE bookings ADD COLUMN ${col} ${def}`);
        console.log(`✓ Added column: bookings.${col}`);
    } else {
        console.log(`  Exists: bookings.${col}`);
    }
});

db.close();
console.log('\n✅ Payment migration complete');
