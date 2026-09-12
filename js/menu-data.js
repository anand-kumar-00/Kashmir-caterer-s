/* ================================================================
   KASHMIR CATERER'S (BBS) — COMPLETE MENU DATA
   Source: All 7 PDFs + full user-provided exhaustive item list
   ================================================================ */

window.KCMenuData = (function () {

  /* ── Packages ── */
  const PACKAGES = [
    {
      key: 'mega-veg', label: 'Mega Veg', pax: 'MIN. 300 PAX', type: 'veg',
      desc: 'Full vegetarian mega spread for large gatherings.',
      limits: { 'cold-beverages':4, 'hot-beverages':2, 'appetizers-veg':6, 'salad-raita':5, 'raita':2, 'rice-pulao':2, 'main-course-veg':5, 'live-counters':6, 'dessert':4, 'fruit-counter':null, 'assorted-bread':null }
    },
    {
      key: 'mega-nonveg', label: 'Mega Non-Veg', pax: 'MIN. 250 PAX', type: 'non-veg',
      desc: 'Non-vegetarian mega package with wide selection.',
      limits: { 'cold-beverages':4, 'hot-beverages':1, 'soup-nonveg':1, 'appetizers-veg':4, 'appetizers-nonveg':4, 'salad-raita':5, 'raita':2, 'rice-pulao':2, 'main-course-nonveg':4, 'main-course-veg':4, 'live-counters':4, 'dessert':4, 'fruit-counter':null, 'assorted-bread':null }
    },
    {
      key: 'mini-veg', label: 'Mini Veg', pax: 'MIN. 300 PAX', type: 'veg',
      desc: 'Compact vegetarian package for medium events.',
      limits: { 'cold-beverages':2, 'hot-beverages':1, 'appetizers-veg':4, 'salad-raita':3, 'raita':2, 'rice-pulao':2, 'main-course-veg':4, 'live-counters':4, 'dessert':3, 'fruit-counter':null, 'assorted-bread':null }
    },
    {
      key: 'koshur', label: 'Koshur Non-Veg', pax: 'MIN. 250 PAX', type: 'non-veg',
      desc: 'Authentic Kashmiri Wazwan-style non-vegetarian package.',
      limits: { 'arrival-drinks':null, 'appetizers-nonveg':null, 'appetizers-veg':null, 'buffet-nonveg':null, 'main-course-veg':null, 'salad-raita':null, 'assorted-bread':null, 'dessert':null }
    },
    {
      key: 'high-tea', label: 'High Tea', pax: 'MINIMUM 50 PAX', type: 'both',
      desc: 'Light High Tea service for corporate & small events.',
      limits: { 'soft-drink':2, 'hot-beverages':1, 'appetizers-veg':4, 'main-course-hightea':1, 'dessert':1 }
    },
    {
      key: 'wazwan', label: 'Wazwan Cloud Kitchen', pax: 'Per KG basis', type: 'non-veg',
      desc: 'Authentic Kashmiri Wazwan Cloud Kitchen — order by the kilogram.',
      limits: {}
    },
  ];

  /* ── Section Definitions ── */
  const SECTIONS = [
    { key:'cold-beverages',       label:'Cold Beverages',                  limit:'ANY FOUR',   pkg:['mega-veg','mini-veg','mega-nonveg'] },
    { key:'shakes-smoothies',     label:'Shakes, Smoothies & Punches',     limit:null,         pkg:['mega-veg','mini-veg','mega-nonveg'] },
    { key:'hot-beverages',        label:'Hot Beverages',                   limit:'ANY TWO',    pkg:['mega-veg','mini-veg','mega-nonveg','high-tea','koshur'] },
    { key:'soup-veg',             label:'Soup Station (Vegetarian)',       limit:'ANY ONE',    pkg:['mega-veg','mini-veg','mega-nonveg'] },
    { key:'soup-nonveg',          label:'Soup Station (Non-Vegetarian)',   limit:'ANY ONE',    pkg:['mega-nonveg'] },
    { key:'appetizers-veg',       label:'Appetizers / Starters (Veg.)',    limit:'ANY SIX',    pkg:['mega-veg','mini-veg','mega-nonveg','koshur','high-tea'] },
    { key:'appetizers-nonveg',    label:'Appetizers / Starters (Non-Veg.)',limit:'ANY FOUR',   pkg:['mega-nonveg','koshur'] },
    { key:'main-course-veg',      label:'Buffet / Main Course (Veg.)',     limit:'ANY FIVE',   pkg:['mega-veg','mini-veg','mega-nonveg','koshur'] },
    { key:'main-course-nonveg',   label:'Buffet / Main Course (Non-Veg.)',  limit:'ANY FOUR',   pkg:['mega-nonveg','koshur'] },
    { key:'main-course-hightea',  label:'Main Course',                     limit:'ANY ONE',    pkg:['high-tea'] },
    { key:'rice-pulao',           label:"Rice, Pulao's & Biryani's",       limit:'ANY TWO',    pkg:['mega-veg','mini-veg','mega-nonveg','koshur'] },
    { key:'assorted-bread',       label:'Assorted Breads (Tandoori Bahar)',limit:null,         pkg:['mega-veg','mini-veg','mega-nonveg','koshur'] },
    { key:'salad-raita',          label:'Salad Station & Raita',           limit:'ANY FIVE',   pkg:['mega-veg','mini-veg','mega-nonveg','koshur'] },
    { key:'raita',                label:'Raita & Accompaniments',          limit:'ANY TWO',    pkg:['mega-veg','mini-veg','mega-nonveg'] },
    { key:'live-counters',        label:'Live Counters & Chat Counters',   limit:'ANY SIX',    pkg:['mega-veg','mini-veg','mega-nonveg'] },
    { key:'live-counters-nonveg', label:'Live Counters (Non-Veg / Continental)', limit:null,  pkg:['mega-nonveg'] },
    { key:'dessert',              label:'Dessert Station & Sweets',        limit:'ANY FOUR',   pkg:['mega-veg','mini-veg','mega-nonveg','koshur','high-tea'] },
    { key:'fruit-counter',        label:'Fruit Counter',                   limit:null,         pkg:['mega-veg','mini-veg','mega-nonveg'] },
    { key:'specialty-counters',   label:'Specialty & Additional Counters', limit:null,         pkg:['mega-veg','mini-veg','mega-nonveg','koshur'] },
    /* Koshur fixed */
    { key:'arrival-drinks',       label:'As You Arrive',                   limit:null,         pkg:['koshur'] },
    { key:'buffet-nonveg',        label:'Buffet Station (Non-Veg.)',       limit:null,         pkg:['koshur'] },
    /* High Tea specific */
    { key:'soft-drink',           label:'Soft Drink',                      limit:'ANY TWO',    pkg:['high-tea'] },
    /* Wazwan */
    { key:'wazwan-nonveg',        label:'Non-Vegetarian (per kg)',         limit:null,         pkg:['wazwan'] },
    { key:'wazwan-veg',           label:'Vegetarian (per kg)',             limit:null,         pkg:['wazwan'] },
    { key:'wazwan-sweet',         label:'Sweets (per kg)',                 limit:null,         pkg:['wazwan'] },
  ];

  /* ── Items ── */
  const ITEMS = [

    /* ══════════════════════════════════════════
       COLD BEVERAGES
    ══════════════════════════════════════════ */
    { id:'cb-01', name:'Assorted Cold Drinks (Thums Up, Limca, Sprite, Fanta)', section:'cold-beverages', type:'veg' },
    { id:'cb-02', name:'Assorted Juices — Real/Tropicana (Guava, Pineapple, Mixed Fruit, Litchi, Mango, Apple, Orange, Mosambi, Grapes, Cranberry, Pomegranate, Peach, Sugar Free)', section:'cold-beverages', type:'veg' },
    { id:'cb-03', name:'Fresh Lemon Soda / Fresh Lime Soda', section:'cold-beverages', type:'veg' },
    { id:'cb-04', name:'Mineral Water', section:'cold-beverages', type:'veg' },
    { id:'cb-05', name:'Virgin Pina Coladas', section:'cold-beverages', type:'veg' },
    { id:'cb-06', name:'Blue Lagoon', section:'cold-beverages', type:'veg' },
    { id:'cb-07', name:'Virgin Margarita', section:'cold-beverages', type:'veg' },
    { id:'cb-08', name:'Virgin Mojito', section:'cold-beverages', type:'veg' },
    { id:'cb-09', name:'Shirley Temple', section:'cold-beverages', type:'veg' },
    { id:'cb-10', name:'Non-Alcoholic Sangria', section:'cold-beverages', type:'veg' },
    { id:'cb-11', name:'Virgin Strawberry', section:'cold-beverages', type:'veg' },
    { id:'cb-12', name:'Virgin Cosmopolitan', section:'cold-beverages', type:'veg' },
    { id:'cb-13', name:'Virgin Mary', section:'cold-beverages', type:'veg' },
    { id:'cb-14', name:'Water Melon Lime', section:'cold-beverages', type:'veg' },
    { id:'cb-15', name:'Jal Jeera', section:'cold-beverages', type:'veg' },
    { id:'cb-16', name:'Aam Ka Panna', section:'cold-beverages', type:'veg' },

    /* ══════════════════════════════════════════
       SHAKES, SMOOTHIES & PUNCHES
    ══════════════════════════════════════════ */
    { id:'ss-01', name:'Strawberry Shake / Strawberry Smoothie', section:'shakes-smoothies', type:'veg' },
    { id:'ss-02', name:'Pineapple Smoothie', section:'shakes-smoothies', type:'veg' },
    { id:'ss-03', name:'Orange Smoothie', section:'shakes-smoothies', type:'veg' },
    { id:'ss-04', name:'Banana Smoothie', section:'shakes-smoothies', type:'veg' },
    { id:'ss-05', name:'Blue Berry Smoothie', section:'shakes-smoothies', type:'veg' },
    { id:'ss-06', name:'Perfect Berry Smoothie', section:'shakes-smoothies', type:'veg' },
    { id:'ss-07', name:'Mango Smoothie', section:'shakes-smoothies', type:'veg' },

    /* ══════════════════════════════════════════
       HOT BEVERAGES
    ══════════════════════════════════════════ */
    { id:'hb-01', name:'Kesar Qehwa / Saffron Qehwa (With & Without Sugar)', section:'hot-beverages', type:'veg' },
    { id:'hb-02', name:'Lipton Tea (Regular) / Masala Tea / Green Tea / Lemon Tea / Namkeen Tea', section:'hot-beverages', type:'veg' },
    { id:'hb-03', name:'Coffee (Regular / Hot / Cold / Latte / Cappuccino / Espresso / Mocha)', section:'hot-beverages', type:'veg' },

    /* ══════════════════════════════════════════
       SOUP STATION — VEGETARIAN
    ══════════════════════════════════════════ */
    { id:'sv-01', name:'Cream of Tomato Soup', section:'soup-veg', type:'veg' },
    { id:'sv-02', name:'Hot n Sour Soup', section:'soup-veg', type:'veg' },
    { id:'sv-03', name:'Veg. Telumein Soup', section:'soup-veg', type:'veg' },
    { id:'sv-04', name:'Veg. Soup', section:'soup-veg', type:'veg' },
    { id:'sv-05', name:'Cream of Mushroom Soup', section:'soup-veg', type:'veg' },
    { id:'sv-06', name:'Almond Soup', section:'soup-veg', type:'veg' },
    { id:'sv-07', name:'Lemon Coriander Soup', section:'soup-veg', type:'veg' },
    { id:'sv-08', name:'Sweet Corn Soup', section:'soup-veg', type:'veg' },
    { id:'sv-09', name:'Man-chow Soup', section:'soup-veg', type:'veg' },
    { id:'sv-10', name:'Vegetable Thupka', section:'soup-veg', type:'veg' },
    { id:'sv-11', name:'Cream of Vegetable Soup', section:'soup-veg', type:'veg' },
    { id:'sv-12', name:'Tomato Basil Soup', section:'soup-veg', type:'veg' },
    { id:'sv-13', name:'Tomato Dhania Shorba', section:'soup-veg', type:'veg' },

    /* ══════════════════════════════════════════
       SOUP STATION — NON-VEGETARIAN
    ══════════════════════════════════════════ */
    { id:'sn-01', name:'Chicken Coriander Soup', section:'soup-nonveg', type:'non-veg' },
    { id:'sn-02', name:'Chicken Shorba', section:'soup-nonveg', type:'non-veg' },
    { id:'sn-03', name:'Mutton Shorba', section:'soup-nonveg', type:'non-veg' },
    { id:'sn-04', name:'Chicken Man-chow Soup', section:'soup-nonveg', type:'non-veg' },
    { id:'sn-05', name:'Chicken Sweet Corn Soup', section:'soup-nonveg', type:'non-veg' },
    { id:'sn-06', name:'Sea Food Soup', section:'soup-nonveg', type:'non-veg' },
    { id:'sn-07', name:'Chicken Thupka', section:'soup-nonveg', type:'non-veg' },
    { id:'sn-08', name:'Smoked Sausage Soup', section:'soup-nonveg', type:'non-veg' },

    /* ══════════════════════════════════════════
       APPETIZERS / STARTERS — VEGETARIAN
    ══════════════════════════════════════════ */
    { id:'av-01', name:'Paneer Haryali Tikka / Achari Paneer Tikka / Paneer Tikka (Regular / Irani / Tawa / Seek / Tawe)', section:'appetizers-veg', type:'veg' },
    { id:'av-02', name:'Malai Paneer Tikka / Paneer Satay / Zeera Paneer / Chilly Paneer', section:'appetizers-veg', type:'veg' },
    { id:'av-03', name:'Paneer Manchurian / Paneer Garlic / Paneer Popcorn / Paneer Cutlets / Paneer Pakora / Paneer Pakora Stuffed', section:'appetizers-veg', type:'veg' },
    { id:'av-04', name:'Paneer Rolls / Paneer Wrap / Cheese Roll / Cigar Roll', section:'appetizers-veg', type:'veg' },
    { id:'av-05', name:'Cheese Balls / Potato Balls', section:'appetizers-veg', type:'veg' },
    { id:'av-06', name:'Afghani Champ Tikka / Chilly Champ / Achari Champ Tikka / Champ Masala Tikka', section:'appetizers-veg', type:'veg' },
    { id:'av-07', name:'Spring Roll / Kathi Roll / Corn Rolls / Mint Rolls / Till Roll', section:'appetizers-veg', type:'veg' },
    { id:'av-08', name:'Manchurian Balls / Crispy Veg.', section:'appetizers-veg', type:'veg' },
    { id:'av-09', name:'Crunchy Mushroom / Tandoori Mushroom / Mushroom Button / Mushroom Masala Tikka / Mushroom Chilly / Mushroom Garlic / Mushroom Creamy Butter Garlic / Mushroom Double-Decker / Mushroom Crispy / Stuffed Mushroom / Mushroom Satay / Mushroom Tikki / Mushroom Cutlet', section:'appetizers-veg', type:'veg' },
    { id:'av-10', name:'Honey Chilly Lotus Stem / Honey Chilly Potato', section:'appetizers-veg', type:'veg' },
    { id:'av-11', name:'Hara Bhara Kabab / Methi Tikki / Adrak Methi Tikki / Veg. Shami Kabab', section:'appetizers-veg', type:'veg' },
    { id:'av-12', name:'Potato Rolls / Finger Chips / French Fries / Vegetable Bullets / Vegetable Cutlets / Vegetable Gold Coin', section:'appetizers-veg', type:'veg' },
    { id:'av-13', name:'Golden Fried Baby Corn / Steamed Momos / Fried Momos', section:'appetizers-veg', type:'veg' },
    { id:'av-14', name:'Samosa Mathi / Cocktail Samosa / Mixed Veg. Pakora / Gobi Pakora', section:'appetizers-veg', type:'veg' },
    { id:'av-15', name:'Sandwich / Grilled Sandwich', section:'appetizers-veg', type:'veg' },

    /* ══════════════════════════════════════════
       APPETIZERS / STARTERS — NON-VEGETARIAN
    ══════════════════════════════════════════ */
    { id:'an-01', name:'Fish Fingers / Fish Zeera / Fish Amritsari / Fish Malai Tikka / Fish Pudina Tikka / Fish Achari Tikka / Fish Creamy Tikka / Fish Satay / Fish Lemon / Fish Chilly (Mali / Basa / Singara / Salmon / Surmai / Sole)', section:'appetizers-nonveg', type:'non-veg' },
    { id:'an-02', name:'Chicken Masala Tikka / Chicken Afghani Tikka / Chicken Malai Tikka / Chicken Pudina Tikka / Chicken Tikka with Kali Mirch / Chicken Achari Tikka', section:'appetizers-nonveg', type:'non-veg' },
    { id:'an-03', name:'Chicken Manchurian / Chicken Zeera / Chicken Pakora / Chicken Tangri Kabab / Chicken Reshmi Kabab / Chicken Salami / Chicken Sausages / Chicken Ginger-Garlic / Chicken Kabab / Chicken Roasted with Bones / Chicken Chilly / Chicken Satay', section:'appetizers-nonveg', type:'non-veg' },
    { id:'an-04', name:'Chicken Momos Steam / Chicken Momos Fried / Drums of Heaven (Chicken Lollipop) / Chicken Wrap / Chicken Burger', section:'appetizers-nonveg', type:'non-veg' },
    { id:'an-05', name:'Mutton Seekh Kabab / Mutton Shami Kabab / Mutton Boti Kabab / Mutton Tikka / Mutton Tandoori with Bones / Mutton Cutlet / Mutton Balls / Mutton Chilly Cutlets / Mutton Momos Steam / Mutton Momos Fried / Mutton Chilly Balls / Mutton Fried Ribs (Tabakmaaz) / Mutton Kanti', section:'appetizers-nonveg', type:'non-veg' },
    { id:'an-06', name:'Prawns Kerala Fried / Prawns Spicy / Prawns Garlic / Prawns Chilly / Prawns Grilled', section:'appetizers-nonveg', type:'non-veg' },
    { id:'an-07', name:'Chilly Kaleji / Kaleji Tikka / Kaleji Tawa', section:'appetizers-nonveg', type:'non-veg' },

    /* ══════════════════════════════════════════
       BUFFET / MAIN COURSE — VEGETARIAN
    ══════════════════════════════════════════ */
    { id:'mv-01', name:'Damalloo', section:'main-course-veg', type:'veg' },
    { id:'mv-02', name:'Rajmash / Daal Rajmash', section:'main-course-veg', type:'veg' },
    { id:'mv-03', name:'Shahi Paneer / Paneer Lababdar / Kadai Paneer / Paneer Yellow (Lidir Chaman) / Paneer Red (Lal Chaman) / Paneer Shahi in Cream / Paneer Shahi in Tomato / Paneer Pasanda / Paneer Butter Kali Mirch / Paneer Do-Pyaza / Paneer Mutter / Paneer Makhani / Paneer Butter Masala / Paneer Mattar Masala / Paneer Lasooni Methi / Paneer Methi / Paneer Palak', section:'main-course-veg', type:'veg' },
    { id:'mv-04', name:'Daal Makhni / Daal Tadka (Desi Style) / Daal Maharani / Daal Chana Kasturi / Daal Chana Masala / Daal Yellow Tadka / Daal Mash Madra / Daal Rongi Masala / Dal Mutter Masala / Dal Mixed Fry', section:'main-course-veg', type:'veg' },
    { id:'mv-05', name:'Palak-Mushroom / Mushroom Do-Pyaza / Mushroom Yakhni / Al Yakhni / Nadroo Yakhni / Mushroom Mutter / Mushroom Tawa Masala / Mushroom Palak / Mushroom Curry', section:'main-course-veg', type:'veg' },
    { id:'mv-06', name:'Palak Mutter with Baby Corn / Palak Kofta / Palak Dal / Palak Nadroo / Palak Mutter / Palak Chana / Palak Corn / Palak Baby Corn / Mutter Palak / Mutter Corn', section:'main-course-veg', type:'veg' },
    { id:'mv-07', name:'Nadroo Kofta / Nadroo Monj Red / Nadroo Monj White / Kadu Yakhni / Monj Nadroo', section:'main-course-veg', type:'veg' },
    { id:'mv-08', name:'Veg. Jalfrezi / Tawa Vegetables / Bhindi Masala / Kurkuri Bhindi / Bhindi Lehsuni / Curry Pakora', section:'main-course-veg', type:'veg' },
    { id:'mv-09', name:'Mixed Vegetables / Khatte Bengan / Kadai Phool (Dry) / Masala Gobi / Malai Kofta / Nilgiri Korma / Vegetable Kolhapuri / Vegetables Navratan Korma / Alloo Gobi Dry / Shahi Methi Matter / Dry Karela Curry / Aloo-Do-Pyaza / Nutri Masala / Nutri Curry / Dry Gobi / Haakh Saag', section:'main-course-veg', type:'veg' },

    /* ══════════════════════════════════════════
       BUFFET / MAIN COURSE — NON-VEGETARIAN
    ══════════════════════════════════════════ */
    { id:'mn-01', name:'Mutton Roganjosh', section:'main-course-nonveg', type:'non-veg' },
    { id:'mn-02', name:'Mutton Kaliya / Mutton Yakhni / Mutton Sabza', section:'main-course-nonveg', type:'non-veg' },
    { id:'mn-03', name:'Mutton Keema (Mach) / Round Shaped', section:'main-course-nonveg', type:'non-veg' },
    { id:'mn-04', name:'Tabak Maaz (Fried Ribs)', section:'main-course-nonveg', type:'non-veg' },
    { id:'mn-05', name:'Mutton Rista / Mutton Goshtaba / Mutton Mirchi Korma / Mutton Dhania Korma / Mutton Handi / Mutton Tawa Masala / Mutton Rara / Mutton Curry / Mutton Bhindiwala / Mutton Khatta / Methi Maaz / Khatti Kaleji', section:'main-course-nonveg', type:'non-veg' },
    { id:'mn-06', name:'Fried Chicken (Leg & Chest) / Butter Chicken Masala / Kolhapuri Chicken / Chicken Sabza / Chicken Masala / Chicken Kadai / Chicken Chilly Gravy / Chicken Manchurian Gravy / Chicken Takatak / Chicken Tawa Masala / Chicken Yakhni / Chicken Shawarma / Chicken Desi Gravy / Chicken Shahi Korma / Chicken Thai Curry (Red/Green)', section:'main-course-nonveg', type:'non-veg' },
    { id:'mn-07', name:'Fish Fry / Fish Curry (Boneless) / Tomato Fish / Chilly Fish / Fish-Mooli / Fish Nadroo (Mali / Basa / Singara / Salmon / Surmai / Sole / Rahu)', section:'main-course-nonveg', type:'non-veg' },
    { id:'mn-08', name:'Prawns Gravy (Prawns Masala)', section:'main-course-nonveg', type:'non-veg' },
    { id:'mn-09', name:'Keema Naan / Chicken Hakka Noodles / Chicken Fried Rice', section:'main-course-nonveg', type:'non-veg' },

    /* High Tea Main Course */
    { id:'ht-mc-01', name:'Pav Bhaji', section:'main-course-hightea', type:'veg' },
    { id:'ht-mc-02', name:'Chole Puri', section:'main-course-hightea', type:'veg' },
    { id:'ht-mc-03', name:'Rajmash Kulcha', section:'main-course-hightea', type:'veg' },
    { id:'ht-mc-04', name:'Keema Naan', section:'main-course-hightea', type:'non-veg' },
    { id:'ht-mc-05', name:'Chicken Hakka Noodles', section:'main-course-hightea', type:'non-veg' },
    { id:'ht-mc-06', name:'Chicken Fried Rice', section:'main-course-hightea', type:'non-veg' },

    /* ══════════════════════════════════════════
       RICE, PULAO'S & BIRYANI'S
    ══════════════════════════════════════════ */
    { id:'rp-01', name:'Plain Rice / Zeera Rice', section:'rice-pulao', type:'veg' },
    { id:'rp-02', name:'Kashmiri Pulao (Namkeen / Sweet) / Saffron Zeera Peas Pulao / Saffron Pulao / Tiranga Pulao / Vegetable Yakhni Pulao', section:'rice-pulao', type:'veg' },
    { id:'rp-03', name:'Veg. Fried Rice / Hyderabadi Biryani (Veg.) / Paneer Matter Biryani / Korma Biryani / Kabuli Chana Kofta Biryani / Masala Veg. Biryani / Almond Biryani', section:'rice-pulao', type:'veg' },
    { id:'rp-04', name:'Mutton Pulao / Mutton Biryani / Murg Hyderabadi Biryani / Mutton Hyderabadi Biryani / Keema Biryani / Chicken Reshmi Biryani / Egg Biryani / Fish Biryani / Prawns Biryani', section:'rice-pulao', type:'non-veg' },

    /* ══════════════════════════════════════════
       ASSORTED BREADS — TANDOORI BAHAR
    ══════════════════════════════════════════ */
    { id:'br-01', name:'Plain Naan / Butter Naan / Laccha Naan / Stuffed Naan / Onion Kulcha Naan / Garlic Naan / Paneer Naan / Pudina Naan / Chilly Cheese Naan / Nawabi Naan / Amritsari Naan / Aloo Mutter Naan / Coriander Naan / Gobi Naan / Peshawari Naan / Garlic Methi Naan / Roghni Naan', section:'assorted-bread', type:'veg' },
    { id:'br-02', name:'Keema Naan / Egg Naan', section:'assorted-bread', type:'non-veg' },
    { id:'br-03', name:'Romali Roti / Tandoori Roti / Tawa Roti / Missi Roti', section:'assorted-bread', type:'veg' },
    { id:'br-04', name:'Papad / Pickles / Chutneys / Saunf Supari', section:'assorted-bread', type:'veg' },

    /* ══════════════════════════════════════════
       SALAD STATION
    ══════════════════════════════════════════ */
    { id:'sl-01', name:'Fresh Green Salad / Leafy Green Salad', section:'salad-raita', type:'veg' },
    { id:'sl-02', name:'Dry Salads (Pasta, Macaroni, Rongi Chat, Peanut / Moongfali Chat, Aloo Chat)', section:'salad-raita', type:'veg' },
    { id:'sl-03', name:'Sprout Salad / Russian Fruit Salad / Beans Salad / Onion Vinegar / Veggie Pasta Salad', section:'salad-raita', type:'veg' },
    { id:'sl-04', name:'Grilled Vegetable Salad / Broccoli Salad / Corn Salad', section:'salad-raita', type:'veg' },
    { id:'sl-05', name:'Quinoa Chick Peas Salad / Quinoa Salad / Cucumber Chat / Lettuce Salad / Mango Salsa / Pineapple Relish', section:'salad-raita', type:'veg' },
    { id:'sl-06', name:'Sweet Corn and Mango Salad / Kimchi Salad / Mexican Bean Salad / Pineapple Hawaiian Salad', section:'salad-raita', type:'veg' },
    { id:'sl-07', name:'Nadroo and Alloo Churma / Mirchi Pakora', section:'salad-raita', type:'veg' },
    { id:'sl-08', name:'Anchaar (Kadam, Mixed, Kutra, Onion, Carrot)', section:'salad-raita', type:'veg' },

    /* ══════════════════════════════════════════
       RAITA & ACCOMPANIMENTS
    ══════════════════════════════════════════ */
    { id:'rt-01', name:'Mooli Raita', section:'raita', type:'veg' },
    { id:'rt-02', name:'Pineapple Raita', section:'raita', type:'veg' },
    { id:'rt-03', name:'Mix Veg. Raita', section:'raita', type:'veg' },
    { id:'rt-04', name:'Kheera Raita', section:'raita', type:'veg' },
    { id:'rt-05', name:'Fruit Cocktail Raita', section:'raita', type:'veg' },
    { id:'rt-06', name:'Lauki Raita', section:'raita', type:'veg' },
    { id:'rt-07', name:'Boondi Raita', section:'raita', type:'veg' },
    { id:'rt-08', name:'Palak Raita / Capsicum Raita / Bhindi Raita / Kela Raita', section:'raita', type:'veg' },
    { id:'rt-09', name:'Onion Raita / Tomato Raita / Beet Root Raita / Aloo Chat Raita / Mango Raita / Carrot Raita / Makhana Raita / Mint Raita', section:'raita', type:'veg' },
    { id:'rt-10', name:'Plain Curd / Curd in Kulhad Garnished with Saffron / Khati-Meethi Chatni / Mooli Chutney', section:'raita', type:'veg' },

    /* ══════════════════════════════════════════
       LIVE COUNTERS & CHAT COUNTERS (VEG & CONTINENTAL)
    ══════════════════════════════════════════ */
    { id:'lc-01', name:'Alloo Tikki (Desi Ghee Wali)', section:'live-counters', type:'veg' },
    { id:'lc-02', name:'Dahi Bhalla-Chat Papri / Palak Patta Chat / Malai Bhalla / Dahi Kalami Ware / Raj Kachori / Tokri Chat / Lacha Tokri', section:'live-counters', type:'veg' },
    { id:'lc-03', name:'Hakka Noodles / Fried Rice Manchurian / Veg. Chop Suey', section:'live-counters', type:'veg' },
    { id:'lc-04', name:'Rajmash Kulcha / Kaladi Kulcha / Paneer Rajmaash Kulcha', section:'live-counters', type:'veg' },
    { id:'lc-05', name:'Pasta Red n White / Veg. Pasta / Mix Pasta / Basil Lemon Pasta', section:'live-counters', type:'veg' },
    { id:'lc-06', name:'Dosa Masala / Sada Dosa / Paneer Dosa / Rava Dosa / Onion Rava Dosa / Idli Sambar', section:'live-counters', type:'veg' },
    { id:'lc-07', name:'Paani-Puri / Bhelpuri', section:'live-counters', type:'veg' },
    { id:'lc-08', name:'Mushroom & Broccoli in Paprika Sauce / Baked Mushroom & Spinach / Buttered Potatoes', section:'live-counters', type:'veg' },
    { id:'lc-09', name:'Moong Daal Chilla / Vegetable Champ / Pav Bhaji / Shaker Garin Chat / Saag Toda / Tawa Sabzi', section:'live-counters', type:'veg' },
    { id:'lc-10', name:'Veg. Au-Gratin / Butter Parsley / Pizza (Self Made / Dominos / Pizza Hut) / Thai Ball / Manchurian Fried Rice / Chilly Cheese / Manchurian with Gravy', section:'live-counters', type:'veg' },

    /* LIVE COUNTERS — NON-VEG / CONTINENTAL */
    { id:'ln-01', name:'Brain Curry / Kharroda Fry Masala / Gurda Kapoora on Tawa / Mutton Champ Grilled / Mutton Champ Tawa / Mutton Tikka with Romali Roti / Mutton Lamb Bar-be-Que / Mutton Momos Steamed & Fried', section:'live-counters-nonveg', type:'non-veg' },
    { id:'ln-02', name:'Chicken Methi on Tawa / Chicken Lemon / Chicken Chowmein / Chicken Grilled / Chicken Momos Steamed & Fried / Chicken Chilly Garlic (Wings) / Chicken Bar-be-Que', section:'live-counters-nonveg', type:'non-veg' },
    { id:'ln-03', name:'Grilled Fish / Fried Fish / Fish Batter / Eggy Bread', section:'live-counters-nonveg', type:'non-veg' },

    /* ══════════════════════════════════════════
       DESSERT STATION & SWEETS
    ══════════════════════════════════════════ */
    { id:'ds-01', name:'Gulab Jamun (Hot / Plain / Stuffed / Kesari)', section:'dessert', type:'veg' },
    { id:'ds-02', name:'Jalebi Rabri / Jalebi Plain / Jalebi Amritsari / Malpua / Shahi Tukda', section:'dessert', type:'veg' },
    { id:'ds-03', name:'Daal Halwa / Gajar Halwa (Seasonal) / Beet Root Halwa / Jafraani Halwa / Petha Halwa / Akhrot Halwa / Beet Root aur Anjeer ka Halwa', section:'dessert', type:'veg' },
    { id:'ds-04', name:'Chocolate Brownie / Chocolate Pudding / Vanilla Pudding / Black Forest Pudding / Fruit Custard / Cheese Cake / Tiramisu / Chocolate Mousse', section:'dessert', type:'veg' },
    { id:'ds-05', name:'Ice-Cream (Vanilla, Butter Scotch, Dry Fruits, Chocolate, Mango, Strawberry) / Pista Kulfi / Desi Matka Kulfi / Kesar Pista Kulfi / Kesar Badam Kulfi / Fruits and Nuts Kulfi / Kasatta', section:'dessert', type:'veg' },
    { id:'ds-06', name:'Phirni (Cold) / Rasmalai (Kesari / Angoori) / Rasgulli Rabri / Shifuta', section:'dessert', type:'veg' },
    { id:'ds-07', name:'Besan Laddoo / Motichur Laddoo / Kaju Burfi / Chocolate Burfi / Malai Burfi / Badam Burfi / Moong Dal Burfi / Rasgulla / Spongy Rasgulla / Shana Murgi', section:'dessert', type:'veg' },

    /* ══════════════════════════════════════════
       FRUIT COUNTER
    ══════════════════════════════════════════ */
    { id:'fr-01', name:'Indian Seasonal Fruits (5 to 6 types: Apple, Orange, Banana, Guava, Watermelon, Muskmelon, Pomegranate, Grapes, Papaya)', section:'fruit-counter', type:'veg' },
    { id:'fr-02', name:'Imported Fruits (Grapes, Pear, Kiwi, Dragon Fruit, Plum, Dates & Tamarind, Avocados, Strawberry)', section:'fruit-counter', type:'veg' },

    /* ══════════════════════════════════════════
       SPECIALTY & ADDITIONAL COUNTERS
    ══════════════════════════════════════════ */
    { id:'sc-01', name:'Yummy Paan Counter: Banarsi Patta Sada Paan / Masala Paan / Black Forest Sweet Paan / Blue Berry Paan / Choco Almond Sweet Paan / Choco Cashew Sweet Paan / Kesar Paan / 420 Paan / Tobacco Paan', section:'specialty-counters', type:'veg' },
    { id:'sc-02', name:'Children Stall: Chocolate Fountain Cotton / Cotton Candy / Magician / Pop Corn / Mickey Mouse / Jokers / Games', section:'specialty-counters', type:'veg' },
    { id:'sc-03', name:'Cakes & Puddings: Pastries (Chocolate, Butter Scotch, Black Forest, Mix Fruits) / Cakes (Strawberry, Lemon, Butter Scotch, Mango Basil, Nutella Cheese, Blueberry Cheese, Sponge, Biscuit)', section:'specialty-counters', type:'veg' },
    { id:'sc-04', name:'Cocktail Counter: Tumblers, Soda, Decanters, Ice-Cubes, Bar Tenders, Flavoured Hookah', section:'specialty-counters', type:'veg' },
    { id:'sc-05', name:'Chai Tapri: Lipton Tea / Lemon Tea / Green Tea / Masala Tea / Hot Coffee / Cold Coffee / Saffron Qehwa / Namkeen Tea / Daal-Mongra / Mixed Pakora / Samosa Mathi / Kulcha / Shirmal / Kachori / Patty / Hot Dog / Biscuits / Sweets', section:'specialty-counters', type:'veg' },
    { id:'sc-06', name:'Rest Days / Bed Tea with Fibre Biscuits / Nimboo Pani / Cholley Bhature / Poori Bhaji / Paranthas (Aloo, Methi, Mooli, Gobhi, Paneer) / Kashmiri Kandroo Roti / Luchi Qahwa / Halwa Poori', section:'specialty-counters', type:'veg' },
    { id:'sc-07', name:'Yagnopavit / Sant Menu: Nadroo Monj / Ambal / Meethe Chawal / Daal / Damalloo / Khatte Bengan / Poori / Shirmal / Kadai Milk', section:'specialty-counters', type:'veg' },

    /* ══════════════════════════════════════════
       KOSHUR — AS YOU ARRIVE
    ══════════════════════════════════════════ */
    { id:'arr-01', name:'Mineral Water', section:'arrival-drinks', type:'veg' },
    { id:'arr-02', name:'Assorted Cold Drinks (Thums Up, Limca, Sprite, Fanta)', section:'arrival-drinks', type:'veg' },
    { id:'arr-03', name:'Assorted Juices (Guava, Pineapple, Mixed, Litchi)', section:'arrival-drinks', type:'veg' },
    { id:'arr-04', name:'Veg. Soup', section:'arrival-drinks', type:'veg' },
    { id:'arr-05', name:'Kesar Qehwa', section:'arrival-drinks', type:'veg' },

    /* KOSHUR — BUFFET NON-VEG */
    { id:'kn-01', name:'Mutton Roganjosh', section:'buffet-nonveg', type:'non-veg' },
    { id:'kn-02', name:'Mutton Yakhni / Kaliya / Sabza', section:'buffet-nonveg', type:'non-veg' },
    { id:'kn-03', name:'Mutton Keema (Mach) / Round Shaped', section:'buffet-nonveg', type:'non-veg' },
    { id:'kn-04', name:'Fried Ribs (Tabak Maaz)', section:'buffet-nonveg', type:'non-veg' },
    { id:'kn-05', name:'Fried Chicken (Leg & Chest)', section:'buffet-nonveg', type:'non-veg' },
    { id:'kn-06', name:'Mutton Pulao', section:'buffet-nonveg', type:'non-veg' },

    /* HIGH TEA — SOFT DRINK */
    { id:'ht-sd-01', name:'Cold Drinks', section:'soft-drink', type:'veg' },
    { id:'ht-sd-02', name:'Fresh Lemon Soda', section:'soft-drink', type:'veg' },
    { id:'ht-sd-03', name:'Kesar Qehwa', section:'soft-drink', type:'veg' },

    /* ══════════════════════════════════════════
       WAZWAN CLOUD KITCHEN
    ══════════════════════════════════════════ */
    { id:'waz-n01', name:'Mutton Rogan Josh',           section:'wazwan-nonveg', type:'non-veg', rate:'₹1,300/kg' },
    { id:'waz-n02', name:'Mutton Kaliya / Yakhni',      section:'wazwan-nonveg', type:'non-veg', rate:'₹1,300/kg' },
    { id:'waz-n03', name:'Mutton Keema (Macch)',         section:'wazwan-nonveg', type:'non-veg', rate:'₹1,400/kg' },
    { id:'waz-n04', name:'Fried Chicken (Leg + Chest)', section:'wazwan-nonveg', type:'non-veg', rate:'₹800/kg' },
    { id:'waz-n05', name:'Tabak Maaz (Fried Ribs)',     section:'wazwan-nonveg', type:'non-veg', rate:'₹1,300/kg' },
    { id:'waz-n06', name:'Mutton Rista',                section:'wazwan-nonveg', type:'non-veg', rate:'₹1,500/kg' },
    { id:'waz-n07', name:'Mutton Goshtaba',             section:'wazwan-nonveg', type:'non-veg', rate:'₹1,500/kg' },
    { id:'waz-n08', name:'Mutton Mirchi Korma',         section:'wazwan-nonveg', type:'non-veg', rate:'₹1,300/kg' },
    { id:'waz-n09', name:'Fish-Mooli / Fish Nadroo (Kashmiri Style: Mali/Basa/Singara/Salmon/Surmai/Sole)', section:'wazwan-nonveg', type:'non-veg', rate:'₹900/kg' },
    { id:'waz-n10', name:'Khatti Kaleji',               section:'wazwan-nonveg', type:'non-veg', rate:'₹800/kg' },
    { id:'waz-n11', name:'Mutton Pulao',                section:'wazwan-nonveg', type:'non-veg', rate:'₹1,300/kg' },
    { id:'waz-n12', name:'Plain Rice',                  section:'wazwan-nonveg', type:'veg',     rate:'₹400/kg' },

    { id:'waz-v01', name:'Damalloo',                    section:'wazwan-veg', type:'veg', rate:'₹500/kg' },
    { id:'waz-v02', name:'Rajmash',                     section:'wazwan-veg', type:'veg', rate:'₹400/kg' },
    { id:'waz-v03', name:'Shahi Paneer',                section:'wazwan-veg', type:'veg', rate:'₹800/kg' },
    { id:'waz-v04', name:'Paneer Yellow (Lidir Chaman)',section:'wazwan-veg', type:'veg', rate:'₹800/kg' },
    { id:'waz-v05', name:'Nadroo Yakhni / Al Yakhni / Mushroom Yakhni', section:'wazwan-veg', type:'veg', rate:'₹600/kg' },
    { id:'waz-v06', name:'Dry Gobi',                    section:'wazwan-veg', type:'veg', rate:'₹200/kg' },
    { id:'waz-v07', name:'Khatte Bengan',               section:'wazwan-veg', type:'veg', rate:'₹200/kg' },
    { id:'waz-v08', name:'Haakh Saag',                  section:'wazwan-veg', type:'veg', rate:'₹200/kg' },
    { id:'waz-v09', name:'Monj Nadroo (Red / White)',   section:'wazwan-veg', type:'veg', rate:'₹300/kg' },
    { id:'waz-v10', name:'Namkeen Pulao / Sweet Pulao', section:'wazwan-veg', type:'veg', rate:'₹800/kg' },
    { id:'waz-v11', name:'Mooli Chutney',               section:'wazwan-veg', type:'veg', rate:'₹150/kg' },

    { id:'waz-s01', name:'Phirni (Cold)',               section:'wazwan-sweet', type:'veg', rate:'₹800/kg' },
    { id:'waz-s02', name:'Shifuta',                     section:'wazwan-sweet', type:'veg', rate:'₹1,800/kg' },
  ];

  /* ── All unique categories for admin dashboard use ── */
  const ADMIN_CATEGORIES = [
    { key:'cold-beverages',       label:'Cold Beverages',                  type:'veg' },
    { key:'shakes-smoothies',     label:'Shakes, Smoothies & Punches',     type:'veg' },
    { key:'hot-beverages',        label:'Hot Beverages',                   type:'veg' },
    { key:'soup-veg',             label:'Soup Station (Vegetarian)',       type:'veg' },
    { key:'soup-nonveg',          label:'Soup Station (Non-Vegetarian)',   type:'non-veg' },
    { key:'appetizers-veg',       label:'Appetizers / Starters (Veg.)',    type:'veg' },
    { key:'appetizers-nonveg',    label:'Appetizers / Starters (Non-Veg.)',type:'non-veg' },
    { key:'main-course-veg',      label:'Buffet / Main Course (Veg.)',     type:'veg' },
    { key:'main-course-nonveg',   label:'Buffet / Main Course (Non-Veg.)', type:'non-veg' },
    { key:'rice-pulao',           label:"Rice, Pulao's & Biryani's",       type:'mixed' },
    { key:'assorted-bread',       label:'Assorted Breads (Tandoori Bahar)',type:'mixed' },
    { key:'salad-raita',          label:'Salad Station',                   type:'veg' },
    { key:'raita',                label:'Raita & Accompaniments',          type:'veg' },
    { key:'live-counters',        label:'Live Counters (Veg & Continental)',type:'veg' },
    { key:'live-counters-nonveg', label:'Live Counters (Non-Veg)',         type:'non-veg' },
    { key:'dessert',              label:'Dessert Station & Sweets',        type:'veg' },
    { key:'fruit-counter',        label:'Fruit Counter',                   type:'veg' },
    { key:'specialty-counters',   label:'Specialty & Additional Counters', type:'veg' },
    { key:'arrival-drinks',       label:'As You Arrive (Koshur)',          type:'veg' },
    { key:'buffet-nonveg',        label:'Buffet Station Non-Veg (Koshur)', type:'non-veg' },
    { key:'soft-drink',           label:'Soft Drink (High Tea)',           type:'veg' },
    { key:'main-course-hightea',  label:'Main Course (High Tea)',          type:'mixed' },
    { key:'wazwan-nonveg',        label:'Wazwan Non-Veg (Cloud Kitchen)',  type:'non-veg' },
    { key:'wazwan-veg',           label:'Wazwan Veg (Cloud Kitchen)',      type:'veg' },
    { key:'wazwan-sweet',         label:'Wazwan Sweets (Cloud Kitchen)',   type:'veg' },
  ];

  return { PACKAGES, SECTIONS, ITEMS, ADMIN_CATEGORIES };

})();
