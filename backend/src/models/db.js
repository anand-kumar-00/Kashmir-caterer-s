/**
 * Kashmir Caterers — Database connection singleton
 */

const path     = require('path');
const fs       = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH
    ? path.resolve(__dirname, '../../', process.env.DB_PATH)
    : path.resolve(__dirname, '../../../database/kashmir_caterers.db');

let _db = null;

function getDb() {
    if (_db) return _db;

    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    return _db;
}

module.exports = { getDb };
