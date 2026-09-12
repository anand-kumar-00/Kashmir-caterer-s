/* ================================================================
   KASHMIR CATERERS — MENU PAGE CONTROLLER  (menu.js)
   Depends on: menu-data.js, package-rules.js, selected-menu.js
   ================================================================ */

(function () {
  'use strict';

  /* ── State ── */
  let _activeCategory  = 'all';
  let _activePackageId = null;
  let _searchQuery     = '';
  let _limitToastTimer = null;

  /* ── DOM refs (resolved after DOMContentLoaded) ── */
  const $ = id => document.getElementById(id);

  /* ================================================================
     INIT
     ================================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    renderPackageChips();
    renderCategoryNav();
    renderMenuGrid();
    renderSelectedPanel();
    bindSearch();
    bindSelectedMenuEvents();

    // Restore active package from sessionStorage if user came back
    const savedPkg = sessionStorage.getItem('kc_active_package');
    if (savedPkg && KCPackageRules.getPackage(savedPkg)) {
      selectPackage(savedPkg, false);
    }
  });

  /* ================================================================
     PACKAGES
     ================================================================ */
  function renderPackageChips() {
    const container = $('packageChips');
    if (!container) return;

    container.innerHTML = KCPackageRules.PACKAGES.map(pkg => `
      <button class="package-chip" data-pkg="${pkg.id}"
              onclick="window._kcMenuSelectPackage('${pkg.id}')"
              aria-pressed="false"
              aria-label="Select ${pkg.label} package${pkg.minPax ? ', minimum ' + pkg.minPax + ' guests' : ''}">
        <span class="package-chip-name">${pkg.label}</span>
        <span class="package-chip-pax">${pkg.minPax ? 'Min ' + pkg.minPax + ' Pax' : 'Cloud Kitchen'}</span>
      </button>
    `).join('');
  }

  window._kcMenuSelectPackage = function (pkgId) {
    selectPackage(pkgId, true);
  };

  function selectPackage(pkgId, scroll) {
    _activePackageId = pkgId;
    sessionStorage.setItem('kc_active_package', pkgId);

    // Update chip active states
    document.querySelectorAll('.package-chip').forEach(btn => {
      const active = btn.dataset.pkg === pkgId;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active);
    });

    // Show info banner
    const pkg = KCPackageRules.getPackage(pkgId);
    if (pkg) {
      $('packageInfoLabel').textContent = pkg.label;
      $('packageInfoPax').textContent   = pkg.minPax ? 'Min ' + pkg.minPax + ' Pax' : 'Cloud Kitchen';
      $('packageInfoDesc').textContent  = pkg.description;
      $('packageInfoBanner').classList.remove('hidden');
    }

    renderCategoryNav();
    renderMenuGrid();
    renderSelectedPanel();

    if (scroll) {
      const nav = document.querySelector('.category-nav');
      if (nav) nav.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  window.clearSelectedPackage = function () {
    _activePackageId = null;
    sessionStorage.removeItem('kc_active_package');
    document.querySelectorAll('.package-chip').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    $('packageInfoBanner').classList.add('hidden');
    renderCategoryNav();
    renderMenuGrid();
    renderSelectedPanel();
  };

  /* ================================================================
     CATEGORY NAV
     ================================================================ */
  function renderCategoryNav() {
    const container = $('categoryNavScroll');
    if (!container) return;

    let categories;
    if (_activePackageId) {
      const pkg = KCPackageRules.getPackage(_activePackageId);
      // Show only categories relevant to selected package, plus 'all'
      const pkgCats = new Set(pkg ? pkg.categoryOrder : []);
      categories = KCMenuData.CATEGORIES.filter(c =>
        c.key === 'all' || pkgCats.has(c.key)
      );
    } else {
      categories = KCMenuData.CATEGORIES;
    }

    container.innerHTML = categories.map(cat => `
      <button class="cat-tab${_activeCategory === cat.key ? ' active' : ''}"
              role="tab"
              aria-selected="${_activeCategory === cat.key}"
              data-cat="${cat.key}"
              onclick="window._kcMenuSetCategory('${cat.key}')">
        ${cat.label}
      </button>
    `).join('');
  }

  window._kcMenuSetCategory = function (catKey) {
    _activeCategory = catKey;
    _searchQuery = '';
    const input = $('menuSearchInput');
    if (input) input.value = '';
    $('menuSearchClear').classList.add('hidden');
    document.querySelectorAll('.cat-tab').forEach(t => {
      const active = t.dataset.cat === catKey;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
    });
    renderMenuGrid();
    updateActiveFiltersLabel();
  };

  /* ================================================================
     SEARCH
     ================================================================ */
  function bindSearch() {
    const input = $('menuSearchInput');
    const clear = $('menuSearchClear');
    if (!input) return;

    input.addEventListener('input', function () {
      _searchQuery = this.value.trim();
      clear.classList.toggle('hidden', !_searchQuery);
      if (_searchQuery) {
        _activeCategory = 'all';
        document.querySelectorAll('.cat-tab').forEach(t => {
          const active = t.dataset.cat === 'all';
          t.classList.toggle('active', active);
          t.setAttribute('aria-selected', active);
        });
      }
      renderMenuGrid();
      updateActiveFiltersLabel();
    });
  }

  window.clearMenuSearch = function () {
    const input = $('menuSearchInput');
    if (input) input.value = '';
    _searchQuery = '';
    $('menuSearchClear').classList.add('hidden');
    renderMenuGrid();
    updateActiveFiltersLabel();
  };

  function updateActiveFiltersLabel() {
    const el = $('activeFilters');
    if (!el) return;
    const parts = [];
    if (_searchQuery)     parts.push(`Search: <strong>"${escHtml(_searchQuery)}"</strong>`);
    if (_activePackageId) {
      const pkg = KCPackageRules.getPackage(_activePackageId);
      if (pkg) parts.push(`Package: <strong>${escHtml(pkg.label)}</strong>`);
    }
    el.innerHTML = parts.join(' &nbsp;·&nbsp; ');
  }

  /* ================================================================
     MENU GRID RENDER
     ================================================================ */
  function renderMenuGrid() {
    const grid = $('menuItemsGrid');
    if (!grid) return;

    // Get items
    let items = _searchQuery
      ? KCMenuData.search(_searchQuery)
      : KCMenuData.getByCategory(_activeCategory);

    // If a package is active, further filter to only items allowed in that package
    if (_activePackageId && !_searchQuery) {
      const activePackage = KCPackageRules.getPackage(_activePackageId);
      const pkgItems = KCMenuData.getByPackage(_activePackageId);
      // A dish with the same name may occur in another PDF section (for
      // example Wazwan and High Tea). Keep only the sections printed for the
      // currently selected package.
      const pkgIds   = new Set(pkgItems
        .filter(i => activePackage && activePackage.categoryOrder.includes(i.category))
        .map(i => i.id));

      if (_activeCategory === 'all') {
        items = items.filter(i => pkgIds.has(i.id));
      } else {
        // also keep items whose category is in the package order
        const pkg = KCPackageRules.getPackage(_activePackageId);
        if (pkg && pkg.categoryOrder.includes(_activeCategory)) {
          items = items.filter(i => pkgIds.has(i.id));
        }
        // if category NOT in package, show all in that category (user browsing)
      }
    }

    if (!items.length) {
      grid.innerHTML = `
        <div class="menu-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>No items match your selection.</p>
        </div>`;
      return;
    }

    // Group by category for display
    const grouped = groupByCategory(items);
    const pkg      = _activePackageId ? KCPackageRules.getPackage(_activePackageId) : null;

    let html = '';
    for (const [catKey, catItems] of Object.entries(grouped)) {
      const catLabel = getCategoryLabel(catKey);
      const limit    = pkg ? KCPackageRules.getLimit(_activePackageId, catKey) : null;
      const selected = KCSelectedMenu.countInCategory(catKey);
      const atLimit  = limit !== null && selected >= limit;

      html += `<div class="menu-section" data-cat-section="${catKey}">
        <h2 class="menu-section-heading">
          ${escHtml(catLabel)}
          <span class="section-count">${catItems.length}</span>
          ${limit !== null ? `<span class="pkg-limit-badge${atLimit ? ' at-limit' : ''}"
            id="limit-badge-${catKey}">
            ${selected}/${limit} selected
          </span>` : ''}
        </h2>
        <div class="menu-items-grid" data-cat-grid="${catKey}">
          ${catItems.map(item => renderItemCard(item, pkg)).join('')}
        </div>
      </div>`;
    }

    grid.innerHTML = html;
  }

  function renderItemCard(menuItem, pkg) {
    const isAdded    = KCSelectedMenu.has(menuItem.id);
    const catKey     = menuItem.category;
    const limit      = pkg ? KCPackageRules.getLimit(pkg.id, catKey) : null;
    const selected   = KCSelectedMenu.countInCategory(catKey);
    const atLimit    = limit !== null && selected >= limit && !isAdded;
    const isVeg      = menuItem.type === 'veg';
    const imgSrc     = menuItem.image || null;
    const placeholder= getCategoryEmoji(catKey);

    return `
      <article class="menu-item-card${isAdded ? ' is-added' : ''}"
               data-item-id="${menuItem.id}"
               aria-label="${escHtml(menuItem.name)}${isVeg ? ', vegetarian' : ', non-vegetarian'}">

        <!-- Veg/Non-veg badge -->
        <span class="veg-badge veg-badge--${isVeg ? 'veg' : 'nonveg'}"
              aria-label="${isVeg ? 'Vegetarian' : 'Non-vegetarian'}">
          <span class="veg-badge-dot"></span>
        </span>

        <!-- Image -->
        <div class="menu-item-img-wrap">
          ${imgSrc
            ? `<img src="${escHtml(imgSrc)}" alt="${escHtml(menuItem.name)}" loading="lazy">`
            : `<span class="menu-item-img-placeholder" aria-hidden="true">${placeholder}</span>`
          }
        </div>

        <!-- Body -->
        <div class="menu-item-body">
          ${menuItem.subcategory
            ? `<span class="menu-item-sub">${escHtml(menuItem.subcategory)}</span>` : ''}
          <h3 class="menu-item-name">${isAdded ? '<span class="selection-tick" aria-hidden="true">✓</span>' : ''}${escHtml(menuItem.name)}</h3>
          ${menuItem.description
            ? `<p class="menu-item-desc">${escHtml(menuItem.description)}</p>` : ''}
          <div class="menu-item-price">
            ${menuItem.price
              ? `₹${Number(menuItem.price).toLocaleString('en-IN')}`
              : `<span class="menu-item-price-na">Price on request</span>`
            }
          </div>
        </div>

        <!-- Add button -->
        <div class="menu-item-footer">
          <button class="btn-add-item${isAdded ? ' added' : ''}"
                  data-item-id="${menuItem.id}"
                  ${atLimit ? 'disabled aria-disabled="true"' : ''}
                  onclick="window._kcMenuAddItem('${menuItem.id}')"
                  aria-label="${isAdded ? 'Remove ' : 'Select '}${escHtml(menuItem.name)} ${isAdded ? 'from' : 'for'} your menu">
            ${isAdded
              ? `<span class="btn-add-icon" aria-hidden="true">✓</span> Selected`
              : atLimit
                ? `Limit Reached`
                : `<span class="btn-add-icon" aria-hidden="true">+</span> Add`
            }
          </button>
        </div>
      </article>`;
  }

  /* ================================================================
     ADD ITEM
     ================================================================ */
  window._kcMenuAddItem = function (itemId) {
    const menuItem = KCMenuData.getById(itemId);
    if (!menuItem) return;

    // Choosing an already-selected item removes it. The tick is therefore a
    // reliable on/off selection indicator rather than a quantity control.
    if (KCSelectedMenu.has(itemId)) {
      KCSelectedMenu.remove(itemId);
      return;
    }

    const catKey = menuItem.category;

    // Check package limit
    if (_activePackageId) {
      const limit    = KCPackageRules.getLimit(_activePackageId, catKey);
      const selected = KCSelectedMenu.countInCategory(catKey);
      if (limit !== null && selected >= limit && !KCSelectedMenu.has(itemId)) {
        showLimitToast(limit, getCategoryLabel(catKey));
        return;
      }
    }

    KCSelectedMenu.add(menuItem);
  };

  /* ================================================================
     SELECTED MENU PANEL
     ================================================================ */
  function bindSelectedMenuEvents() {
    KCSelectedMenu.on('change', function (items) {
      renderSelectedPanel();
      refreshGridAddButtons();
    });
  }

  function renderSelectedPanel() {
    renderConstraintSummary();
    renderSelectedList('selectedItemsList', 'selectedEmptyState');
    updateSelectedCounts();
    renderMobileDrawer();
  }

  function renderConstraintSummary() {
    const el = $('pkgConstraintSummary');
    if (!el) return;

    if (!_activePackageId) {
      el.classList.add('hidden');
      return;
    }

    const pkg = KCPackageRules.getPackage(_activePackageId);
    if (!pkg) { el.classList.add('hidden'); return; }

    const rules = pkg.selectionRules;
    const keys  = Object.keys(rules).filter(k => rules[k] !== null);
    if (!keys.length) { el.classList.add('hidden'); return; }

    let html = '';
    keys.forEach(catKey => {
      const limit    = rules[catKey];
      const selected = KCSelectedMenu.countInCategory(catKey);
      const label    = getCategoryLabel(catKey);
      const pct      = Math.min(100, (selected / limit) * 100);
      const atLimit  = selected >= limit;

      html += `
        <div class="pkg-cat-progress">
          <span>${escHtml(label)}</span>
          <span>${selected} / ${limit}</span>
        </div>
        <div class="pkg-cat-progress-bar">
          <div class="pkg-cat-progress-fill${atLimit ? ' at-limit' : ''}"
               style="width:${pct}%"></div>
        </div>`;
    });

    el.innerHTML = html;
    el.classList.remove('hidden');
  }

  function renderSelectedList(listId, emptyId) {
    const list  = $(listId);
    if (!list) return;
    const items = KCSelectedMenu.getAll();
    const empty = $(emptyId);

    if (!items.length) {
      if (empty) empty.style.display = '';
      // Remove all rows but keep empty state
      list.querySelectorAll('.selected-item-row').forEach(r => r.remove());
      return;
    }

    if (empty) empty.style.display = 'none';

    // Build new HTML
    list.innerHTML = items.map((item, idx) => `
      <div class="selected-item-row" data-item-id="${item.id}">
        <span class="selected-item-index">${idx + 1}.</span>
        <span class="selected-item-veg-dot ${item.type === 'veg' ? 'veg' : 'nonveg'}"
              aria-hidden="true"></span>
        <div class="selected-item-info">
          <div class="selected-item-name" title="${escHtml(item.name)}">${escHtml(item.name)}</div>
          <div class="selected-item-cat">${escHtml(getCategoryLabel(item.category))}</div>
        </div>
        <div class="qty-control" role="group" aria-label="Quantity for ${escHtml(item.name)}">
          <button class="qty-btn" data-action="dec" data-item-id="${item.id}"
                  aria-label="Decrease quantity of ${escHtml(item.name)}">−</button>
          <span class="qty-value" aria-live="polite" aria-atomic="true">${item.quantity}</span>
          <button class="qty-btn" data-action="inc" data-item-id="${item.id}"
                  aria-label="Increase quantity of ${escHtml(item.name)}">+</button>
        </div>
        <button class="btn-remove-item" data-item-id="${item.id}"
                onclick="window._kcMenuRemoveItem('${item.id}')"
                aria-label="Remove ${escHtml(item.name)} from your menu">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
        </button>
      </div>
    `).join('') + ($(emptyId) ? $(emptyId).outerHTML : '');

    // Re-attach empty state
    if (empty && !$(emptyId)) {
      list.appendChild(empty);
      empty.style.display = 'none';
    }

    // Event delegation for qty buttons (efficient)
    list.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const id     = this.dataset.itemId;
        const action = this.dataset.action;
        if (action === 'inc') KCSelectedMenu.increment(id);
        if (action === 'dec') KCSelectedMenu.decrement(id);
      });
    });
  }

  window._kcMenuRemoveItem = function (itemId) {
    KCSelectedMenu.remove(itemId);
  };

  function updateSelectedCounts() {
    const total = KCSelectedMenu.totalItems();

    // Desktop panel
    const countEl = $('selectedMenuCount');
    if (countEl) countEl.textContent = total + (total === 1 ? ' item' : ' items');

    const totalEl = $('selectedTotalItems');
    if (totalEl) totalEl.textContent = total;

    const continueBtn = $('continueBookingBtn');
    if (continueBtn) continueBtn.disabled = (total === 0);

    const clearBtn = $('clearAllBtn');
    if (clearBtn) clearBtn.style.display = total > 0 ? '' : 'none';

    // Mobile badge
    const badge = $('mobileCartBadge');
    if (badge) badge.textContent = total;

    const mobileBtn = $('mobileContinueBookingBtn');
    if (mobileBtn) mobileBtn.disabled = (total === 0);

    const mobileTotalEl = $('mobileSelectedTotalItems');
    if (mobileTotalEl) mobileTotalEl.textContent = total;
  }

  /* ================================================================
     MOBILE DRAWER
     ================================================================ */
  function renderMobileDrawer() {
    const body = $('mobileCartDrawerBody');
    if (!body) return;

    const items = KCSelectedMenu.getAll();
    if (!items.length) {
      body.innerHTML = `
        <div class="selected-empty-state">
          <p>No items selected yet.</p>
          <p>Tap <strong>+ Add</strong> on any dish.</p>
        </div>`;
      return;
    }

    body.innerHTML = items.map((item, idx) => `
      <div class="selected-item-row" data-item-id="${item.id}">
        <span class="selected-item-index">${idx + 1}.</span>
        <span class="selected-item-veg-dot ${item.type === 'veg' ? 'veg' : 'nonveg'}"
              aria-hidden="true"></span>
        <div class="selected-item-info">
          <div class="selected-item-name">${escHtml(item.name)}</div>
          <div class="selected-item-cat">${escHtml(getCategoryLabel(item.category))}</div>
        </div>
        <div class="qty-control" role="group" aria-label="Qty for ${escHtml(item.name)}">
          <button class="qty-btn" data-action="dec" data-item-id="${item.id}"
                  aria-label="Decrease quantity">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" data-action="inc" data-item-id="${item.id}"
                  aria-label="Increase quantity">+</button>
        </div>
        <button class="btn-remove-item"
                onclick="KCSelectedMenu.remove('${item.id}')"
                aria-label="Remove ${escHtml(item.name)}">
          ×
        </button>
      </div>`).join('');

    body.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const id     = this.dataset.itemId;
        const action = this.dataset.action;
        if (action === 'inc') KCSelectedMenu.increment(id);
        if (action === 'dec') KCSelectedMenu.decrement(id);
      });
    });
  }

  window.openMobileCartDrawer = function () {
    $('mobileCartOverlay').classList.add('open');
    $('mobileCartDrawer').classList.add('open');
    $('mobileCartDrawer').setAttribute('aria-hidden', 'false');
    $('mobileCartBtn').setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  window.closeMobileCartDrawer = function () {
    $('mobileCartOverlay').classList.remove('open');
    $('mobileCartDrawer').classList.remove('open');
    $('mobileCartDrawer').setAttribute('aria-hidden', 'true');
    $('mobileCartBtn').setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  /* ================================================================
     REFRESH GRID ADD-BUTTONS (after selection changes)
     ================================================================ */
  function refreshGridAddButtons() {
    const pkg = _activePackageId ? KCPackageRules.getPackage(_activePackageId) : null;

    // Update section limit badges
    document.querySelectorAll('[data-cat-section]').forEach(section => {
      const catKey  = section.dataset.catSection;
      const badge   = section.querySelector(`#limit-badge-${catKey}`);
      const limit   = pkg ? KCPackageRules.getLimit(_activePackageId, catKey) : null;
      const selected= KCSelectedMenu.countInCategory(catKey);
      const atLimit = limit !== null && selected >= limit;

      if (badge) {
        badge.textContent = `${selected}/${limit} selected`;
        badge.classList.toggle('at-limit', atLimit);
      }
    });

    // Update each card's button state
    document.querySelectorAll('.menu-item-card[data-item-id]').forEach(card => {
      const itemId   = card.dataset.itemId;
      const menuItem = KCMenuData.getById(itemId);
      if (!menuItem) return;

      const catKey  = menuItem.category;
      const limit   = pkg ? KCPackageRules.getLimit(_activePackageId, catKey) : null;
      const selected= KCSelectedMenu.countInCategory(catKey);
      const isAdded = KCSelectedMenu.has(itemId);
      const atLimit = limit !== null && selected >= limit && !isAdded;

      const btn = card.querySelector('.btn-add-item');
      if (!btn) return;
      const name = card.querySelector('.menu-item-name');
      const tick = name && name.querySelector('.selection-tick');

      if (isAdded) {
        btn.classList.add('added');
        btn.disabled = false;
        btn.setAttribute('aria-disabled', 'false');
        btn.innerHTML = `<span class="btn-add-icon" aria-hidden="true">✓</span> Selected`;
        btn.setAttribute('aria-label', `Remove ${menuItem.name} from your menu`);
        if (name && !tick) name.insertAdjacentHTML('afterbegin', '<span class="selection-tick" aria-hidden="true">✓</span>');
        card.classList.add('is-added');
        // brief animation
        card.classList.remove('just-added');
        void card.offsetWidth;
        card.classList.add('just-added');
        setTimeout(() => card.classList.remove('just-added'), 300);
      } else if (atLimit) {
        btn.classList.remove('added');
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
        btn.innerHTML = `Limit Reached`;
        btn.setAttribute('aria-label', `${menuItem.name}: package limit reached`);
        if (tick) tick.remove();
        card.classList.remove('is-added');
      } else {
        btn.classList.remove('added');
        btn.disabled = false;
        btn.setAttribute('aria-disabled', 'false');
        btn.innerHTML = `<span class="btn-add-icon" aria-hidden="true">+</span> Add`;
        btn.setAttribute('aria-label', `Select ${menuItem.name} for your menu`);
        if (tick) tick.remove();
        card.classList.remove('is-added');
      }
    });
  }

  /* ================================================================
     CONTINUE BOOKING
     ================================================================ */
  window.continueToBooking = function () {
    const items = KCSelectedMenu.getAll();
    if (!items.length) return;

    // Persist to localStorage for booking.js to pick up
    try {
      localStorage.setItem('kcPreselectedMenu', JSON.stringify(items));
      if (_activePackageId) {
        localStorage.setItem('kcPreselectedPackage', _activePackageId);
      }
    } catch (_) {}

    window.location.href = '../index.html';
    // booking modal will be opened by index.html on load (handled below)
  };

  /* ================================================================
     CLEAR ALL
     ================================================================ */
  window.clearAllSelected = function () {
    if (!KCSelectedMenu.totalItems()) return;
    if (confirm('Clear all selected items?')) {
      KCSelectedMenu.clear();
    }
  };

  /* ================================================================
     LIMIT TOAST
     ================================================================ */
  function showLimitToast(limit, categoryLabel) {
    const toast = $('limitToast');
    const msg   = $('limitToastMsg');
    if (!toast || !msg) return;

    msg.textContent = `Maximum ${limit} items from "${categoryLabel}" — remove one to add another.`;
    toast.classList.remove('hidden');

    clearTimeout(_limitToastTimer);
    _limitToastTimer = setTimeout(() => toast.classList.add('hidden'), 3500);
  }

  /* ================================================================
     HELPERS
     ================================================================ */
  function groupByCategory(items) {
    const map = {};
    items.forEach(item => {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    });
    return map;
  }

  function getCategoryLabel(key) {
    const cat = KCMenuData.CATEGORIES.find(c => c.key === key);
    return cat ? cat.label : key;
  }

  function getCategoryEmoji(key) {
    const map = {
      'beverages':         '🥤',
      'soups':             '🍲',
      'veg-appetizers':    '🥗',
      'nonveg-appetizers': '🍢',
      'veg-main':          '🫕',
      'nonveg-main':       '🍛',
      'rice-biryani':      '🍚',
      'breads':            '🫓',
      'raita':             '🥣',
      'salads':            '🥙',
      'live-counters':     '🍳',
      'desserts':          '🍮',
      'wazwan':            '🫙',
      'high-tea':          '🫖',
    };
    return map[key] || '🍽️';
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ── Keyboard: close drawer on Escape ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileCartDrawer();
    }
  });

})();
