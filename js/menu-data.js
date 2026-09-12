/* ================================================================
   KASHMIR CATERERS — CENTRAL MENU DATA
   Source of truth: Menu Card WITH 8 PAGES.pdf, Mega Veg, Mega Non Veg,
   Mini Veg, Koshur, Hi Tea Menu, Wazwan PDFs.
   DO NOT scatter menu items in HTML. Edit here only.
   ================================================================ */

window.KCMenuData = (function () {

  /* ── helper ── */
  function id(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  /* ================================================================
     CATEGORY DEFINITIONS  (used for nav + filtering)
     ================================================================ */
  const CATEGORIES = [
    { key: 'all',              label: 'All Items' },
    { key: 'beverages',        label: 'Beverages' },
    { key: 'soups',            label: 'Soups' },
    { key: 'veg-appetizers',   label: 'Veg Appetizers' },
    { key: 'nonveg-appetizers',label: 'Non-Veg Appetizers' },
    { key: 'veg-main',         label: 'Veg Main Course' },
    { key: 'nonveg-main',      label: 'Non-Veg Main Course' },
    { key: 'rice-biryani',     label: 'Rice & Biryani' },
    { key: 'breads',           label: 'Breads / Naan' },
    { key: 'salads',           label: 'Salad Station' },
    { key: 'raita',            label: 'Raita & Curd' },
    { key: 'live-counters',    label: 'Live Counters' },
    { key: 'desserts',         label: 'Desserts' },
    { key: 'wazwan',           label: 'Wazwan' },
    { key: 'high-tea',         label: 'High Tea' },
  ];

  /* ================================================================
     ITEM FACTORY
     ================================================================ */
  function item(name, category, type, opts) {
    opts = opts || {};
    return {
      id:          opts.id      || id(name),
      name:        name,
      category:    category,          // key from CATEGORIES
      type:        type,              // 'veg' | 'non-veg'
      price:       opts.price   || null,
      description: opts.desc    || '',
      packages:    opts.pkg     || [],
      source:      opts.src     || '',   // original PDF wording if combined
      subcategory: opts.sub     || '',   // e.g. 'fish', 'chicken', 'mutton'
      quantityUnit:opts.qty     || null, // Wazwan only
      rate:        opts.rate    || null, // Wazwan reference rate (NOT current price)
      available:   true,
      image:       opts.img     || null,
    };
  }

  /* ================================================================
     BEVERAGES
     ================================================================ */
  const beverages = [
    item('Assorted Cold Drinks',    'beverages','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur']}),
    item('Assorted Juices',         'beverages','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur']}),
    item('Fresh Lemon Soda',        'beverages','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur','high-tea']}),
    item('Virgin Pina Colada',      'beverages','veg',{pkg:['mega-veg','mega-nonveg']}),
    item('Blue Lagoon',             'beverages','veg',{pkg:['mega-veg','mega-nonveg']}),
    item('Strawberry Smoothie',     'beverages','veg',{pkg:['mega-veg','mega-nonveg']}),
    item('Pineapple Smoothie',      'beverages','veg',{pkg:['mega-veg','mega-nonveg']}),
    item('Orange Smoothie',         'beverages','veg',{pkg:['mega-veg','mega-nonveg']}),
    item('Kesar Qehwa',             'beverages','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur','high-tea']}),
    item('Mocktails',               'beverages','veg',{pkg:['mega-veg','mega-nonveg']}),
    item('Shakes & Punches',        'beverages','veg',{pkg:['mega-veg','mega-nonveg']}),
    item('Jal Jeera',               'beverages','veg',{pkg:['mega-veg','mega-nonveg','mini-veg']}),
    item('Aam Ka Panna',            'beverages','veg',{pkg:['mega-veg','mega-nonveg','mini-veg']}),
    item('Lipton Tea',              'beverages','veg',{pkg:['high-tea']}),
    item('Coffee',                  'beverages','veg',{pkg:['high-tea']}),
  ];

  /* ================================================================
     SOUPS — VEGETARIAN
     ================================================================ */
  const soupsVeg = [
    item('Cream of Mushroom Soup',   'soups','veg'),
    item('Vegetable Soup',           'soups','veg'),
    item('Cream of Tomato Soup',     'soups','veg'),
    item('Hot n Sour Soup',          'soups','veg'),
    item('Almond Soup',              'soups','veg'),
    item('Lemon Coriander Soup',     'soups','veg'),
    item('Sweet Corn Soup',          'soups','veg'),
    item('Veg. Telumein Soup',       'soups','veg'),
    item('Man-chow Soup',            'soups','veg',{sub:'veg'}),
    item('Vegetable Thupka',         'soups','veg'),
    item('Cream of Vegetable Soup',  'soups','veg'),
    item('Tomato Basil Soup',        'soups','veg'),
    item('Tomato Dhania Shorba',     'soups','veg'),
  ];

  /* ================================================================
     SOUPS — NON-VEGETARIAN
     ================================================================ */
  const soupsNonVeg = [
    item('Chicken Coriander Soup',   'soups','non-veg',{sub:'chicken'}),
    item('Chicken Man-chow Soup',    'soups','non-veg',{sub:'chicken'}),
    item('Chicken Sweet Corn Soup',  'soups','non-veg',{sub:'chicken'}),
    item('Sea Food Soup',            'soups','non-veg',{sub:'seafood'}),
    item('Chicken Shorba',           'soups','non-veg',{sub:'chicken'}),
    item('Mutton Shorba',            'soups','non-veg',{sub:'mutton'}),
    item('Chicken Thupka',           'soups','non-veg',{sub:'chicken'}),
    item('Smoked Sausage Soup',      'soups','non-veg',{sub:'chicken'}),
  ];

  /* ================================================================
     VEG APPETIZERS
     ================================================================ */
  const vegAppetizers = [
    // Paneer
    item('Paneer Tikka',             'veg-appetizers','veg',{pkg:['mega-veg','mini-veg','high-tea-veg']}),
    item('Paneer Tikka Irani',       'veg-appetizers','veg'),
    item('Paneer Achaari Tikka',     'veg-appetizers','veg'),
    item('Malai Paneer Tikka',       'veg-appetizers','veg'),
    item('Paneer Haryali Tikka',     'veg-appetizers','veg'),
    item('Paneer Tawa Tikka',        'veg-appetizers','veg'),
    item('Paneer Manchurian',        'veg-appetizers','veg'),
    item('Paneer Rolls',             'veg-appetizers','veg'),
    item('Paneer Garlic',            'veg-appetizers','veg'),
    item('Paneer Popcorn',           'veg-appetizers','veg'),
    item('Paneer Satay',             'veg-appetizers','veg'),
    item('Paneer Cutlets',           'veg-appetizers','veg'),
    item('Paneer Zeera',             'veg-appetizers','veg'),
    item('Paneer Pakora',            'veg-appetizers','veg',{pkg:['high-tea-veg']}),
    item('Paneer Chilly',            'veg-appetizers','veg'),
    // Mushroom
    item('Mushroom Button',          'veg-appetizers','veg'),
    item('Mushroom Masala Tikka',    'veg-appetizers','veg'),
    item('Mushroom Chilly',          'veg-appetizers','veg'),
    item('Mushroom Garlic',          'veg-appetizers','veg'),
    item('Mushroom Crispy',          'veg-appetizers','veg'),
    item('Mushroom Stuffed',         'veg-appetizers','veg'),
    item('Mushroom Satay',           'veg-appetizers','veg'),
    item('Mushroom Tikki',           'veg-appetizers','veg'),
    item('Mushroom Cutlet',          'veg-appetizers','veg'),
    // Champ
    item('Champ Afghani Malai Tikka','veg-appetizers','veg',{pkg:['high-tea-veg']}),
    item('Champ Chilly',             'veg-appetizers','veg',{pkg:['high-tea-veg']}),
    item('Champ Masala Tikka',       'veg-appetizers','veg'),
    // Rolls & Balls
    item('Manchurian Balls',         'veg-appetizers','veg'),
    item('Potato Balls',             'veg-appetizers','veg'),
    item('Cheese Balls',             'veg-appetizers','veg'),
    item('Cheese Rolls',             'veg-appetizers','veg'),
    item('Spring Rolls',             'veg-appetizers','veg'),
    item('Cigar Rolls',              'veg-appetizers','veg'),
    item('Potato Rolls',             'veg-appetizers','veg'),
    item('Kathi Roll',               'veg-appetizers','veg'),
    item('Corn Rolls',               'veg-appetizers','veg'),
    item('Mint Rolls',               'veg-appetizers','veg'),
    item('Till Roll',                'veg-appetizers','veg'),
    // Fries
    item('Finger Chips',             'veg-appetizers','veg'),
    item('French Fries',             'veg-appetizers','veg'),
    // Kababs & Others
    item('Hare Bhare Kabab',         'veg-appetizers','veg'),
    item('Honey Chilly Lotus Stem',  'veg-appetizers','veg'),
    item('Honey Chilly Potato',      'veg-appetizers','veg'),
    item('Vegetable Bullets',        'veg-appetizers','veg'),
    item('Vegetable Cutlets',        'veg-appetizers','veg'),
    item('Vegetable Gold Coin',      'veg-appetizers','veg'),
    item('Adrak Methi Tikki',        'veg-appetizers','veg'),
    item('Veg. Shami Kabab',         'veg-appetizers','veg'),
    item('Golden Fried Baby Corn',   'veg-appetizers','veg'),
    item('Crispy Veg.',              'veg-appetizers','veg'),
    item('Steamed Momos',            'veg-appetizers','veg',{sub:'veg'}),
    item('Fried Momos',              'veg-appetizers','veg',{sub:'veg'}),
    item('Samosa Mathi',             'veg-appetizers','veg'),
    item('Mixed Veg. Pakora',        'veg-appetizers','veg'),
    item('Gobi Pakora',              'veg-appetizers','veg'),
    item('Cocktail Samosa',          'veg-appetizers','veg'),
  ];

  /* ================================================================
     NON-VEG APPETIZERS
     ================================================================ */
  const nonVegAppetizers = [
    // Fish
    item('Fish Finger',              'nonveg-appetizers','non-veg',{sub:'fish'}),
    item('Fish Zeera',               'nonveg-appetizers','non-veg',{sub:'fish'}),
    item('Fish Amritsari',           'nonveg-appetizers','non-veg',{sub:'fish'}),
    item('Fish Malai Tikka',         'nonveg-appetizers','non-veg',{sub:'fish'}),
    item('Fish Pudina Tikka',        'nonveg-appetizers','non-veg',{sub:'fish'}),
    item('Fish Achaari Tikka',       'nonveg-appetizers','non-veg',{sub:'fish'}),
    item('Fish Creamy Tikka',        'nonveg-appetizers','non-veg',{sub:'fish'}),
    item('Fish Satay',               'nonveg-appetizers','non-veg',{sub:'fish'}),
    item('Fish Lemon',               'nonveg-appetizers','non-veg',{sub:'fish'}),
    item('Fish Chilly',              'nonveg-appetizers','non-veg',{sub:'fish'}),
    // Chicken
    item('Chicken Masala Tikka',          'nonveg-appetizers','non-veg',{sub:'chicken',pkg:['mega-nonveg','koshur']}),
    item('Chicken Afghani Tikka',         'nonveg-appetizers','non-veg',{sub:'chicken',pkg:['mega-nonveg','koshur']}),
    item('Chicken Malai Tikka',           'nonveg-appetizers','non-veg',{sub:'chicken',pkg:['mega-nonveg','koshur']}),
    item('Chicken Pudina Tikka',          'nonveg-appetizers','non-veg',{sub:'chicken'}),
    item('Chicken Tikka with Kali Mirch', 'nonveg-appetizers','non-veg',{sub:'chicken'}),
    item('Chicken Manchurian',            'nonveg-appetizers','non-veg',{sub:'chicken'}),
    item('Chicken Zeera',                 'nonveg-appetizers','non-veg',{sub:'chicken'}),
    item('Chicken Pakora',                'nonveg-appetizers','non-veg',{sub:'chicken',pkg:['high-tea-nonveg']}),
    item('Chicken Tangri Kabab',          'nonveg-appetizers','non-veg',{sub:'chicken',pkg:['mega-nonveg','koshur']}),
    item('Chicken Reshmi Kabab',          'nonveg-appetizers','non-veg',{sub:'chicken',pkg:['mega-nonveg']}),
    item('Chicken Salami',                'nonveg-appetizers','non-veg',{sub:'chicken'}),
    item('Chicken Sausages',              'nonveg-appetizers','non-veg',{sub:'chicken'}),
    item('Chicken Ginger-Garlic',         'nonveg-appetizers','non-veg',{sub:'chicken'}),
    item('Chicken Kabab',                 'nonveg-appetizers','non-veg',{sub:'chicken',pkg:['high-tea-nonveg']}),
    item('Chicken Roasted with Bones',    'nonveg-appetizers','non-veg',{sub:'chicken'}),
    item('Chicken Chilly',                'nonveg-appetizers','non-veg',{sub:'chicken'}),
    item('Chicken Satay',                 'nonveg-appetizers','non-veg',{sub:'chicken'}),
    item('Chicken Momos Steam',           'nonveg-appetizers','non-veg',{sub:'chicken'}),
    item('Chicken Momos Fried',           'nonveg-appetizers','non-veg',{sub:'chicken'}),
    item('Drums of Heaven',               'nonveg-appetizers','non-veg',{sub:'chicken',src:'Drums of Heaven / Chicken Lollipop'}),
    item('Chicken Lollipop',              'nonveg-appetizers','non-veg',{sub:'chicken',src:'Drums of Heaven / Chicken Lollipop'}),
    // Mutton
    item('Mutton Seekh Kabab',       'nonveg-appetizers','non-veg',{sub:'mutton',pkg:['mega-nonveg','koshur']}),
    item('Mutton Shami Kabab',       'nonveg-appetizers','non-veg',{sub:'mutton'}),
    item('Mutton Boti Kabab',        'nonveg-appetizers','non-veg',{sub:'mutton'}),
    item('Mutton Tikka',             'nonveg-appetizers','non-veg',{sub:'mutton',pkg:['mega-nonveg','koshur']}),
    item('Mutton Tandoori with Bones','nonveg-appetizers','non-veg',{sub:'mutton'}),
    item('Mutton Cutlet',            'nonveg-appetizers','non-veg',{sub:'mutton'}),
    item('Mutton Balls',             'nonveg-appetizers','non-veg',{sub:'mutton'}),
    item('Mutton Chilly Cutlets',    'nonveg-appetizers','non-veg',{sub:'mutton'}),
    item('Mutton Momos Steam',       'nonveg-appetizers','non-veg',{sub:'mutton'}),
    item('Mutton Momos Fried',       'nonveg-appetizers','non-veg',{sub:'mutton'}),
    item('Mutton Chilly Balls',      'nonveg-appetizers','non-veg',{sub:'mutton'}),
    item('Mutton Fried Ribs',        'nonveg-appetizers','non-veg',{sub:'mutton',src:'Mutton Fried Ribs / Tabakmaaz',pkg:['mega-nonveg','koshur','wazwan']}),
    // Prawns
    item('Prawns Kerala Fried',      'nonveg-appetizers','non-veg',{sub:'prawns'}),
    item('Prawns Spicy',             'nonveg-appetizers','non-veg',{sub:'prawns'}),
    item('Prawns Garlic',            'nonveg-appetizers','non-veg',{sub:'prawns'}),
    item('Prawns Chilly',            'nonveg-appetizers','non-veg',{sub:'prawns'}),
    item('Prawns Grilled',           'nonveg-appetizers','non-veg',{sub:'prawns'}),
    // Kaleji
    item('Kaleji Chilly',            'nonveg-appetizers','non-veg',{sub:'kaleji'}),
    item('Kaleji Tikka',             'nonveg-appetizers','non-veg',{sub:'kaleji'}),
    item('Kaleji Tawa',              'nonveg-appetizers','non-veg',{sub:'kaleji'}),
  ];

  /* ================================================================
     VEG MAIN COURSE
     ================================================================ */
  const vegMain = [
    // Damaloo / Potato
    item('Damaloo',                  'veg-main','veg',{pkg:['mega-veg','mini-veg','koshur','wazwan']}),
    item('Aloo-Do-Pyaza',            'veg-main','veg'),
    item('Alloo Gobi Dry',           'veg-main','veg'),
    // Paneer
    item('Paneer Yellow',            'veg-main','veg',{pkg:['mega-veg','mini-veg','wazwan']}),
    item('Paneer Red',               'veg-main','veg'),
    item('Paneer Shahi in Cream',    'veg-main','veg'),
    item('Paneer Shahi in Tomato',   'veg-main','veg',{pkg:['mega-veg','wazwan'],src:'Shahi Paneer'}),
    item('Paneer Pasanda',           'veg-main','veg'),
    item('Paneer Lababdar',          'veg-main','veg'),
    item('Paneer Butter Kali Mirch', 'veg-main','veg'),
    item('Paneer Do-Pyaza',          'veg-main','veg'),
    item('Paneer Mutter',            'veg-main','veg'),
    item('Paneer Makhani',           'veg-main','veg'),
    item('Paneer Butter Masala',     'veg-main','veg',{pkg:['mega-veg','mini-veg']}),
    item('Paneer Mattar Masala',     'veg-main','veg'),
    item('Paneer Kadai',             'veg-main','veg'),
    item('Paneer Lasooni Methi',     'veg-main','veg'),
    item('Paneer Methi',             'veg-main','veg'),
    item('Paneer Palak',             'veg-main','veg'),
    // Mushroom
    item('Mushroom Yakhni',          'veg-main','veg',{pkg:['mega-veg','wazwan']}),
    item('Mushroom Mutter',          'veg-main','veg'),
    item('Mushroom Tawa Masala',     'veg-main','veg'),
    item('Mushroom Palak',           'veg-main','veg'),
    item('Mushroom Curry',           'veg-main','veg'),
    item('Mushroom Do-Pyaza',        'veg-main','veg'),
    // Palak
    item('Palak Mutter with Baby Corn','veg-main','veg'),
    item('Palak Kofta',              'veg-main','veg'),
    item('Palak Dal',                'veg-main','veg'),
    item('Palak Nadroo',             'veg-main','veg'),
    item('Palak Mutter',             'veg-main','veg'),
    item('Palak Chana',              'veg-main','veg'),
    item('Palak Corn',               'veg-main','veg'),
    item('Palak Baby Corn',          'veg-main','veg'),
    // Nadroo / Lotus Stem
    item('Nadroo Yakhni',            'veg-main','veg',{pkg:['mega-veg','mini-veg','koshur','wazwan'],src:'Nadroo Yakhni / Al Yakhni'}),
    item('Nadroo Kofta',             'veg-main','veg'),
    item('Nadroo Monj Red',          'veg-main','veg',{src:'Monj Nadroo'}),
    item('Nadroo Monj White',        'veg-main','veg',{src:'Monj Nadroo'}),
    // Kadu / Gourd
    item('Kadu Yakhni',              'veg-main','veg',{pkg:['koshur','wazwan'],src:'Al Yakhni'}),
    // Dal
    item('Daal Rajmaash',            'veg-main','veg',{pkg:['mega-veg','mini-veg','koshur','wazwan'],src:'Rajmash'}),
    item('Daal Maharani',            'veg-main','veg'),
    item('Daal Chana Kasturi',       'veg-main','veg'),
    item('Daal Makhni',              'veg-main','veg',{pkg:['mega-veg','mini-veg']}),
    item('Daal Chana Masala',        'veg-main','veg'),
    item('Daal Yellow Tadka',        'veg-main','veg'),
    item('Daal Mash Madra',          'veg-main','veg'),
    item('Daal Rongi Masala',        'veg-main','veg'),
    item('Dal Mutter Masala',        'veg-main','veg'),
    item('Dal Mixed Fry',            'veg-main','veg'),
    // Vegetables
    item('Mixed Vegetables',         'veg-main','veg'),
    item('Khatte Bengan',            'veg-main','veg',{pkg:['mega-veg','mini-veg','koshur','wazwan']}),
    item('Kadai Phool',              'veg-main','veg',{src:'Kadai Phool / Masala Gobi'}),
    item('Masala Gobi',              'veg-main','veg',{src:'Kadai Phool / Masala Gobi'}),
    item('Malai Kofta',              'veg-main','veg'),
    item('Nilgiri Korma',            'veg-main','veg'),
    item('Vegetable Kolhapuri',      'veg-main','veg'),
    item('Vegetables Navratan Korma','veg-main','veg'),
    item('Shahi Methi Matter',       'veg-main','veg'),
    item('Vegetable Jhalfrezi',      'veg-main','veg'),
    item('Curry Pakora',             'veg-main','veg'),
    item('Bhindi Lehsuni',           'veg-main','veg'),
    item('Bhindi Masala',            'veg-main','veg'),
    item('Bhindi Kurkuri',           'veg-main','veg'),
    item('Dry Karela Curry',         'veg-main','veg'),
    item('Nutri Masala',             'veg-main','veg'),
    item('Nutri Curry',              'veg-main','veg'),
    // Kashmiri Greens
    item('Haakh Saag',               'veg-main','veg',{pkg:['koshur','wazwan']}),
    item('Dry Gobi',                 'veg-main','veg',{pkg:['wazwan']}),
  ];

  /* ================================================================
     NON-VEG MAIN COURSE
     ================================================================ */
  const nonVegMain = [
    // Mutton
    item('Mutton Rista',             'nonveg-main','non-veg',{sub:'mutton',pkg:['mega-nonveg','koshur','wazwan']}),
    item('Mutton Goshtaba',          'nonveg-main','non-veg',{sub:'mutton',pkg:['mega-nonveg','koshur','wazwan']}),
    item('Mutton Mirchi Korma',      'nonveg-main','non-veg',{sub:'mutton',pkg:['mega-nonveg','koshur','wazwan']}),
    item('Mutton Dhania Korma',      'nonveg-main','non-veg',{sub:'mutton',pkg:['mega-nonveg','koshur']}),
    item('Mutton Roganjosh',         'nonveg-main','non-veg',{sub:'mutton',pkg:['mega-nonveg','koshur','wazwan']}),
    item('Mutton Kaliya',            'nonveg-main','non-veg',{sub:'mutton',pkg:['mega-nonveg','koshur','wazwan'],src:'Mutton Kaliya/Yakhni'}),
    item('Mutton Yakhni',            'nonveg-main','non-veg',{sub:'mutton',pkg:['mega-nonveg','koshur','wazwan'],src:'Mutton Kaliya/Yakhni'}),
    item('Mutton Sabza',             'nonveg-main','non-veg',{sub:'mutton',pkg:['mega-nonveg']}),
    item('Mutton Handi',             'nonveg-main','non-veg',{sub:'mutton'}),
    item('Mutton Tawa Masala',       'nonveg-main','non-veg',{sub:'mutton'}),
    item('Mutton Rara',              'nonveg-main','non-veg',{sub:'mutton'}),
    item('Mutton Curry',             'nonveg-main','non-veg',{sub:'mutton'}),
    item('Mutton Keema',             'nonveg-main','non-veg',{sub:'mutton',pkg:['mega-nonveg','koshur','wazwan']}),
    item('Mutton Bhindiwala',        'nonveg-main','non-veg',{sub:'mutton'}),
    item('Mutton Khatta',            'nonveg-main','non-veg',{sub:'mutton'}),
    item('Methi Maaz',               'nonveg-main','non-veg',{sub:'mutton',pkg:['koshur']}),
    item('Khatti Kaleji',            'nonveg-main','non-veg',{sub:'kaleji',pkg:['koshur','wazwan']}),
    // Fish
    item('Prawns Gravy',             'nonveg-main','non-veg',{sub:'prawns'}),
    item('Fish Fry',                 'nonveg-main','non-veg',{sub:'fish'}),
    item('Fish Chilly',              'nonveg-main','non-veg',{sub:'fish',id:'fish-chilly-main'}),
    item('Fish Tomato',              'nonveg-main','non-veg',{sub:'fish'}),
    item('Fish Mooli',               'nonveg-main','non-veg',{sub:'fish',pkg:['wazwan'],src:'Fish-Mooli/Fish Nadroo'}),
    item('Fish Nadroo',              'nonveg-main','non-veg',{sub:'fish',pkg:['wazwan'],src:'Fish-Mooli/Fish Nadroo'}),
    // Chicken
    item('Chicken Sabza',            'nonveg-main','non-veg',{sub:'chicken',pkg:['mega-nonveg']}),
    item('Chicken Masala',           'nonveg-main','non-veg',{sub:'chicken',pkg:['mega-nonveg','koshur']}),
    item('Chicken Kadai',            'nonveg-main','non-veg',{sub:'chicken'}),
    item('Chicken Chilly Gravy',     'nonveg-main','non-veg',{sub:'chicken'}),
    item('Chicken Manchurian Gravy', 'nonveg-main','non-veg',{sub:'chicken'}),
    item('Chicken Takatak',          'nonveg-main','non-veg',{sub:'chicken'}),
    item('Chicken Butter Masala',    'nonveg-main','non-veg',{sub:'chicken',pkg:['mega-nonveg','koshur']}),
    item('Chicken Tawa Masala',      'nonveg-main','non-veg',{sub:'chicken'}),
    item('Chicken Yakhni',           'nonveg-main','non-veg',{sub:'chicken'}),
    item('Chicken Shawarma',         'nonveg-main','non-veg',{sub:'chicken'}),
    item('Chicken Desi Gravy',       'nonveg-main','non-veg',{sub:'chicken'}),
    item('Chicken Shahi Korma',      'nonveg-main','non-veg',{sub:'chicken'}),
    item('Chicken Thai Curry',       'nonveg-main','non-veg',{sub:'chicken'}),
    item('Fried Chicken',            'nonveg-main','non-veg',{sub:'chicken',pkg:['wazwan']}),
  ];

  /* ================================================================
     RICE & BIRYANI
     ================================================================ */
  const riceBiryani = [
    // Veg Rice
    item('Rice Plain',               'rice-biryani','veg',{pkg:['mega-veg','mini-veg','koshur','wazwan']}),
    item('Rice Zeera',               'rice-biryani','veg'),
    item('Kashmiri Namkeen Pulao',   'rice-biryani','veg',{pkg:['mega-veg','mini-veg','koshur','wazwan']}),
    item('Kashmiri Sweet Pulao',     'rice-biryani','veg',{pkg:['mega-veg','mini-veg','koshur','wazwan']}),
    item('Saffron Zeera Peas Pulao', 'rice-biryani','veg'),
    item('Saffron Pulao',            'rice-biryani','veg'),
    item('Tiranga Pulao',            'rice-biryani','veg'),
    item('Vegetable Yakhni Pulao',   'rice-biryani','veg'),
    item('Paneer Matter Biryani',    'rice-biryani','veg'),
    item('Korma Biryani',            'rice-biryani','veg'),
    item('Kabuli Chana Kofta Biryani','rice-biryani','veg'),
    item('Masala Veg. Biryani',      'rice-biryani','veg'),
    item('Hyderabadi Veg. Biryani',  'rice-biryani','veg'),
    item('Almond Biryani',           'rice-biryani','veg'),
    // Non-veg Rice
    item('Mutton Pulao',             'rice-biryani','non-veg',{sub:'mutton',pkg:['mega-nonveg','koshur','wazwan']}),
    item('Mutton Biryani',           'rice-biryani','non-veg',{sub:'mutton'}),
    item('Murg Hyderabadi Biryani',  'rice-biryani','non-veg',{sub:'chicken'}),
    item('Mutton Hyderabadi Biryani','rice-biryani','non-veg',{sub:'mutton'}),
    item('Keema Biryani',            'rice-biryani','non-veg',{sub:'mutton'}),
    item('Chicken Reshmi Biryani',   'rice-biryani','non-veg',{sub:'chicken'}),
    item('Egg Biryani',              'rice-biryani','non-veg',{sub:'egg'}),
    item('Fish Biryani',             'rice-biryani','non-veg',{sub:'fish'}),
    item('Prawns Biryani',           'rice-biryani','non-veg',{sub:'prawns'}),
  ];

  /* ================================================================
     BREADS / NAAN
     ================================================================ */
  const breads = [
    item('Plain Naan',               'breads','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur']}),
    item('Stuffed Naan',             'breads','veg'),
    item('Butter Naan',              'breads','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur']}),
    item('Onion Kulcha Naan',        'breads','veg'),
    item('Lacha Parantha',           'breads','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur']}),
    item('Garlic Naan',              'breads','veg'),
    item('Paneer Naan',              'breads','veg'),
    item('Pudina Naan',              'breads','veg'),
    item('Chilly Cheese Naan',       'breads','veg'),
    item('Nawabi Naan',              'breads','veg'),
    item('Laccha Naan',              'breads','veg'),
    item('Rajmash Kulcha',           'breads','veg',{pkg:['high-tea-veg']}),
    item('Keema Naan',               'breads','non-veg',{pkg:['high-tea-nonveg']}),
  ];

  /* ================================================================
     RAITA & CURD
     ================================================================ */
  const raita = [
    item('Mixed Fruit Raita',        'raita','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur']}),
    item('Boondi Raita',             'raita','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur']}),
    item('Kheera Raita',             'raita','veg'),
    item('Lauki Raita',              'raita','veg'),
    item('Mooli Raita',              'raita','veg',{pkg:['wazwan'],src:'Mooli Chutney'}),
    item('Pineapple Raita',          'raita','veg'),
    item('Mixed Vegetable Raita',    'raita','veg'),
    item('Palak Raita',              'raita','veg'),
    item('Capsicum Raita',           'raita','veg'),
    item('Bhindi Raita',             'raita','veg'),
    item('Kela Raita',               'raita','veg'),
    item('Onion Raita',              'raita','veg'),
    item('Tomato Raita',             'raita','veg'),
    item('Beet Root Raita',          'raita','veg'),
    item('Aloo Chat Raita',          'raita','veg'),
    item('Mango Raita',              'raita','veg'),
    item('Carrot Raita',             'raita','veg'),
    item('Makhana Raita',            'raita','veg'),
    item('Mint Raita',               'raita','veg'),
    item('Khati-Meethi Chatni',      'raita','veg'),
    item('Plain Curd',               'raita','veg'),
    item('Curd in Kulad Garnished with Saffron','raita','veg'),
  ];

  /* ================================================================
     SALAD STATION
     ================================================================ */
  const salads = [
    item('Leafy Green Salad',        'salads','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur']}),
    item('Beans Salad',              'salads','veg'),
    item('Dry Salads',               'salads','veg'),
    item('Anchaar',                  'salads','veg'),
    item('Papad',                    'salads','veg'),
    item('Nadroo and Alloo Churma',  'salads','veg'),
    item('Mirchi Pakora',            'salads','veg'),
    item('Mixed Fruit Salad',        'salads','veg'),
    item('Broccoli Salad',           'salads','veg'),
    item('Broccoli Pasta Salad',     'salads','veg'),
    item('Corn Salad',               'salads','veg'),
    item('Vinegar Onion',            'salads','veg'),
    item('Quinoa Chick Peas Salad',  'salads','veg'),
    item('Mixed Green Salad with Vinaigrette Dressing','salads','veg'),
    item('Moat Sprouts with Kachumar','salads','veg'),
    item('Quinoa Salad',             'salads','veg'),
    item('Cucumber Chat',            'salads','veg'),
    item('Lettuce Salad',            'salads','veg'),
    item('Mango Salsa',              'salads','veg'),
    item('Moat Sprouts Salad',       'salads','veg'),
    item('Chola Chat',               'salads','veg'),
    item('Pineapple Relish',         'salads','veg'),
    item('Basil Lemon Pasta',        'salads','veg'),
    item('Pasta Salad',              'salads','veg'),
    item('Sweet Corn and Mango Salad','salads','veg'),
    item('Chana Sprouts Salad',      'salads','veg'),
    item('Moong Sprouts Salad',      'salads','veg'),
    item('Russian Salad',            'salads','veg'),
    item('Corn Salsa',               'salads','veg'),
    item('Cucumber Potato Salad',    'salads','veg'),
    item('Fruit Skewers',            'salads','veg'),
    item('Fresh Green Salad',        'salads','veg'),
    item('Kimchi Salad',             'salads','veg'),
    item('Mexican Bean Salad',       'salads','veg'),
    item('Pineapple Hawaiian Salad', 'salads','veg'),
    item('Grilled Veggies Salad',    'salads','veg'),
  ];

  /* ================================================================
     LIVE COUNTERS
     ================================================================ */
  const liveCounters = [
    item('Dahi Bhalla',              'live-counters','veg'),
    item('Chat Papri',               'live-counters','veg'),
    item('Palak Patta Chat',         'live-counters','veg'),
    item('Malai Bhalla',             'live-counters','veg'),
    item('Paani Puri',               'live-counters','veg'),
    item('Moong Daal Chilla',        'live-counters','veg'),
    item('Vegetable Champ',          'live-counters','veg'),
    item('Pav Bhaji',                'live-counters','veg',{pkg:['high-tea-veg']}),
    item('Lacha Tokri',              'live-counters','veg'),
    item('Raj Kachori',              'live-counters','veg'),
    item('Idli Sambar Dosa',         'live-counters','veg'),
    item('Sada Dosa',                'live-counters','veg'),
    item('Masala Dosa',              'live-counters','veg'),
    item('Paneer Dosa',              'live-counters','veg'),
    item('Rava Dosa',                'live-counters','veg'),
    item('Onion Rava Dosa',          'live-counters','veg'),
    item('Bhelpuri',                 'live-counters','veg'),
    item('Saag Toda',                'live-counters','veg'),
    item('Kaladi Kulcha',            'live-counters','veg'),
    item('Tawa Sabzi',               'live-counters','veg'),
    item('Tokri Chat',               'live-counters','veg'),
    item('Paneer Rajmaash Kulcha',   'live-counters','veg'),
    item('Chole-Puri',               'live-counters','veg',{pkg:['high-tea-veg']}),
  ];

  /* ================================================================
     DESSERTS
     ================================================================ */
  const desserts = [
    item('Gulab Jamun',              'desserts','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur','high-tea']}),
    item('Jalebi',                   'desserts','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur']}),
    item('Jalebi Rabri',             'desserts','veg'),
    item('Jalebi Amritsari',         'desserts','veg'),
    item('Gajar Halwa',              'desserts','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur']}),
    item('Dal Halwa',                'desserts','veg'),
    item('Jafraani Halwa',           'desserts','veg'),
    item('Petha Halwa',              'desserts','veg'),
    item('Akhrot Halwa',             'desserts','veg'),
    item('Beet Root Halwa',          'desserts','veg'),
    item('Rasgulla',                 'desserts','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur','high-tea']}),
    item('Rasgulla Rabri',           'desserts','veg'),
    item('Rasmalai',                 'desserts','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur']}),
    item('Kesari Rasmalai',          'desserts','veg'),
    item('Angoori Rasmalai',         'desserts','veg'),
    item('Phirni',                   'desserts','veg',{pkg:['mega-veg','mega-nonveg','mini-veg','koshur','wazwan']}),
    item('Shifuta',                  'desserts','veg',{pkg:['wazwan']}),
    item('Fruit Custard',            'desserts','veg'),
    item('Chocolate Brownie',        'desserts','veg'),
    item('Cheese Cake',              'desserts','veg'),
    item('Shahi Tukda',              'desserts','veg'),
    item('Besan Laddoo',             'desserts','veg',{pkg:['high-tea']}),
    item('Motichur Laddoo',          'desserts','veg'),
    item('Kaju Burfi',               'desserts','veg'),
    item('Chocolate Burfi',          'desserts','veg'),
    item('Malai Burfi',              'desserts','veg',{pkg:['high-tea'],src:'Burfi'}),
    item('Badam Burfi',              'desserts','veg'),
    item('Moong Dal Burfi',          'desserts','veg'),
    item('Tiramisu',                 'desserts','veg'),
    item('Chocolate Mousse',         'desserts','veg'),
    item('Ice Cream',                'desserts','veg'),
    item('Kulfi',                    'desserts','veg'),
    item('Pista Kulfi',              'desserts','veg',{pkg:['high-tea']}),
  ];

  /* ================================================================
     WAZWAN — premium category (items may also appear in main categories)
     Rates listed are PDF reference rates up to 31.03.2025.
     DO NOT display as current website prices without fresh confirmation.
     ================================================================ */
  const wazwan = [
    // Non-veg
    item('Mutton Roganjosh',         'wazwan','non-veg',{sub:'mutton',id:'wazwan-mutton-roganjosh',qty:'1 KG', rate:1300,pkg:['wazwan']}),
    item('Mutton Kaliya / Yakhni',   'wazwan','non-veg',{sub:'mutton',id:'wazwan-mutton-kaliya-yakhni',qty:'1 KG', rate:1200,pkg:['wazwan']}),
    item('Mutton Keema',             'wazwan','non-veg',{sub:'mutton',id:'wazwan-mutton-keema',qty:'1 KG', rate:1100,pkg:['wazwan']}),
    item('Fried Chicken',            'wazwan','non-veg',{sub:'chicken',id:'wazwan-fried-chicken',pkg:['wazwan']}),
    item('Tabakmaaz',                'wazwan','non-veg',{sub:'mutton',pkg:['wazwan'],src:'Mutton Fried Ribs / Tabakmaaz'}),
    item('Mutton Rista',             'wazwan','non-veg',{sub:'mutton',id:'wazwan-mutton-rista',qty:'1 KG',rate:1400,pkg:['wazwan']}),
    item('Mutton Goshtaba',          'wazwan','non-veg',{sub:'mutton',id:'wazwan-mutton-goshtaba',qty:'1 KG',rate:1400,pkg:['wazwan']}),
    item('Mutton Mirchi Korma',      'wazwan','non-veg',{sub:'mutton',id:'wazwan-mutton-mirchi-korma',pkg:['wazwan']}),
    item('Fish Mooli',               'wazwan','non-veg',{sub:'fish',id:'wazwan-fish-mooli',src:'Fish-Mooli/Fish Nadroo',pkg:['wazwan']}),
    item('Fish Nadroo',              'wazwan','non-veg',{sub:'fish',id:'wazwan-fish-nadroo',src:'Fish-Mooli/Fish Nadroo',pkg:['wazwan']}),
    item('Khatti Kaleji',            'wazwan','non-veg',{sub:'kaleji',id:'wazwan-khatti-kaleji',pkg:['wazwan']}),
    item('Mutton Pulao',             'wazwan','non-veg',{sub:'mutton',id:'wazwan-mutton-pulao',qty:'1 KG',rate:900,pkg:['wazwan']}),
    item('Plain Rice',               'wazwan','veg',{id:'wazwan-plain-rice',pkg:['wazwan']}),
    // Vegetarian
    item('Damalloo',                 'wazwan','veg',{id:'wazwan-damalloo',pkg:['wazwan']}),
    item('Rajmash',                  'wazwan','veg',{id:'wazwan-rajmash',pkg:['wazwan']}),
    item('Shahi Paneer',             'wazwan','veg',{id:'wazwan-shahi-paneer',pkg:['wazwan']}),
    item('Paneer Yellow',            'wazwan','veg',{id:'wazwan-paneer-yellow',pkg:['wazwan']}),
    item('Nadroo Yakhni',            'wazwan','veg',{id:'wazwan-nadroo-yakhni',pkg:['wazwan']}),
    item('Al Yakhni',                'wazwan','veg',{id:'wazwan-al-yakhni',pkg:['wazwan']}),
    item('Mushroom Yakhni',          'wazwan','veg',{id:'wazwan-mushroom-yakhni',pkg:['wazwan']}),
    item('Dry Gobi',                 'wazwan','veg',{id:'wazwan-dry-gobi',pkg:['wazwan']}),
    item('Khatte Bengan',            'wazwan','veg',{id:'wazwan-khatte-bengan',pkg:['wazwan']}),
    item('Haakh Saag',               'wazwan','veg',{id:'wazwan-haakh-saag',pkg:['wazwan']}),
    item('Monj Nadroo',              'wazwan','veg',{id:'wazwan-monj-nadroo',pkg:['wazwan']}),
    item('Namkeen Pulao',            'wazwan','veg',{id:'wazwan-namkeen-pulao',pkg:['wazwan']}),
    item('Sweet Pulao',              'wazwan','veg',{id:'wazwan-sweet-pulao',pkg:['wazwan']}),
    item('Mooli Chutney',            'wazwan','veg',{id:'wazwan-mooli-chutney',pkg:['wazwan']}),
    // Sweets
    item('Phirni Cold',              'wazwan','veg',{id:'wazwan-phirni-cold',pkg:['wazwan']}),
    item('Shifuta',                  'wazwan','veg',{id:'wazwan-shifuta',pkg:['wazwan']}),
  ];

  /* ================================================================
     HIGH TEA
     ================================================================ */
  const highTea = [
    // Veg High Tea items
    item('Sandwich',                 'high-tea','veg',{pkg:['high-tea-veg']}),
    item('Grilled Sandwich',         'high-tea','veg',{pkg:['high-tea-veg']}),
    item('Samosa Cocktail',          'high-tea','veg',{pkg:['high-tea-veg']}),
    item('Paneer Pakora',            'high-tea','veg',{id:'ht-paneer-pakora',pkg:['high-tea-veg']}),
    item('Chilly Champ',             'high-tea','veg',{pkg:['high-tea-veg']}),
    item('Pav Bhaji',                'high-tea','veg',{id:'ht-pav-bhaji',pkg:['high-tea-veg']}),
    item('Chole-Puri',               'high-tea','veg',{id:'ht-chole-puri',pkg:['high-tea-veg']}),
    item('Rajmash Kulcha',           'high-tea','veg',{id:'ht-rajmash-kulcha',pkg:['high-tea-veg']}),
    item('Besan Laddoo',             'high-tea','veg',{id:'ht-besan-laddoo',pkg:['high-tea-veg']}),
    item('Burfi',                    'high-tea','veg',{pkg:['high-tea-veg']}),
    item('Rasgulla',                 'high-tea','veg',{id:'ht-rasgulla',pkg:['high-tea-veg']}),
    item('Pista Kulfi',              'high-tea','veg',{id:'ht-pista-kulfi',pkg:['high-tea-veg']}),
    item('Gulab Jamun',              'high-tea','veg',{id:'ht-gulab-jamun',pkg:['high-tea-veg']}),
    // Non-veg High Tea items
    item('Chicken Pakora',           'high-tea','non-veg',{id:'ht-chicken-pakora',sub:'chicken',pkg:['high-tea-nonveg']}),
    item('Grilled Chicken Sandwich', 'high-tea','non-veg',{sub:'chicken',pkg:['high-tea-nonveg']}),
    item('Chicken Wrap',             'high-tea','non-veg',{sub:'chicken',pkg:['high-tea-nonveg']}),
    item('Chicken Kabab',            'high-tea','non-veg',{id:'ht-chicken-kabab',sub:'chicken',pkg:['high-tea-nonveg']}),
    item('Chicken Burger',           'high-tea','non-veg',{sub:'chicken',pkg:['high-tea-nonveg']}),
    item('Keema Naan',               'high-tea','non-veg',{id:'ht-keema-naan',sub:'mutton',pkg:['high-tea-nonveg']}),
    item('Chicken Hakka Noodles',    'high-tea','non-veg',{sub:'chicken',pkg:['high-tea-nonveg']}),
    item('Chicken Fried Rice',       'high-tea','non-veg',{sub:'chicken',pkg:['high-tea-nonveg']}),
  ];

  /* ================================================================
     MASTER ITEMS LIST
     ================================================================ */
  const ALL_ITEMS = [
    ...beverages,
    ...soupsVeg,
    ...soupsNonVeg,
    ...vegAppetizers,
    ...nonVegAppetizers,
    ...vegMain,
    ...nonVegMain,
    ...riceBiryani,
    ...breads,
    ...raita,
    ...salads,
    ...liveCounters,
    ...desserts,
    ...wazwan,
    ...highTea,
  ];

  /* ================================================================
     PUBLIC API
     ================================================================ */
  return {
    CATEGORIES,
    ALL_ITEMS,
    getByCategory(cat) {
      if (cat === 'all') return ALL_ITEMS;
      return ALL_ITEMS.filter(i => i.category === cat);
    },
    getByPackage(pkgKey) {
      return ALL_ITEMS.filter(i => i.packages.includes(pkgKey));
    },
    getById(itemId) {
      return ALL_ITEMS.find(i => i.id === itemId) || null;
    },
    search(query) {
      const q = query.toLowerCase().trim();
      if (!q) return ALL_ITEMS;
      return ALL_ITEMS.filter(i =>
        i.name.toLowerCase().includes(q) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        (i.subcategory && i.subcategory.toLowerCase().includes(q))
      );
    },
  };

})();
