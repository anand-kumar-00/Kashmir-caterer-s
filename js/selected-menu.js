/* ================================================================
   KASHMIR CATERERS — SELECTED MENU STATE MANAGER
   Manages the customer's selected items with localStorage persistence.

   PUBLIC API:
     KCSelectedMenu.add(item)
     KCSelectedMenu.remove(itemId)
     KCSelectedMenu.increment(itemId)
     KCSelectedMenu.decrement(itemId)    — removes when qty → 0
     KCSelectedMenu.getAll()
     KCSelectedMenu.getItem(itemId)
     KCSelectedMenu.has(itemId)
     KCSelectedMenu.clear()
     KCSelectedMenu.totalItems()
     KCSelectedMenu.on(event, callback)  — 'change' event
   ================================================================ */

window.KCSelectedMenu = (function () {

  const STORAGE_KEY = 'kc_selected_menu';

  /* ── internal state ── */
  let _items = [];          // [{ id, name, category, type, quantity, price, subcategory }]
  let _listeners = [];

  /* ── persistence ── */
  function _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_items));
    } catch (_) { /* storage full – fail silently */ }
  }

  function _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          _items = parsed;
        }
      }
    } catch (_) {
      _items = [];
    }
  }

  /* ── listeners ── */
  function _emit() {
    _listeners.forEach(fn => {
      try { fn(_items.slice()); } catch (_) {}
    });
  }

  /* ── public methods ── */
  function add(menuItem) {
    const existing = _items.find(i => i.id === menuItem.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      _items.push({
        id:          menuItem.id,
        name:        menuItem.name,
        category:    menuItem.category,
        type:        menuItem.type,
        subcategory: menuItem.subcategory || '',
        quantity:    1,
        price:       menuItem.price || null,
      });
    }
    _save();
    _emit();
  }

  function remove(itemId) {
    _items = _items.filter(i => i.id !== itemId);
    _save();
    _emit();
  }

  function increment(itemId) {
    const item = _items.find(i => i.id === itemId);
    if (item) {
      item.quantity += 1;
      _save();
      _emit();
    }
  }

  function decrement(itemId) {
    const item = _items.find(i => i.id === itemId);
    if (!item) return;
    item.quantity -= 1;
    if (item.quantity <= 0) {
      remove(itemId);
    } else {
      _save();
      _emit();
    }
  }

  function getAll() {
    return _items.slice();
  }

  function getItem(itemId) {
    return _items.find(i => i.id === itemId) || null;
  }

  function has(itemId) {
    return _items.some(i => i.id === itemId);
  }

  function clear() {
    _items = [];
    _save();
    _emit();
  }

  function totalItems() {
    return _items.reduce((sum, i) => sum + i.quantity, 0);
  }

  function countInCategory(categoryKey) {
    return _items
      .filter(i => i.category === categoryKey)
      .reduce((sum, i) => sum + i.quantity, 0);
  }

  function on(event, callback) {
    if (event === 'change') {
      _listeners.push(callback);
    }
  }

  /**
   * Export the selection in the format expected by the booking form.
   */
  function toBookingPayload(extraData) {
    return Object.assign({
      package:       extraData && extraData.package       || null,
      selectedMenu:  _items.slice(),
      totalItems:    totalItems(),
      guestCount:    extraData && extraData.guestCount    || null,
      eventDate:     extraData && extraData.eventDate     || null,
      eventType:     extraData && extraData.eventType     || null,
    }, extraData || {});
  }

  /* ── init on module load ── */
  _load();

  return {
    add,
    remove,
    increment,
    decrement,
    getAll,
    getItem,
    has,
    clear,
    totalItems,
    countInCategory,
    on,
    toBookingPayload,
  };

})();
