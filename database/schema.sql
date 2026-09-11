-- Kashmir Caterers — SQLite Schema
-- Run once to create all tables and seed default data
-- File: database/schema.sql

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ============================================================
-- USERS (customers + employees + admins)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    employee_code TEXT UNIQUE,
    name          TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'customer',  -- customer | employee | admin
    job_role      TEXT DEFAULT 'staff',              -- manager | cook | waiter | co-helper | accountant | staff
    daily_rate    REAL DEFAULT 0,
    days_worked   INTEGER DEFAULT 0,
    advance_paid  REAL DEFAULT 0,
    is_active     INTEGER DEFAULT 1,
    created_at    TEXT DEFAULT (datetime('now')),
    updated_at    TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id              TEXT PRIMARY KEY,
    customer_id     TEXT,                -- NULL for guest bookings
    customer_name   TEXT NOT NULL,
    customer_email  TEXT NOT NULL,
    customer_phone  TEXT,
    function_type   TEXT NOT NULL,
    event_date      TEXT NOT NULL,
    guest_count     INTEGER DEFAULT 0,
    menu_items      TEXT DEFAULT '[]',   -- JSON array of menu item IDs
    requirements    TEXT DEFAULT '',
    estimated_total REAL DEFAULT 0,
    status          TEXT DEFAULT 'pending_payment', -- pending_payment | confirmed | completed | cancelled
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- MENU ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_items (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    category    TEXT NOT NULL,  -- breakfast | lunch | dinner
    type        TEXT NOT NULL,  -- snacks | main
    price       REAL NOT NULL,
    description TEXT DEFAULT '',
    is_active   INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- GALLERY
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_items (
    id         TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    image_url  TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- EXPENSES
-- ============================================================
CREATE TABLE IF NOT EXISTS expenses (
    id          TEXT PRIMARY KEY,
    date        TEXT NOT NULL,
    category    TEXT NOT NULL,
    description TEXT NOT NULL,
    amount      REAL NOT NULL,
    created_at  TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- MEETINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS meetings (
    id            TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    date_time     TEXT NOT NULL,
    type          TEXT NOT NULL,
    zoom_link     TEXT DEFAULT '',
    notes         TEXT DEFAULT '',
    created_at    TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- LOCATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    type         TEXT NOT NULL DEFAULT 'event',  -- office | event
    address      TEXT NOT NULL,
    full_address TEXT,
    lat          REAL,
    lng          REAL,
    created_at   TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- REVIEWS / FEEDBACK
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    event_type TEXT,
    rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review     TEXT NOT NULL,
    verified   INTEGER DEFAULT 0,
    helpful    INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- BUSINESS SETTINGS (key-value store)
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- DEFAULT SEED DATA
-- ============================================================

-- Default admin account (password: Anand@9596, bcrypt will handle this at runtime)
-- The initDb.js script inserts these with proper bcrypt hashes

-- Default menu items
INSERT OR IGNORE INTO menu_items VALUES
  ('breakfast-kahwa',       'Kashmiri Kahwa',    'breakfast','snacks', 1800, 'Traditional welcome beverage', 1, datetime('now'), datetime('now')),
  ('breakfast-bakerkhani',  'Bakerkhani',        'breakfast','snacks', 2200, 'Flaky bakery special',         1, datetime('now'), datetime('now')),
  ('breakfast-harissa',     'Harissa Bites',     'breakfast','snacks', 2600, 'Chef-served mini portions',    1, datetime('now'), datetime('now')),
  ('breakfast-nadru',       'Nadru Yakhni',      'breakfast','main',   3400, 'Lotus stem yogurt curry',      1, datetime('now'), datetime('now')),
  ('breakfast-chaman',      'Chaman Qaliya',     'breakfast','main',   3200, 'Paneer in saffron gravy',      1, datetime('now'), datetime('now')),
  ('lunch-seekh-kebab',     'Seekh Kebab',       'lunch',   'snacks',  3000, 'Chargrilled signature starter',1, datetime('now'), datetime('now')),
  ('lunch-paneer-tikka',    'Paneer Tikka',      'lunch',   'snacks',  2800, 'Smoky vegetarian classic',     1, datetime('now'), datetime('now')),
  ('lunch-rogan-josh',      'Rogan Josh',        'lunch',   'main',    4200, 'Slow-cooked Kashmiri mutton',  1, datetime('now'), datetime('now')),
  ('lunch-gushtaba',        'Gushtaba',          'lunch',   'main',    4500, 'Royal meatball delicacy',      1, datetime('now'), datetime('now')),
  ('dinner-mutton-shami',   'Mutton Shami Kebab','dinner',  'snacks',  3400, 'Soft kebabs with rich aroma',  1, datetime('now'), datetime('now')),
  ('dinner-cheese-cigars',  'Cheese Cigars',     'dinner',  'snacks',  2600, 'Crisp party starter',          1, datetime('now'), datetime('now')),
  ('dinner-rista',          'Rista',             'dinner',  'main',    4300, 'Classic red-gravy meatballs',  1, datetime('now'), datetime('now')),
  ('dinner-yakhni',         'Mutton Yakhni',     'dinner',  'main',    4100, 'Aromatic yogurt-based curry',  1, datetime('now'), datetime('now'));

-- Default gallery items
INSERT OR IGNORE INTO gallery_items VALUES
  ('gallery-1','Wedding Service Setup',  'images/gallery-1.png', 1, datetime('now')),
  ('gallery-2','Celebration Decor',      'images/gallery-2.png', 2, datetime('now')),
  ('gallery-3','Signature Dining Layout','images/gallery-3.png', 3, datetime('now')),
  ('gallery-4','Premium Buffet',         'images/gallery-4.png', 4, datetime('now')),
  ('gallery-5','Event Service Team',     'images/gallery-5.png', 5, datetime('now'));

-- Default locations
INSERT OR IGNORE INTO locations VALUES
  ('office',       'Office Location','office','Srinagar, Jammu & Kashmir','Main Office, Lal Chowk, Srinagar', 34.083651, 74.797371, datetime('now')),
  ('event-mumbai', 'Current Event',  'event', 'Mumbai, Maharashtra',      'Royal Grand Hotel Ballroom, Mumbai',19.0760,   72.8777,   datetime('now')),
  ('event-delhi',  'Upcoming Event', 'event', 'Delhi, Delhi',             'Garden Palace Convention Center',  28.6139,   77.2090,   datetime('now'));

-- Default business settings
INSERT OR IGNORE INTO settings VALUES
  ('businessName',    'Kashmir Caterers',                         datetime('now')),
  ('businessPhone',   '+91 9876543210',                           datetime('now')),
  ('businessEmail',   'hello@kashmiricaterers.com',               datetime('now')),
  ('businessAddress', 'Main Office, Lal Chowk, Srinagar, J&K',   datetime('now'));
