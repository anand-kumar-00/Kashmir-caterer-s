const MENU_CATEGORY_SEED = [
    { slug: 'cold-beverages', name: 'Cold Beverages', sort_order: 1 },
    { slug: 'shakes-smoothies', name: 'Shakes, Smoothies & Punches', sort_order: 2 },
    { slug: 'hot-beverages', name: 'Hot Beverages', sort_order: 3 },
    { slug: 'soup-veg', name: 'Soup Station (Veg)', sort_order: 4 },
    { slug: 'soup-nonveg', name: 'Soup Station (Non-Veg)', sort_order: 5 },
    { slug: 'appetizers-veg', name: 'Appetizers (Veg)', sort_order: 6 },
    { slug: 'appetizers-nonveg', name: 'Appetizers (Non-Veg)', sort_order: 7 },
    { slug: 'main-course-veg', name: 'Main Course (Veg)', sort_order: 8 },
    { slug: 'main-course-nonveg', name: 'Main Course (Non-Veg)', sort_order: 9 },
    { slug: 'main-course-hightea', name: 'Main Course (High Tea)', sort_order: 10 },
    { slug: 'rice-pulao', name: 'Rice, Pulao & Biryani', sort_order: 11 },
    { slug: 'assorted-bread', name: 'Assorted Breads', sort_order: 12 },
    { slug: 'salad-raita', name: 'Salad Station', sort_order: 13 },
    { slug: 'raita', name: 'Raita & Accompaniments', sort_order: 14 },
    { slug: 'live-counters', name: 'Live Counters (Veg)', sort_order: 15 },
    { slug: 'live-counters-nonveg', name: 'Live Counters (Non-Veg)', sort_order: 16 },
    { slug: 'dessert', name: 'Dessert & Sweets', sort_order: 17 },
    { slug: 'fruit-counter', name: 'Fruit Counter', sort_order: 18 },
    { slug: 'specialty-counters', name: 'Specialty Counters', sort_order: 19 },
    { slug: 'arrival-drinks', name: 'As You Arrive (Koshur)', sort_order: 20 },
    { slug: 'buffet-nonveg', name: 'Buffet Non-Veg (Koshur)', sort_order: 21 },
    { slug: 'soft-drink', name: 'Soft Drink (High Tea)', sort_order: 22 },
    { slug: 'wazwan-nonveg', name: 'Wazwan Non-Veg', sort_order: 23 },
    { slug: 'wazwan-veg', name: 'Wazwan Veg', sort_order: 24 },
    { slug: 'wazwan-sweet', name: 'Wazwan Sweets', sort_order: 25 },
];

function getCategoryLabel(slug) {
    const item = MENU_CATEGORY_SEED.find(c => c.slug === slug);
    if (item) return item.name;
    if (!slug) return 'Uncategorized';
    return slug.replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
}

function listMenuCategories(db) {
    return db.prepare(`
        SELECT slug, name, sort_order, is_active, created_at, updated_at
        FROM menu_categories
        WHERE is_active = 1
        ORDER BY sort_order, name ASC
    `).all();
}

function ensureDefaultMenuCategories(db) {
    const stmt = db.prepare(`
        INSERT OR IGNORE INTO menu_categories (id, slug, name, sort_order)
        VALUES (@id, @slug, @name, @sort_order)
    `);

    MENU_CATEGORY_SEED.forEach((category, index) => {
        stmt.run({
            id: `menu-cat-${String(index + 1).padStart(3, '0')}`,
            slug: category.slug,
            name: category.name,
            sort_order: category.sort_order,
        });
    });

    return listMenuCategories(db);
}

module.exports = {
    MENU_CATEGORY_SEED,
    getCategoryLabel,
    listMenuCategories,
    ensureDefaultMenuCategories,
};
