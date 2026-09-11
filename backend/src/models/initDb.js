/**
 * Kashmir Caterers — Database Initializer
 * Run: node src/models/initDb.js
 * Creates the SQLite database from schema.sql and seeds the default admin accounts.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const path = require('path');
const fs   = require('fs');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH
    ? path.resolve(__dirname, '../../', process.env.DB_PATH)
    : path.resolve(__dirname, '../../../database/kashmir_caterers.db');

const SCHEMA_PATH = path.resolve(__dirname, '../../../database/schema.sql');

// Ensure directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Apply schema
const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
db.exec(schema);

// Seed default admin accounts with proper bcrypt hashes
const SALT_ROUNDS = 12;

const defaultUsers = [
    {
        id: 'EMP-ADMIN-001',
        employee_code: 'KC-ADMIN-001',
        name: 'Kashmir Admin',
        email: 'admin@kashmircaterers.local',
        password: 'admin123',
        role: 'admin',
        job_role: 'manager',
        daily_rate: 2500,
        days_worked: 26,
        advance_paid: 5000,
    },
    {
        id: 'EMP-ADMIN-ANAND',
        employee_code: 'KC-ADMIN-9596',
        name: 'Anand Bhagat',
        email: 'itsanandbhagat47@gmail.com',
        password: 'Anand@9596',
        role: 'admin',
        job_role: 'manager',
        daily_rate: 0,
        days_worked: 0,
        advance_paid: 0,
    },
];

const insert = db.prepare(`
    INSERT OR IGNORE INTO users
        (id, employee_code, name, email, password_hash, role, job_role, daily_rate, days_worked, advance_paid)
    VALUES
        (@id, @employee_code, @name, @email, @password_hash, @role, @job_role, @daily_rate, @days_worked, @advance_paid)
`);

for (const user of defaultUsers) {
    const password_hash = bcrypt.hashSync(user.password, SALT_ROUNDS);
    insert.run({ ...user, password_hash });
    console.log(`✓ Seeded user: ${user.name} (${user.email})`);
}

db.close();
console.log(`\n✅ Database initialized at: ${DB_PATH}`);
