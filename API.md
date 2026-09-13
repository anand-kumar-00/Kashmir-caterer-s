# Kashmir Caterers — API Reference

Base URL: `http://localhost:3001` (development) | `https://yourdomain.com` (production)

Authentication: session cookie (`connect.sid`) — set on login, must be sent with `credentials: 'include'` on fetch calls.

---

## Auth

### POST `/api/auth/signup`
Register a new customer account.

**Body**: `{ name, email, password }`

**Returns**: `{ message, user: { id, name, email, role } }` — sets session cookie.

**Rate limit**: 20 req / 15 min (shared with `/api/auth/login`).

---

### POST `/api/auth/login`
Login with email/employee-code + password.

**Body**: `{ identifier, password }` — `identifier` accepts email or employee code.

**Returns**: `{ message, user: { id, employeeCode, name, email, role, jobRole } }`.

**Rate limit**: 20 req / 15 min.

---

### POST `/api/auth/logout`
Destroy the current session.

**Returns**: `{ message }`.

---

### GET `/api/auth/me`
Returns the current authenticated user. Requires a valid session.

**Returns**: `{ id, employeeCode, name, email, role, jobRole }`.

---

## Bookings

### POST `/api/bookings`
Submit a catering booking enquiry. **Public** (no auth required).

**Body**: `{ customerName, customerEmail, customerPhone, functionType, eventDate (YYYY-MM-DD), guestCount, menuItems?: [], requirements?: string }`

**Returns**: `{ message, bookingId, estimatedTotal }`.

Creates an admin notification on success.

---

### GET `/api/bookings`
List all bookings. **Requires staff or admin session**.

**Query params**: `?status=pending_payment|confirmed|completed|cancelled`, `?date=YYYY-MM-DD`

**Returns**: Array of booking objects.

---

### GET `/api/bookings/:id`
Get a single booking. **Requires auth** — accessible by owner or staff.

---

### PATCH `/api/bookings/:id`
Update booking status or details. **Admin only**.

**Body**: any combination of `{ status, customer_name, event_date, requirements, estimated_total, guest_count }`.

---

### DELETE `/api/bookings/:id`
Cancel a booking (sets status to `cancelled`). **Admin only**.

---

## Menu

### GET `/api/menu`
List all active menu items. **Public**.

**Returns**: Array of `{ id, name, category, type, price, description }`.

---

### POST `/api/menu`
Add a menu item. **Admin only**.

**Body**: `{ name, category, type, rate?, note?, description? }` — `category` must be one of 24 valid values.

---

### PATCH `/api/menu/:id`
Update a menu item. **Admin only**.

---

### DELETE `/api/menu/:id`
Soft-delete (marks `is_active = 0`). **Admin only**.

---

## Gallery

### GET `/api/gallery`
List all gallery items. **Public**.

---

### POST `/api/gallery`
Add gallery item. **Admin only**.

**Body**: `{ title, imageUrl, sortOrder? }`

---

### PATCH `/api/gallery/:id` / DELETE `/api/gallery/:id`
Admin only.

---

## Reviews

### GET `/api/reviews`
List all reviews. **Public**.

---

### POST `/api/reviews`
Submit a review. **Public**.

**Body**: `{ name, email, rating (1–5), review, eventType?, verified? }`

Creates an admin notification on success.

---

### DELETE `/api/reviews/:id`
Admin only.

---

## Lost & Found

### POST `/api/lost-found`
Submit a lost or found report. **Public**.

**Body**: `{ type ("lost"|"found"), itemName, description, location, contactName, contactPhone, contactEmail?, eventDate? }`

**Returns**: `{ message, refId, id }` — `refId` is the public reference ID (format: `LF-YYYYMMDD-XXXX`).

---

### GET `/api/lost-found/lookup/:refId`
Look up a report by reference ID. **Public**.

Only returns non-sensitive fields (no contact phone/email exposed).

**Returns**: `{ refId, type, itemName, description, location, eventDate, contactName, status, reportedAt }`.

---

### GET `/api/lost-found`
List all reports. **Admin only**. Filters: `?status=`, `?type=`.

---

### PATCH `/api/lost-found/:id`
Update status/notes. **Admin only**. Body: `{ status?, notes? }`.

---

### DELETE `/api/lost-found/:id`
Permanent delete. **Admin only**.

---

## Emergency Contacts

### GET `/api/emergency`
List active contacts. **Public**.

Returns: `{ id, name, role, phone, phone_alt, category, sort_order }` — no sensitive internal fields.

---

### GET `/api/emergency/all`
List all contacts (including inactive). **Admin only**.

---

### POST `/api/emergency`
Add a contact. **Admin only**.

**Body**: `{ name, role, phone, category, phoneAlt?, sortOrder? }` — `category` must be `staff|medical|fire|police|utility|other`.

---

### PATCH `/api/emergency/:id`
Update contact. **Admin only**. Supports: `name, role, phone, phone_alt, category, is_active, sort_order`.

---

### DELETE `/api/emergency/:id`
Remove contact. **Admin only**.

---

## Notifications

All notification routes **require admin session**.

### GET `/api/notifications`
List most recent 50 notifications.

### GET `/api/notifications/unread`
Returns `{ count }` — unread count for bell badge.

### PATCH `/api/notifications/mark-all-read`
Mark all as read.

### PATCH `/api/notifications/:id/read`
Mark single notification as read.

### DELETE `/api/notifications/:id`
Remove a notification.

---

## File Upload

### POST `/api/upload`
Upload an image file. **Requires auth** (any logged-in user).

**Content-Type**: `multipart/form-data`
**Fields**: `file` (required), `purpose` (optional: `lost_found|gallery|other`)

**Limits**: 5 MB, images only (JPEG, PNG, WebP, GIF), 1 file per request.
**Rate limit**: 30 req / 15 min.

**Returns**: `{ id, url: "/uploads/<uuid>.ext" }`.

---

## Admin

All `/api/admin/*` routes **require admin session**.

### GET /api/admin/employees
### POST /api/admin/employees
### PATCH /api/admin/employees/:id

### GET /api/admin/expenses
### POST /api/admin/expenses
### DELETE /api/admin/expenses/:id

### GET /api/admin/locations
### POST /api/admin/locations
### PATCH /api/admin/locations/:id
### DELETE /api/admin/locations/:id

### GET /api/admin/meetings
### POST /api/admin/meetings
### DELETE /api/admin/meetings/:id

### GET /api/admin/settings
### PATCH /api/admin/settings

### GET /api/admin/reports
Returns aggregated financials: `{ totalBookings, confirmedBookings, cancelledBookings, pendingPayments, totalIncome, totalExpenses, totalSalary, netProfit }`.

---

## AI Chat

### POST `/api/chat`
Chat with the Kashmiria AI assistant.

**Body**: `{ messages: [{ role: "user"|"assistant", content: string }] }`

**Rate limit**: 20 messages / 5 min per IP.

Requires `GROQ_API_KEY` to be set in `.env`. Returns `503` if not configured.

---

## Error format

All errors return: `{ "error": "Human-readable message" }` with an appropriate HTTP status code.

Standard codes used:
- `400` — validation failure
- `401` — not authenticated
- `403` — insufficient role
- `404` — resource not found
- `409` — conflict (duplicate)
- `500` — internal server error
- `502/503` — upstream service error (AI chat)
