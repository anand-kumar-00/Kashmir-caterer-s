# Kashmir Caterers — Database Changes (v1 → v2)

## New Tables

### `lost_found`
Stores public lost & found reports.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PK | Internal UUID-based ID (`LF-XXXX...`) |
| `ref_id` | TEXT UNIQUE | Public-facing reference (`LF-YYYYMMDD-XXXX`) |
| `type` | TEXT | `lost` or `found` |
| `item_name` | TEXT | Short item description |
| `description` | TEXT | Full description |
| `location` | TEXT | Where lost/found |
| `event_date` | TEXT | Optional date of event |
| `contact_name` | TEXT | Person who submitted |
| `contact_phone` | TEXT | **Never exposed via public API** |
| `contact_email` | TEXT | Optional |
| `image_path` | TEXT | Path to uploaded image (future use) |
| `status` | TEXT | `open` \| `resolved` \| `expired` |
| `notes` | TEXT | Admin-only notes |
| `created_at` | TEXT | ISO timestamp |
| `updated_at` | TEXT | ISO timestamp |

**Index**: `idx_lost_found_ref (ref_id)`, `idx_lost_found_status (status)`

---

### `emergency_contacts`
Contacts shown in the public emergency widget and admin panel.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PK | Internal ID (`EC-XXXX`) |
| `name` | TEXT | Contact's name |
| `role` | TEXT | Title / role |
| `phone` | TEXT | Primary phone |
| `phone_alt` | TEXT | Optional alternate phone |
| `category` | TEXT | `staff` \| `medical` \| `fire` \| `police` \| `utility` \| `other` |
| `is_active` | INTEGER | 1 = shown publicly, 0 = hidden |
| `sort_order` | INTEGER | Lower = shown first |
| `created_at` | TEXT | ISO timestamp |

---

### `notifications`
Admin notification feed and lightweight audit trail.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PK | `NTF-XXXX` |
| `type` | TEXT | `booking_new` \| `lost_found_new` \| `review_new` \| `system` |
| `title` | TEXT | Short notification title |
| `body` | TEXT | Notification body text |
| `ref_id` | TEXT | Optional ID of related record |
| `is_read` | INTEGER | 0 = unread, 1 = read |
| `created_at` | TEXT | ISO timestamp |

**Index**: `idx_notifications_read (is_read)`

---

### `uploads`
Registry of all uploaded files.

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PK | `UPL-XXXX` |
| `original_name` | TEXT | Original filename (sanitised) |
| `stored_name` | TEXT | UUID-renamed filename on disk |
| `mime_type` | TEXT | e.g. `image/jpeg` |
| `size_bytes` | INTEGER | File size |
| `uploaded_by` | TEXT | User ID or NULL for public |
| `purpose` | TEXT | `lost_found` \| `gallery` \| `other` |
| `created_at` | TEXT | ISO timestamp |

---

## Changed Tables

### `menu_items`
- `price` default changed from required `REAL NOT NULL` to `REAL NOT NULL DEFAULT 0` — allows inserting items without a price.
- Category values updated to match the actual 24-category list used by the API (was using `breakfast/lunch/dinner` which conflicted with the `VALID_CATEGORIES` array in `menu.js`).

### `locations`
- Seed data corrected: removed placeholder Mumbai/Delhi locations, added real Jammu offices (Akalpur Morh + Qila Mubarak).

### `settings`
- Added seed values: `businessPhone2`, `whatsappNumber`.
- Corrected placeholder contact info to real business contact details.

---

## New Indexes (added to existing tables)

```sql
CREATE INDEX IF NOT EXISTS idx_bookings_status    ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date      ON bookings(event_date);
```

These improve performance on the `GET /api/bookings?status=&date=` filtered queries used by the admin dashboard.

---

## Migration Instructions

If you already have an existing database and do **not** want to recreate it from scratch:

```sql
-- Run these in your SQLite client or via: sqlite3 database/kashmir_caterers.db < migrate_v2.sql

CREATE TABLE IF NOT EXISTS lost_found (
    id           TEXT PRIMARY KEY,
    ref_id       TEXT UNIQUE NOT NULL,
    type         TEXT NOT NULL CHECK (type IN ('lost','found')),
    item_name    TEXT NOT NULL,
    description  TEXT NOT NULL,
    location     TEXT NOT NULL,
    event_date   TEXT,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    image_path   TEXT,
    status       TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved','expired')),
    notes        TEXT DEFAULT '',
    created_at   TEXT DEFAULT (datetime('now')),
    updated_at   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS emergency_contacts (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    role        TEXT NOT NULL,
    phone       TEXT NOT NULL,
    phone_alt   TEXT DEFAULT '',
    category    TEXT NOT NULL DEFAULT 'staff',
    is_active   INTEGER DEFAULT 1,
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notifications (
    id          TEXT PRIMARY KEY,
    type        TEXT NOT NULL,
    title       TEXT NOT NULL,
    body        TEXT NOT NULL,
    ref_id      TEXT,
    is_read     INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS uploads (
    id           TEXT PRIMARY KEY,
    original_name TEXT NOT NULL,
    stored_name  TEXT NOT NULL,
    mime_type    TEXT NOT NULL,
    size_bytes   INTEGER NOT NULL,
    uploaded_by  TEXT,
    purpose      TEXT,
    created_at   TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_status    ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date      ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_lost_found_ref     ON lost_found(ref_id);
CREATE INDEX IF NOT EXISTS idx_lost_found_status  ON lost_found(status);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- Seed emergency contacts
INSERT OR IGNORE INTO emergency_contacts VALUES
  ('EC-001','Anand Bhagat','Owner / Manager','9419123005','9419221447','staff',1,1,datetime('now')),
  ('EC-002','Site Manager','On-site Lead','7006377504','9622053305','staff',1,2,datetime('now')),
  ('EC-003','Ambulance','Emergency Medical','102','','medical',1,10,datetime('now')),
  ('EC-004','Fire Brigade','Emergency Fire','101','','fire',1,11,datetime('now')),
  ('EC-005','Police','Emergency Police','100','','police',1,12,datetime('now'));

-- Update settings
INSERT OR IGNORE INTO settings VALUES ('businessPhone2','9419221447',datetime('now'));
INSERT OR IGNORE INTO settings VALUES ('whatsappNumber','9419123005',datetime('now'));
UPDATE settings SET value='kashmircaterersblb@gmail.com' WHERE key='businessEmail';
UPDATE settings SET value='Akalpur Morh, Gajansoo Road, Jammu — 180001' WHERE key='businessAddress';
UPDATE settings SET value='9419123005' WHERE key='businessPhone';
```
