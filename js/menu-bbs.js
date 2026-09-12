/* ================================================================
   KASHMIR CATERER'S (BBS) — Interactive Menu Selection Engine
   ================================================================ */

(function () {

  const { PACKAGES, SECTIONS, ITEMS } = window.KCMenuData;

  /* ── State ── */
  let activePackage = null;
  let selected = {};  // id -> item object

  /* ── DOM Refs ── */
  const pkgList    = document.getElementById('pkg-list');
  const menuBody   = document.getElementById('menu-body');
  const summaryList = document.getElementById('summary-list');
  const summaryEmpty = document.getElementById('summary-empty');
  const totalBadge  = document.getElementById('total-badge');
  const summarySection = document.getElementById('booking-section');

  /* ═══════════════════════════════
     RENDER PACKAGE CHIPS
  ═══════════════════════════════ */
  function renderPackages() {
    pkgList.innerHTML = PACKAGES.map(pkg => `
      <button class="pkg-chip${activePackage === pkg.key ? ' active' : ''}"
              data-pkg="${pkg.key}"
              onclick="BBSMenu.selectPackage('${pkg.key}')">
        <span class="pkg-chip-label">${pkg.label}</span>
        <span class="pkg-chip-pax">${pkg.pax}</span>
      </button>
    `).join('');
  }

  /* ═══════════════════════════════
     SELECT PACKAGE
  ═══════════════════════════════ */
  function selectPackage(key) {
    activePackage = key;
    selected = {};
    renderPackages();
    renderMenu();
    renderSummary();
  }

  /* ═══════════════════════════════
     RENDER MENU SECTIONS
  ═══════════════════════════════ */
  function renderMenu() {
    if (!activePackage) {
      menuBody.innerHTML = `
        <div class="menu-placeholder">
          <div class="menu-placeholder-icon">🍽️</div>
          <p>Select a package above to view menu items.</p>
        </div>`;
      return;
    }

    const pkg = PACKAGES.find(p => p.key === activePackage);
    const relevantSections = SECTIONS.filter(s => s.pkg.includes(activePackage));

    menuBody.innerHTML = relevantSections.map(sec => {
      const items = ITEMS.filter(it => it.section === sec.key);
      if (!items.length) return '';

      const limitNum = pkg.limits[sec.key];
      const limitLabel = sec.limit ? `<span class="section-limit">(${sec.limit})</span>` : '';

      return `
        <div class="menu-section" id="sec-${sec.key}" data-section="${sec.key}">
          <div class="section-header">
            <h3 class="section-title">${sec.label} ${limitLabel}</h3>
            ${limitNum ? `<span class="section-counter" id="ctr-${sec.key}">0 / ${limitNum} selected</span>` : ''}
          </div>
          <ul class="item-list">
            ${items.map(it => renderItemRow(it, sec, limitNum)).join('')}
          </ul>
        </div>`;
    }).join('');
  }

  function renderItemRow(it, sec, limitNum) {
    const isSelected = !!selected[it.id];
    const atLimit = limitNum !== null && limitNum !== undefined &&
                    countSelected(sec.key) >= limitNum && !isSelected;
    const rateTag = it.rate
      ? `<span class="item-rate">${it.rate}</span>`
      : '';
    const noteTag = it.note
      ? `<span class="item-note">${it.note}</span>`
      : '';
    const typeTag = `<span class="item-type-dot item-type-${it.type.replace('-','')}" title="${it.type}"></span>`;

    return `
      <li class="item-row${isSelected ? ' selected' : ''}${atLimit ? ' at-limit' : ''}"
          data-id="${it.id}" data-section="${sec.key}">
        <button class="item-circle${isSelected ? ' checked' : ''}"
                onclick="BBSMenu.toggleItem('${it.id}','${sec.key}',${limitNum || 'null'})"
                aria-label="${isSelected ? 'Deselect' : 'Select'} ${it.name}"
                aria-pressed="${isSelected}"
                ${atLimit ? 'disabled' : ''}>
          ${isSelected ? '<svg viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        </button>
        ${typeTag}
        <span class="item-name">${it.name}</span>
        ${noteTag}
        ${rateTag}
      </li>`;
  }

  function countSelected(sectionKey) {
    return Object.values(selected).filter(it => it.section === sectionKey).length;
  }

  /* ═══════════════════════════════
     TOGGLE ITEM
  ═══════════════════════════════ */
  function toggleItem(id, sectionKey, limit) {
    const item = ITEMS.find(it => it.id === id);
    if (!item) return;

    if (selected[id]) {
      delete selected[id];
    } else {
      if (limit !== null && countSelected(sectionKey) >= limit) return;
      selected[id] = item;
    }

    // Re-render just this section
    const pkg = PACKAGES.find(p => p.key === activePackage);
    const sec = SECTIONS.find(s => s.key === sectionKey);
    const secEl = document.getElementById(`sec-${sectionKey}`);
    if (secEl && sec) {
      const limitNum = pkg.limits[sectionKey];
      const ul = secEl.querySelector('.item-list');
      const items = ITEMS.filter(it => it.section === sectionKey);
      ul.innerHTML = items.map(it => renderItemRow(it, sec, limitNum)).join('');
      // Update counter
      const ctr = document.getElementById(`ctr-${sectionKey}`);
      if (ctr && limitNum) ctr.textContent = `${countSelected(sectionKey)} / ${limitNum} selected`;
    }

    renderSummary();
  }

  /* ═══════════════════════════════
     RENDER SUMMARY PANEL
  ═══════════════════════════════ */
  function renderSummary() {
    const items = Object.values(selected);
    const count = items.length;
    totalBadge.textContent = count;

    // Update mobile badge if present
    const mob = document.getElementById('mob-badge');
    if (mob) mob.textContent = count;

    if (!count) {
      summaryEmpty.style.display = 'block';
      summaryList.innerHTML = '';
      return;
    }

    summaryEmpty.style.display = 'none';

    // Group by section
    const bySection = {};
    items.forEach(it => {
      if (!bySection[it.section]) bySection[it.section] = [];
      bySection[it.section].push(it);
    });

    summaryList.innerHTML = Object.entries(bySection).map(([secKey, secItems]) => {
      const sec = SECTIONS.find(s => s.key === secKey);
      const label = sec ? sec.label : secKey;
      return `
        <div class="summary-group">
          <div class="summary-group-title">${label}</div>
          ${secItems.map(it => `
            <div class="summary-item" data-id="${it.id}">
              <button class="item-circle checked summary-circle"
                      onclick="BBSMenu.toggleItem('${it.id}','${it.section}',null)"
                      title="Remove ${it.name}">
                <svg viewBox="0 0 12 12" fill="none">
                  <polyline points="2,6 5,9 10,3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <span class="item-type-dot item-type-${it.type.replace('-','')}" title="${it.type}"></span>
              <span class="summary-item-name">${it.name}</span>
              ${it.rate ? `<span class="item-rate">${it.rate}</span>` : ''}
            </div>`).join('')}
        </div>`;
    }).join('');
  }

  /* ═══════════════════════════════
     SCROLL TO SUMMARY
  ═══════════════════════════════ */
  function scrollToSummary() {
    summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ═══════════════════════════════
     CLEAR ALL
  ═══════════════════════════════ */
  function clearAll() {
    selected = {};
    renderMenu();
    renderSummary();
  }

  /* ═══════════════════════════════
     BOOKING FORM SUBMIT
  ═══════════════════════════════ */
  function handleBookingSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name    = form.querySelector('#b-name').value.trim();
    const phone   = form.querySelector('#b-phone').value.trim();
    const date    = form.querySelector('#b-date').value;
    const pax     = form.querySelector('#b-pax').value.trim();
    const venue   = form.querySelector('#b-venue').value.trim();

    const itemList = Object.values(selected).map(i => i.name).join(', ') || 'None selected';
    const pkg = PACKAGES.find(p => p.key === activePackage);
    const pkgLabel = pkg ? pkg.label : 'Not selected';

    const wa = `https://wa.me/919419123005?text=${encodeURIComponent(
      `*New Catering Enquiry — Kashmir Caterer's (BBS)*\n\n` +
      `Name: ${name}\nPhone: ${phone}\nDate: ${date}\nGuests: ${pax}\nVenue: ${venue}\n` +
      `Package: ${pkgLabel}\n\nSelected Items:\n${itemList}`
    )}`;
    window.open(wa, '_blank');
  }

  /* ═══════════════════════════════
     INIT
  ═══════════════════════════════ */
  function init() {
    renderPackages();
    renderMenu();
    renderSummary();

    const form = document.getElementById('booking-form');
    if (form) form.addEventListener('submit', handleBookingSubmit);
  }

  /* ── Public API ── */
  window.BBSMenu = {
    selectPackage,
    toggleItem,
    scrollToSummary,
    clearAll,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
