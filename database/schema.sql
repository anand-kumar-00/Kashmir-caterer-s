-- Kashmir Caterers — SQLite Schema v2
-- Run once: node src/models/initDb.js
-- Safe to re-run: all statements use CREATE/INSERT ... IF NOT EXISTS

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
    role          TEXT NOT NULL DEFAULT 'customer',   -- customer | employee | admin
    job_role      TEXT DEFAULT 'staff',               -- manager | cook | waiter | co-helper | accountant | staff
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
    advance_amount  REAL DEFAULT 0,      -- advance paid by customer
    balance_amount  REAL DEFAULT 0,      -- remaining balance
    payment_method  TEXT DEFAULT '',     -- upi | bank_transfer | cash | cheque
    payment_status  TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','advance_paid','paid','refunded')),
    payment_proof   TEXT DEFAULT '',     -- path to uploaded payment screenshot
    payment_notes   TEXT DEFAULT '',     -- admin notes on payment
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
    category    TEXT NOT NULL,
    type        TEXT NOT NULL,  -- veg | non-veg | mixed
    price       REAL NOT NULL DEFAULT 0,
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
-- LOST & FOUND  (NEW in v2)
-- ref_id is the public-facing reference number (e.g. LF-20240615-A3X)
-- ============================================================
CREATE TABLE IF NOT EXISTS lost_found (
    id           TEXT PRIMARY KEY,
    ref_id       TEXT UNIQUE NOT NULL,   -- e.g. LF-20240615-A3X
    type         TEXT NOT NULL CHECK (type IN ('lost','found')),
    item_name    TEXT NOT NULL,
    description  TEXT NOT NULL,
    location     TEXT NOT NULL,          -- where lost/found
    event_date   TEXT,                   -- date of event or finding
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    image_path   TEXT,                   -- relative server path to uploaded image
    status       TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved','expired')),
    notes        TEXT DEFAULT '',        -- internal admin notes
    created_at   TEXT DEFAULT (datetime('now')),
    updated_at   TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- EMERGENCY CONTACTS  (NEW in v2)
-- ============================================================
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    role        TEXT NOT NULL,           -- e.g. "Site Manager", "Ambulance", "Fire"
    phone       TEXT NOT NULL,
    phone_alt   TEXT DEFAULT '',
    category    TEXT NOT NULL DEFAULT 'staff' CHECK (category IN ('staff','medical','fire','police','utility','other')),
    is_active   INTEGER DEFAULT 1,
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- NOTIFICATIONS / AUDIT LOG  (NEW in v2)
-- Used for admin bell notifications and lightweight audit trail
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id          TEXT PRIMARY KEY,
    type        TEXT NOT NULL,           -- booking_new | lost_found_new | review_new | system
    title       TEXT NOT NULL,
    body        TEXT NOT NULL,
    ref_id      TEXT,                    -- optional: ID of related record
    is_read     INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- FILE UPLOADS REGISTRY  (NEW in v2)
-- Tracks all uploaded files for audit + cleanup
-- ============================================================
CREATE TABLE IF NOT EXISTS uploads (
    id           TEXT PRIMARY KEY,
    original_name TEXT NOT NULL,
    stored_name  TEXT NOT NULL,          -- UUID-renamed filename on disk
    mime_type    TEXT NOT NULL,
    size_bytes   INTEGER NOT NULL,
    uploaded_by  TEXT,                   -- user id or NULL for public
    purpose      TEXT,                   -- lost_found | gallery | other
    created_at   TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- INDEXES for common queries
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bookings_status    ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date      ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_lost_found_ref     ON lost_found(ref_id);
CREATE INDEX IF NOT EXISTS idx_lost_found_status  ON lost_found(status);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- ============================================================
-- DEFAULT SEED DATA
-- ============================================================

-- Menu items
INSERT OR IGNORE INTO menu_items VALUES
  ('breakfast-kahwa',       'Kashmiri Kahwa',    'hot-beverages',  'veg',     1800, 'Traditional welcome beverage', 1, datetime('now'), datetime('now')),
  ('breakfast-bakerkhani',  'Bakerkhani',        'assorted-bread', 'veg',     2200, 'Flaky bakery special',         1, datetime('now'), datetime('now')),
  ('breakfast-harissa',     'Harissa Bites',     'appetizers-nonveg','non-veg',2600,'Chef-served mini portions',    1, datetime('now'), datetime('now')),
  ('breakfast-nadru',       'Nadru Yakhni',      'main-course-veg','veg',     3400, 'Lotus stem yogurt curry',      1, datetime('now'), datetime('now')),
  ('breakfast-chaman',      'Chaman Qaliya',     'main-course-veg','veg',     3200, 'Paneer in saffron gravy',      1, datetime('now'), datetime('now')),
  ('lunch-seekh-kebab',     'Seekh Kebab',       'appetizers-nonveg','non-veg',3000,'Chargrilled signature starter',1, datetime('now'), datetime('now')),
  ('lunch-paneer-tikka',    'Paneer Tikka',      'appetizers-veg', 'veg',     2800, 'Smoky vegetarian classic',     1, datetime('now'), datetime('now')),
  ('lunch-rogan-josh',      'Rogan Josh',        'main-course-nonveg','non-veg',4200,'Slow-cooked Kashmiri mutton', 1, datetime('now'), datetime('now')),
  ('lunch-gushtaba',        'Gushtaba',          'wazwan-nonveg',  'non-veg', 4500, 'Royal meatball delicacy',      1, datetime('now'), datetime('now')),
  ('dinner-mutton-shami',   'Mutton Shami Kebab','appetizers-nonveg','non-veg',3400,'Soft kebabs with rich aroma',  1, datetime('now'), datetime('now')),
  ('dinner-cheese-cigars',  'Cheese Cigars',     'appetizers-veg', 'veg',     2600, 'Crisp party starter',          1, datetime('now'), datetime('now')),
  ('dinner-rista',          'Rista',             'wazwan-nonveg',  'non-veg', 4300, 'Classic red-gravy meatballs',  1, datetime('now'), datetime('now')),
  ('dinner-yakhni',         'Mutton Yakhni',     'main-course-nonveg','non-veg',4100,'Aromatic yogurt-based curry', 1, datetime('now'), datetime('now'));

-- Gallery items
INSERT OR IGNORE INTO gallery_items VALUES
  ('gallery-1','Wedding Service Setup',  'images/gallery-1.png', 1, datetime('now')),
  ('gallery-2','Celebration Decor',      'images/gallery-2.png', 2, datetime('now')),
  ('gallery-3','Signature Dining Layout','images/gallery-3.png', 3, datetime('now')),
  ('gallery-4','Premium Buffet',         'images/gallery-4.png', 4, datetime('now')),
  ('gallery-5','Event Service Team',     'images/gallery-5.png', 5, datetime('now'));

-- Locations
INSERT OR IGNORE INTO locations VALUES
  ('loc-akalpur',    'Akalpur Morh',  'office','Gajansoo Road, Jammu',    'Near Satish Furniture House, Gajansoo Road, Jammu — 180001', 32.7266, 74.8570, datetime('now')),
  ('loc-qila',       'Qila Mubarak', 'office','Akhnoor Road, Barnai, Jammu','Qila Mubarak, Akhnoor Road, Barnai, Jammu', 32.7200, 74.8500, datetime('now'));

-- Emergency contacts (defaults)
INSERT OR IGNORE INTO emergency_contacts VALUES
  ('EC-001','Anand Bhagat',  'Owner / Manager', '9419123005','9419221447','staff',  1,1,datetime('now')),
  ('EC-002','Site Manager',  'On-site Lead',    '7006377504','9622053305','staff',  1,2,datetime('now')),
  ('EC-003','Ambulance',     'Emergency Medical','102','','medical',1,10,datetime('now')),
  ('EC-004','Fire Brigade',  'Emergency Fire',   '101','','fire',   1,11,datetime('now')),
  ('EC-005','Police',        'Emergency Police', '100','','police', 1,12,datetime('now'));

-- Business settings
INSERT OR IGNORE INTO settings VALUES
  ('businessName',    'Kashmir Caterers',                             datetime('now')),
  ('businessPhone',   '9419123005',                                   datetime('now')),
  ('businessPhone2',  '9419221447',                                   datetime('now')),
  ('businessEmail',   'kashmircaterersblb@gmail.com',                 datetime('now')),
  ('businessAddress', 'Akalpur Morh, Gajansoo Road, Jammu — 180001', datetime('now')),
  ('whatsappNumber',  '9419123005',                                   datetime('now'));
