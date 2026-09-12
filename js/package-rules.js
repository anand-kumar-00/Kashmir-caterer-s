/* ================================================================
   KASHMIR CATERERS — PACKAGE RULES
   Source: Mega Veg, Mega Non Veg, Mini Veg, Koshur, Hi Tea, Wazwan PDFs
   Each package defines:
     - metadata (label, minPax, description)
     - selectionRules: max items allowed per category key
       null = unlimited
   ================================================================ */

window.KCPackageRules = (function () {

  const PACKAGES = [
    {
      id:          'mini-veg',
      label:       'Mini Veg',
      minPax:      300,
      type:        'veg',
      description: 'A refined all-vegetarian banquet for 300+ guests — curated from the finest Kashmiri and continental vegetarian dishes.',
      selectionRules: {
        beverages:          2,   // cold beverages
        soups:              1,
        'veg-appetizers':   4,
        'veg-main':         4,
        'rice-biryani':     2,
        raita:              2,
        salads:             3,
        'live-counters':    4,
        breads:             null, // assorted bread is included
        desserts:           3,
      },
      categoryOrder: [
        'beverages','soups','veg-appetizers','veg-main',
        'rice-biryani','breads','raita','salads','live-counters','desserts',
      ],
    },
    {
      id:          'mega-veg',
      label:       'Mega Veg',
      minPax:      300,
      type:        'veg',
      description: 'The grand all-vegetarian experience for 300+ guests — maximum choice, full buffet, live counters included.',
      selectionRules: {
        beverages:          4,   // any four cold beverages
        soups:              2,
        'veg-appetizers':   6,
        'veg-main':         5,
        'rice-biryani':     2,
        raita:              2,
        salads:             5,
        breads:             null, // assorted bread is included
        'live-counters':    6,
        desserts:           4,
      },
      categoryOrder: [
        'beverages','soups','veg-appetizers','veg-main',
        'rice-biryani','breads','raita','salads','live-counters','desserts',
      ],
    },
    {
      id:          'mega-nonveg',
      label:       'Mega Non-Veg',
      minPax:      250,
      type:        'non-veg',
      description: 'The complete premium non-vegetarian banquet for 250+ guests — Kashmiri, Continental and Indian dishes.',
      selectionRules: {
        beverages:           4,  // any four cold beverages
        soups:               2,
        'veg-appetizers':    4,
        'nonveg-appetizers': 4,
        'veg-main':          4,
        'nonveg-main':       4,
        'rice-biryani':      2,
        raita:               2,
        salads:              5,
        breads:              null, // assorted bread is included
        'live-counters':     4,
        desserts:            4,
      },
      categoryOrder: [
        'beverages','soups','veg-appetizers','nonveg-appetizers',
        'veg-main','nonveg-main','rice-biryani','breads',
        'raita','salads','live-counters','desserts',
      ],
    },
    {
      id:          'koshur',
      label:       'Koshur Non-Veg',
      minPax:      250,
      type:        'non-veg',
      description: 'Authentic Kashmiri Wazwan-style non-vegetarian banquet for 250+ guests — the true taste of Kashmir.',
      selectionRules: {
        // The Koshur PDF is a fixed, included menu rather than an
        // "any N" package.  Its available PDF items are selectable.
        beverages:           null,
        soups:               null,
        'nonveg-appetizers': null,
        'veg-appetizers':    null,
        'veg-main':          null,
        'nonveg-main':       null,
        'rice-biryani':      null,
        raita:               null,
        salads:              null,
        breads:              null,
        desserts:            null,
      },
      categoryOrder: [
        'beverages','soups','veg-appetizers','nonveg-appetizers','veg-main',
        'nonveg-main','rice-biryani','breads','raita','salads','desserts',
      ],
    },
    {
      id:          'high-tea-veg',
      label:       'High Tea — Vegetarian',
      minPax:      50,
      type:        'veg',
      description: 'An elegant vegetarian high tea experience for 50+ guests — perfect for corporate and afternoon events.',
      selectionRules: {
        beverages:          2,
        'veg-appetizers':   4,
        'live-counters':    1,
        breads:             null,
        desserts:           1,
        'high-tea':         null,
      },
      categoryOrder: [
        'beverages','veg-appetizers','live-counters','breads','desserts','high-tea',
      ],
    },
    {
      id:          'high-tea-nonveg',
      label:       'High Tea — Non-Vegetarian',
      minPax:      50,
      type:        'non-veg',
      description: 'A premium non-vegetarian high tea for 50+ guests — grilled dishes, wraps and sweet finishes.',
      selectionRules: {
        beverages:           2,
        'nonveg-appetizers': 4,
        'high-tea':          null,
        breads:              null,
        desserts:            1,
      },
      categoryOrder: [
        'beverages','nonveg-appetizers','high-tea','breads','desserts',
      ],
    },
    {
      id:          'wazwan',
      label:       'Wazwan',
      minPax:      null,
      type:        'non-veg',
      description: 'The royal Kashmiri feast — cloud kitchen format. Rates as per Wazwan PDF (reference rates up to 31.03.2025; confirm current pricing).',
      note:        'Listed rates are reference only (up to 31.03.2025). Confirm current pricing before presenting to customer.',
      selectionRules: {
        'wazwan': null,  // no restriction — all wazwan items selectable
      },
      categoryOrder: ['wazwan'],
    },
  ];

  /* ── helper ── */
  function getPackage(pkgId) {
    return PACKAGES.find(p => p.id === pkgId) || null;
  }

  /**
   * Given a package id and a category key, return the maximum number of
   * items allowed (null = unlimited).
   */
  function getLimit(pkgId, categoryKey) {
    const pkg = getPackage(pkgId);
    if (!pkg) return null;
    const rules = pkg.selectionRules;
    if (categoryKey in rules) return rules[categoryKey];
    return null;
  }

  /**
   * Returns a human-readable label for the rule limit.
   * e.g. "Any 4" or "Unlimited"
   */
  function getLimitLabel(pkgId, categoryKey) {
    const limit = getLimit(pkgId, categoryKey);
    if (limit === null) return 'Unlimited';
    return `Any ${limit}`;
  }

  return {
    PACKAGES,
    getPackage,
    getLimit,
    getLimitLabel,
  };

})();
