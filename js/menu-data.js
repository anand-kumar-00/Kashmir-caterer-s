/* ================================================================
   KASHMIR CATERER'S (BBS) — CENTRAL MENU DATA
   Source: Mega Veg, Mega Non-Veg, Mini Veg, Hi Tea Menu,
           Wazwan Cloud Kitchen, Koshur Non-Veg, Menu Card (8 pages)
   ================================================================ */

window.KCMenuData = (function () {

  /* ── Packages ── */
  const PACKAGES = [
    {
      key: 'mega-veg',
      label: 'Mega Veg',
      pax: 'MIN. 300 PAX',
      type: 'veg',
      desc: 'Full vegetarian mega spread for large gatherings.',
      limits: {
        'cold-beverages':  4,
        'hot-beverages':   2,
        'appetizers':      6,
        'salad':           5,
        'raita':           2,
        'rice-pulao':      2,
        'main-course':     5,
        'live-counters':   6,
        'dessert':         4,
        'fruit-counter':   null,
        'assorted-bread':  null,
      }
    },
    {
      key: 'mega-nonveg',
      label: 'Mega Non-Veg',
      pax: 'MIN. 250 PAX',
      type: 'non-veg',
      desc: 'Non-vegetarian mega package with wide selection.',
      limits: {
        'cold-beverages':        4,
        'hot-beverages-veg':     1,
        'hot-beverages-nonveg':  1,
        'appetizers-nonveg':     4,
        'appetizers-veg':        4,
        'salad':                 5,
        'raita':                 2,
        'rice-pulao':            2,
        'main-course-nonveg':    4,
        'main-course-veg':       4,
        'live-counters':         4,
        'dessert':               4,
        'fruit-counter':         null,
        'assorted-bread':        null,
      }
    },
    {
      key: 'mini-veg',
      label: 'Mini Veg',
      pax: 'MIN. 300 PAX',
      type: 'veg',
      desc: 'Compact vegetarian package for medium events.',
      limits: {
        'cold-beverages':  2,
        'hot-beverages':   1,
        'appetizers':      4,
        'salad':           3,
        'raita':           2,
        'rice-pulao':      2,
        'main-course':     4,
        'live-counters':   4,
        'dessert':         3,
        'fruit-counter':   null,
        'assorted-bread':  null,
      }
    },
    {
      key: 'koshur',
      label: 'Koshur Non-Veg',
      pax: 'MIN. 250 PAX',
      type: 'non-veg',
      desc: 'Authentic Kashmiri Wazwan-style non-vegetarian package.',
      limits: {
        'arrival-drinks':        null,
        'appetizers-nonveg':     null,
        'appetizers-veg':        null,
        'buffet-nonveg':         null,
        'buffet-veg':            null,
        'salad':                 null,
        'assorted-bread':        null,
        'dessert':               null,
      }
    },
    {
      key: 'high-tea',
      label: 'High Tea',
      pax: 'MINIMUM 50 PAX',
      type: 'both',
      desc: 'Light High Tea service for corporate & small events.',
      limits: {
        'soft-drink':    2,
        'tea-coffee':    1,
        'appetizers':    4,
        'main-course':   1,
        'dessert':       1,
      }
    },
    {
      key: 'wazwan',
      label: 'Wazwan Cloud Kitchen',
      pax: 'Per KG basis',
      type: 'non-veg',
      desc: 'Authentic Kashmiri Wazwan Cloud Kitchen — order by the kilogram.',
      limits: {}
    },
  ];

  /* ── Section Definitions ── */
  const SECTIONS = [
    /* — Mega Veg / Mini Veg — */
    { key:'cold-beverages',         label:'Cold Beverages',                 limit:'ANY FOUR',   pkg:['mega-veg','mini-veg','mega-nonveg'] },
    { key:'hot-beverages',          label:'Hot Beverages',                  limit:'ANY TWO',    pkg:['mega-veg'] },
    { key:'hot-beverages-veg',      label:'Hot Beverages Veg.',             limit:'ANY ONE',    pkg:['mega-nonveg','mini-veg'] },
    { key:'hot-beverages-nonveg',   label:'Hot Beverages Non-Veg.',         limit:'ANY ONE',    pkg:['mega-nonveg'] },
    { key:'appetizers',             label:'Appetizers',                     limit:'ANY SIX',    pkg:['mega-veg'] },
    { key:'appetizers-mini',        label:'Appetizers',                     limit:'ANY FOUR',   pkg:['mini-veg'] },
    { key:'appetizers-veg',         label:'Appetizers Veg.',                limit:'ANY FOUR',   pkg:['mega-nonveg','koshur'] },
    { key:'appetizers-nonveg',      label:'Appetizers Non-Veg.',            limit:'ANY FOUR',   pkg:['mega-nonveg','koshur'] },
    { key:'salad',                  label:'Salad Station',                  limit:'ANY FIVE',   pkg:['mega-veg','mega-nonveg','mini-veg','koshur'] },
    { key:'raita',                  label:'Raita',                          limit:'ANY TWO',    pkg:['mega-veg','mega-nonveg','mini-veg'] },
    { key:'rice-pulao',             label:"Rice & Pulao's",                 limit:'ANY TWO',    pkg:['mega-veg','mega-nonveg','mini-veg'] },
    { key:'main-course',            label:'Main Course',                    limit:'ANY FIVE',   pkg:['mega-veg'] },
    { key:'main-course-mini',       label:'Main Course',                    limit:'ANY FOUR',   pkg:['mini-veg'] },
    { key:'main-course-veg',        label:'Main Course Veg.',               limit:'ANY FOUR',   pkg:['mega-nonveg','koshur'] },
    { key:'main-course-nonveg',     label:'Main Course Non-Veg.',           limit:'ANY FOUR',   pkg:['mega-nonveg','koshur'] },
    { key:'assorted-bread',         label:'Assorted Bread',                 limit:null,         pkg:['mega-veg','mega-nonveg','mini-veg','koshur'] },
    { key:'live-counters',          label:'Live Counters',                  limit:'ANY SIX',    pkg:['mega-veg','mega-nonveg','mini-veg'] },
    { key:'dessert',                label:'Dessert Station',                limit:'ANY FOUR',   pkg:['mega-veg','mega-nonveg'] },
    { key:'dessert-mini',           label:'Dessert Station',                limit:'ANY THREE',  pkg:['mini-veg'] },
    { key:'fruit-counter',          label:'Fruit Counter',                  limit:null,         pkg:['mega-veg','mini-veg'] },
    /* — Koshur — */
    { key:'arrival-drinks',         label:'As You Arrive',                  limit:null,         pkg:['koshur'] },
    { key:'buffet-nonveg',          label:'Buffet Station Non-Veg.',        limit:null,         pkg:['koshur'] },
    { key:'buffet-veg',             label:'Buffet Station Veg.',            limit:null,         pkg:['koshur'] },
    /* — High Tea — */
    { key:'soft-drink',             label:'Soft Drink',                     limit:'ANY TWO',    pkg:['high-tea'] },
    { key:'tea-coffee',             label:'Tea / Coffee',                   limit:'ANY ONE',    pkg:['high-tea'] },
    { key:'main-course-hightea',    label:'Main Course',                    limit:'ANY ONE',    pkg:['high-tea'] },
    { key:'dessert-hightea',        label:'Dessert',                        limit:'ANY ONE',    pkg:['high-tea'] },
    { key:'appetizers-hightea',     label:'Appetizers',                     limit:'ANY FOUR',   pkg:['high-tea'] },
    /* — Wazwan — */
    { key:'wazwan-nonveg',          label:'Non-Vegetarian (per kg)',        limit:null,         pkg:['wazwan'] },
    { key:'wazwan-veg',             label:'Vegetarian (per kg)',            limit:null,         pkg:['wazwan'] },
    { key:'wazwan-sweet',           label:'Sweets (per kg)',                limit:null,         pkg:['wazwan'] },
  ];

  /* ── Items ── */
  const ITEMS = [

    /* ═══════════════════════════════════════
       COLD BEVERAGES
    ═══════════════════════════════════════ */
    { id:'cold-bev-01', name:'Assorted Cold Drinks',   section:'cold-beverages', type:'veg' },
    { id:'cold-bev-02', name:'Assorted Juices',        section:'cold-beverages', type:'veg' },
    { id:'cold-bev-03', name:'Fresh Lemon Soda',       section:'cold-beverages', type:'veg' },
    { id:'cold-bev-04', name:'Virgin Pina Coladas',    section:'cold-beverages', type:'veg' },
    { id:'cold-bev-05', name:'Blue Lagoon',            section:'cold-beverages', type:'veg' },
    { id:'cold-bev-06', name:'Strawberry Shake',       section:'cold-beverages', type:'veg' },
    { id:'cold-bev-07', name:'Pineapple Smoothie',     section:'cold-beverages', type:'veg' },
    { id:'cold-bev-08', name:'Orange Smoothie',        section:'cold-beverages', type:'veg' },

    /* ═══════════════════════════════════════
       HOT BEVERAGES (MEGA VEG — ANY TWO)
    ═══════════════════════════════════════ */
    { id:'hot-bev-01', name:'Kesar Qehwa',             section:'hot-beverages', type:'veg' },
    { id:'hot-bev-02', name:'Cream of Tomato Soup',    section:'hot-beverages', type:'veg' },
    { id:'hot-bev-03', name:'Hot N Sour Soup',         section:'hot-beverages', type:'veg' },
    { id:'hot-bev-04', name:'Veg. Telumein Soup',      section:'hot-beverages', type:'veg' },

    /* ═══════════════════════════════════════
       HOT BEVERAGES VEG. (MEGA NON-VEG / MINI VEG — ANY ONE)
    ═══════════════════════════════════════ */
    { id:'hot-bev-v01', name:'Kesar Qehwa',            section:'hot-beverages-veg', type:'veg' },
    { id:'hot-bev-v02', name:'Cream of Tomato Soup',   section:'hot-beverages-veg', type:'veg' },
    { id:'hot-bev-v03', name:'Hot N Sour Soup',        section:'hot-beverages-veg', type:'veg' },
    { id:'hot-bev-v04', name:'Veg. Telumein Soup',     section:'hot-beverages-veg', type:'veg' },

    /* ═══════════════════════════════════════
       HOT BEVERAGES NON-VEG. (ANY ONE)
    ═══════════════════════════════════════ */
    { id:'hot-bev-nv01', name:'Chicken Coriander Soup',section:'hot-beverages-nonveg', type:'non-veg' },
    { id:'hot-bev-nv02', name:'Chicken Shorba',        section:'hot-beverages-nonveg', type:'non-veg' },
    { id:'hot-bev-nv03', name:'Mutton Shorba',         section:'hot-beverages-nonveg', type:'non-veg' },

    /* ═══════════════════════════════════════
       APPETIZERS (MEGA VEG — ANY SIX)
    ═══════════════════════════════════════ */
    { id:'app-v01', name:'Paneer Haryali Tikka / Achari Paneer Tikka',  section:'appetizers', type:'veg' },
    { id:'app-v02', name:'Paneer Satay / Zeera Paneer',                  section:'appetizers', type:'veg' },
    { id:'app-v03', name:'Cheese Ball',                                  section:'appetizers', type:'veg' },
    { id:'app-v04', name:'Afghani Champ Tikka',                          section:'appetizers', type:'veg' },
    { id:'app-v05', name:'Cheese Roll / Cigar Roll',                     section:'appetizers', type:'veg' },
    { id:'app-v06', name:'Chilly Champ / Achari Champ Tikka',           section:'appetizers', type:'veg' },
    { id:'app-v07', name:'Spring Roll',                                  section:'appetizers', type:'veg' },
    { id:'app-v08', name:'Manchurian Balls / Crispy Veg.',               section:'appetizers', type:'veg' },
    { id:'app-v09', name:'Crunchy Mushroom',                             section:'appetizers', type:'veg' },
    { id:'app-v10', name:'Tandoori Mushroom',                            section:'appetizers', type:'veg' },
    { id:'app-v11', name:'Honey Chilly Lotus Stem / Honey Chilly Potato',section:'appetizers', type:'veg' },
    { id:'app-v12', name:'Hara Bhara Kabab / Till Roll / Methi Tikki',  section:'appetizers', type:'veg' },

    /* APPETIZERS (MINI VEG — ANY FOUR) — same list */
    { id:'app-m01', name:'Paneer Haryali Tikka / Achari Paneer Tikka',  section:'appetizers-mini', type:'veg' },
    { id:'app-m02', name:'Paneer Satay / Zeera Paneer',                  section:'appetizers-mini', type:'veg' },
    { id:'app-m03', name:'Cheese Balls',                                 section:'appetizers-mini', type:'veg' },
    { id:'app-m04', name:'Afghani Champ Tikka',                          section:'appetizers-mini', type:'veg' },
    { id:'app-m05', name:'Cheese Roll / Cigar Roll',                     section:'appetizers-mini', type:'veg' },
    { id:'app-m06', name:'Chilly Champ / Achari Champ Tikka',           section:'appetizers-mini', type:'veg' },
    { id:'app-m07', name:'Spring Roll',                                  section:'appetizers-mini', type:'veg' },
    { id:'app-m08', name:'Manchurian Balls / Crispy Veg.',               section:'appetizers-mini', type:'veg' },
    { id:'app-m09', name:'Crunchy Mushroom',                             section:'appetizers-mini', type:'veg' },
    { id:'app-m10', name:'Tandoori Mushroom',                            section:'appetizers-mini', type:'veg' },
    { id:'app-m11', name:'Honey Chilly Lotus Stem / Honey Chilly Potato',section:'appetizers-mini', type:'veg' },
    { id:'app-m12', name:'Hara Bhara Kabab / Till Roll / Methi Tikki',  section:'appetizers-mini', type:'veg' },

    /* APPETIZERS VEG. (MEGA NON-VEG / KOSHUR — ANY FOUR) */
    { id:'app-vv01', name:'Paneer Haryali Tikka / Paneer Satay / Zeera Paneer', section:'appetizers-veg', type:'veg' },
    { id:'app-vv02', name:'Cheese Balls',                                section:'appetizers-veg', type:'veg' },
    { id:'app-vv03', name:'Afghani Champ Tikka',                         section:'appetizers-veg', type:'veg' },
    { id:'app-vv04', name:'Cheese Roll / Cigar Roll',                    section:'appetizers-veg', type:'veg' },
    { id:'app-vv05', name:'Chilly Champ',                                section:'appetizers-veg', type:'veg' },
    { id:'app-vv06', name:'Spring Roll',                                 section:'appetizers-veg', type:'veg' },
    { id:'app-vv07', name:'Manchurian Balls / Crispy Veg.',              section:'appetizers-veg', type:'veg' },
    { id:'app-vv08', name:'Crunchy Mushroom',                            section:'appetizers-veg', type:'veg' },
    { id:'app-vv09', name:'Tandoori Mushroom',                           section:'appetizers-veg', type:'veg' },
    { id:'app-vv10', name:'Zeera Paneer / Chilly Paneer',                section:'appetizers-veg', type:'veg' },
    { id:'app-vv11', name:'Stuffed Mushroom',                            section:'appetizers-veg', type:'veg' },
    { id:'app-vv12', name:'Methi Tikki',                                 section:'appetizers-veg', type:'veg' },

    /* APPETIZERS NON-VEG. (MEGA NON-VEG / KOSHUR — ANY FOUR) */
    { id:'app-nv01', name:'Chicken Tikka Achari',                        section:'appetizers-nonveg', type:'non-veg' },
    { id:'app-nv02', name:'Fish Satay / Fish Amritsari / Fish Finger',   section:'appetizers-nonveg', type:'non-veg' },
    { id:'app-nv03', name:'Mutton Seekh Kabab (Fresh)',                  section:'appetizers-nonveg', type:'non-veg' },
    { id:'app-nv04', name:'Chicken Seekh Kabab (Fresh)',                 section:'appetizers-nonveg', type:'non-veg' },
    { id:'app-nv05', name:'Mutton Kanti / Mutton Tikka / Tabak Maaz',   section:'appetizers-nonveg', type:'non-veg' },
    { id:'app-nv06', name:'Chilly Chicken',                              section:'appetizers-nonveg', type:'non-veg' },
    { id:'app-nv07', name:'Chicken Malai Tikka',                         section:'appetizers-nonveg', type:'non-veg' },
    { id:'app-nv08', name:'Chicken Manchurian',                          section:'appetizers-nonveg', type:'non-veg' },
    { id:'app-nv09', name:'Chilly Kaleji',                               section:'appetizers-nonveg', type:'non-veg' },
    { id:'app-nv10', name:'Mutton Kabab',                                section:'appetizers-nonveg', type:'non-veg' },
    { id:'app-nv11', name:'Fish Fingers',                                section:'appetizers-nonveg', type:'non-veg' },

    /* ═══════════════════════════════════════
       SALAD STATION
    ═══════════════════════════════════════ */
    { id:'sal-01', name:'Fresh Green Salad',         section:'salad', type:'veg' },
    { id:'sal-02', name:'Peanut Salad',              section:'salad', type:'veg' },
    { id:'sal-03', name:'Sprout Salad',              section:'salad', type:'veg' },
    { id:'sal-04', name:'Russian Fruit Salad',       section:'salad', type:'veg' },
    { id:'sal-05', name:'Beans Salad',               section:'salad', type:'veg' },
    { id:'sal-06', name:'Onion Vinegar',             section:'salad', type:'veg' },
    { id:'sal-07', name:'Vegie Pasta Salad',         section:'salad', type:'veg' },
    { id:'sal-08', name:'Aloo Chat Salad',           section:'salad', type:'veg' },
    { id:'sal-09', name:'Grilled Vegetable Salad',   section:'salad', type:'veg' },
    { id:'sal-10', name:'Dry Salad (Pasta, Rongi Chat, Fruit Salad)', section:'salad', type:'veg' },

    /* ═══════════════════════════════════════
       RAITA
    ═══════════════════════════════════════ */
    { id:'rai-01', name:'Mooli Raita',               section:'raita', type:'veg' },
    { id:'rai-02', name:'Pineapple Raita',           section:'raita', type:'veg' },
    { id:'rai-03', name:'Mix Veg. Raita',            section:'raita', type:'veg' },
    { id:'rai-04', name:'Kheera Raita',              section:'raita', type:'veg' },
    { id:'rai-05', name:'Fruit Cocktail Raita',      section:'raita', type:'veg' },
    { id:'rai-06', name:'Lauki Raita',               section:'raita', type:'veg' },
    { id:'rai-07', name:'Boondi Raita',              section:'raita', type:'veg' },

    /* ═══════════════════════════════════════
       RICE & PULAO'S
    ═══════════════════════════════════════ */
    { id:'rice-01', name:'Plain Rice / Zeera Rice',              section:'rice-pulao', type:'veg' },
    { id:'rice-02', name:'Kashmiri Pulao (Namkeen / Sweet)',     section:'rice-pulao', type:'veg' },
    { id:'rice-03', name:'Fried Rice',                           section:'rice-pulao', type:'veg' },
    { id:'rice-04', name:'Hyderabadi Biryani (Veg.)',            section:'rice-pulao', type:'veg' },
    { id:'rice-05', name:'Hyderabadi Biryani (Non-Veg.)',        section:'rice-pulao', type:'non-veg' },

    /* ═══════════════════════════════════════
       MAIN COURSE (MEGA VEG — ANY FIVE)
    ═══════════════════════════════════════ */
    { id:'mc-v01', name:'Damalloo',                                          section:'main-course', type:'veg' },
    { id:'mc-v02', name:'Rajmash',                                           section:'main-course', type:'veg' },
    { id:'mc-v03', name:'Shahi Paneer / Paneer Lababdar / Kadai Paneer',    section:'main-course', type:'veg' },
    { id:'mc-v04', name:'Daal Makhni / Daal Tadka (Desi Style)',            section:'main-course', type:'veg' },
    { id:'mc-v05', name:'Palak Mushroom / Mushroom Do-Pyaza / Mushroom Yakhni / Nadroo Yakhni', section:'main-course', type:'veg' },
    { id:'mc-v06', name:'Veg. Jalfrezi',                                     section:'main-course', type:'veg' },
    { id:'mc-v07', name:'Tawa Vegetables',                                   section:'main-course', type:'veg' },
    { id:'mc-v08', name:'Bhindi Masala / Kurkuri Bhindi',                   section:'main-course', type:'veg' },
    { id:'mc-v09', name:'Curry Pakora',                                      section:'main-course', type:'veg' },

    /* MAIN COURSE (MINI VEG — ANY FOUR) */
    { id:'mc-m01', name:'Damalloo',                                          section:'main-course-mini', type:'veg' },
    { id:'mc-m02', name:'Rajmash',                                           section:'main-course-mini', type:'veg' },
    { id:'mc-m03', name:'Shahi Paneer / Paneer Lababdar / Kadai Paneer',    section:'main-course-mini', type:'veg' },
    { id:'mc-m04', name:'Daal Makhni / Daal Tadka (Desi Style)',            section:'main-course-mini', type:'veg' },
    { id:'mc-m05', name:'Palak Mushroom / Mushroom Do-Pyaza',               section:'main-course-mini', type:'veg' },
    { id:'mc-m06', name:'Mushroom Yakhni / Nadroo Yakhni',                  section:'main-course-mini', type:'veg' },
    { id:'mc-m07', name:'Veg. Jalfrezi',                                     section:'main-course-mini', type:'veg' },
    { id:'mc-m08', name:'Tawa Vegetables',                                   section:'main-course-mini', type:'veg' },
    { id:'mc-m09', name:'Bhindi Masala / Kurkuri Bhindi',                   section:'main-course-mini', type:'veg' },
    { id:'mc-m10', name:'Curry Pakora',                                      section:'main-course-mini', type:'veg' },

    /* MAIN COURSE VEG. (MEGA NON-VEG / KOSHUR — ANY FOUR) */
    { id:'mc-vv01', name:'Damalloo',                                         section:'main-course-veg', type:'veg' },
    { id:'mc-vv02', name:'Rajmash',                                          section:'main-course-veg', type:'veg' },
    { id:'mc-vv03', name:'Shahi Paneer / Paneer Lababdar / Kadai Paneer',   section:'main-course-veg', type:'veg' },
    { id:'mc-vv04', name:'Daal Makhni / Daal Tadka (Desi Style)',           section:'main-course-veg', type:'veg' },
    { id:'mc-vv05', name:'Palak Mushroom / Mushroom Do-Pyaza / Mushroom Yakhni / Nadroo Yakhni', section:'main-course-veg', type:'veg' },
    { id:'mc-vv06', name:'Veg. Jalfrezi',                                    section:'main-course-veg', type:'veg' },
    { id:'mc-vv07', name:'Tawa Vegetables',                                  section:'main-course-veg', type:'veg' },
    { id:'mc-vv08', name:'Bhindi Masala / Kurkuri Bhindi',                  section:'main-course-veg', type:'veg' },
    { id:'mc-vv09', name:'Curry Pakora',                                     section:'main-course-veg', type:'veg' },
    { id:'mc-vv10', name:'Paneer Yellow (Lidir Chaman)',                     section:'main-course-veg', type:'veg' },
    { id:'mc-vv11', name:'Paneer Shahi in Tomato (Lal Chaman) / Kadai Paneer', section:'main-course-veg', type:'veg' },
    { id:'mc-vv12', name:'Nadroo Yakhni / Mushroom Yakhni',                 section:'main-course-veg', type:'veg' },
    { id:'mc-vv13', name:'Mutter Palak / Mutter Corn',                      section:'main-course-veg', type:'veg' },
    { id:'mc-vv14', name:'Namkeen / Sweet Pulao',                           section:'main-course-veg', type:'veg' },

    /* MAIN COURSE NON-VEG. (MEGA NON-VEG — ANY FOUR, MAX TWO MUTTON) */
    { id:'mc-nv01', name:'Khatta Mutton / Mutton Rogan Josh',    section:'main-course-nonveg', type:'non-veg', note:'Mutton — max 2' },
    { id:'mc-nv02', name:'Mutton Yakhni / Rara Mutton',         section:'main-course-nonveg', type:'non-veg', note:'Mutton — max 2' },
    { id:'mc-nv03', name:'Mutton Keema (Macch)',                 section:'main-course-nonveg', type:'non-veg', note:'Mutton — max 2' },
    { id:'mc-nv04', name:'Mutton Sabza / Tabak Maaz',           section:'main-course-nonveg', type:'non-veg', note:'Mutton — max 2' },
    { id:'mc-nv05', name:'Butter Chicken Masala',               section:'main-course-nonveg', type:'non-veg' },
    { id:'mc-nv06', name:'Fried Chicken',                        section:'main-course-nonveg', type:'non-veg' },
    { id:'mc-nv07', name:'Kohlapuri Chicken',                    section:'main-course-nonveg', type:'non-veg' },
    { id:'mc-nv08', name:'Fried Fish / Fish Curry (Boneless)',   section:'main-course-nonveg', type:'non-veg' },
    { id:'mc-nv09', name:'Tomato Fish / Chilly Fish',            section:'main-course-nonveg', type:'non-veg' },

    /* Koshur Non-Veg Buffet */
    { id:'buf-nv01', name:'Mutton Roganjosh',                    section:'buffet-nonveg', type:'non-veg' },
    { id:'buf-nv02', name:'Mutton Yakhni / Kaliya / Sabza',      section:'buffet-nonveg', type:'non-veg' },
    { id:'buf-nv03', name:'Mutton Keema (Macch) / Round Shaped', section:'buffet-nonveg', type:'non-veg' },
    { id:'buf-nv04', name:'Fried Ribs (Tabak Maaz)',             section:'buffet-nonveg', type:'non-veg' },
    { id:'buf-nv05', name:'Fried Chicken (Leg & Chest)',         section:'buffet-nonveg', type:'non-veg' },
    { id:'buf-nv06', name:'Mutton Pulao',                        section:'buffet-nonveg', type:'non-veg' },

    /* Koshur Veg Buffet */
    { id:'buf-vv01', name:'Damalloo',                            section:'buffet-veg', type:'veg' },
    { id:'buf-vv02', name:'Rajmash',                             section:'buffet-veg', type:'veg' },
    { id:'buf-vv03', name:'Paneer Yellow (Lidir Chaman)',        section:'buffet-veg', type:'veg' },
    { id:'buf-vv04', name:'Paneer Shahi in Tomato (Lal Chaman) / Kadai Paneer', section:'buffet-veg', type:'veg' },
    { id:'buf-vv05', name:'Nadroo Yakhni / Mushroom Yakhni',     section:'buffet-veg', type:'veg' },
    { id:'buf-vv06', name:'Mutter Palak / Mutter Corn',         section:'buffet-veg', type:'veg' },
    { id:'buf-vv07', name:'Namkeen / Sweet Pulao',               section:'buffet-veg', type:'veg' },

    /* Koshur Arrival */
    { id:'arr-01', name:'Mineral Water',                         section:'arrival-drinks', type:'veg' },
    { id:'arr-02', name:'Assorted Cold Drinks (Thums Up, Limca, Sprite, Fanta)', section:'arrival-drinks', type:'veg' },
    { id:'arr-03', name:'Assorted Juices (Guava, Pineapple, Mixed, Litchi)',     section:'arrival-drinks', type:'veg' },
    { id:'arr-04', name:'Veg. Soup',                             section:'arrival-drinks', type:'veg' },
    { id:'arr-05', name:'Kesar Qehwa',                           section:'arrival-drinks', type:'veg' },

    /* ═══════════════════════════════════════
       ASSORTED BREAD
    ═══════════════════════════════════════ */
    { id:'bread-01', name:'Laccha Naan, Plain Naan, Butter Naan', section:'assorted-bread', type:'veg' },
    { id:'bread-02', name:'Papad / Pickles / Chutneys',          section:'assorted-bread', type:'veg' },
    { id:'bread-03', name:'Plain Rice',                           section:'assorted-bread', type:'veg' },
    { id:'bread-04', name:'Anchar (2–3 Types)',                   section:'assorted-bread', type:'veg' },
    { id:'bread-05', name:'Mooli Chutney / Mix Veg. Raita',      section:'assorted-bread', type:'veg' },
    { id:'bread-06', name:'Papad / Saunf Supari',                section:'assorted-bread', type:'veg' },

    /* ═══════════════════════════════════════
       LIVE COUNTERS
    ═══════════════════════════════════════ */
    { id:'live-01', name:'Aloo Tikki (Desi Ghee Wali)',           section:'live-counters', type:'veg' },
    { id:'live-02', name:'Dahi Bhalla – Chat Papri',              section:'live-counters', type:'veg' },
    { id:'live-03', name:'Hakka Noodles / Fried Rice Manchurian', section:'live-counters', type:'veg' },
    { id:'live-04', name:'Rajmash Kulcha',                        section:'live-counters', type:'veg' },
    { id:'live-05', name:'Pasta Red & White',                     section:'live-counters', type:'veg' },
    { id:'live-06', name:'Dosa Masala',                           section:'live-counters', type:'veg' },
    { id:'live-07', name:'Laccha Tokri',                          section:'live-counters', type:'veg' },
    { id:'live-08', name:'Paani Puri',                            section:'live-counters', type:'veg' },
    { id:'live-09', name:'Mushroom & Broccoli in Paprika Sauce',  section:'live-counters', type:'veg' },
    { id:'live-10', name:'Vegetable Chop Suey',                   section:'live-counters', type:'veg' },

    /* ═══════════════════════════════════════
       DESSERT STATION
    ═══════════════════════════════════════ */
    { id:'des-01', name:'Gulab Jamun (Hot)',                      section:'dessert', type:'veg' },
    { id:'des-02', name:'Jalebi Rabri',                          section:'dessert', type:'veg' },
    { id:'des-03', name:'Daal Halwa / Gajar Halwa (Seasonal)',   section:'dessert', type:'veg' },
    { id:'des-04', name:'Chocolate Brownie',                     section:'dessert', type:'veg' },
    { id:'des-05', name:'Chocolate Pudding / Vanilla Pudding',   section:'dessert', type:'veg' },
    { id:'des-06', name:'Ice-Cream / Pista Kulfi',               section:'dessert', type:'veg' },
    { id:'des-07', name:'Phirni',                                section:'dessert', type:'veg' },
    { id:'des-08', name:'Rasmalai',                              section:'dessert', type:'veg' },
    { id:'des-09', name:'Besan Laddoo, Burfi, Rasgula',         section:'dessert', type:'veg' },

    /* Same for mini veg (ANY THREE) */
    { id:'des-m01', name:'Gulab Jamun (Hot)',                    section:'dessert-mini', type:'veg' },
    { id:'des-m02', name:'Jalebi Rabri',                         section:'dessert-mini', type:'veg' },
    { id:'des-m03', name:'Daal Halwa / Gajar Halwa (Seasonal)',  section:'dessert-mini', type:'veg' },
    { id:'des-m04', name:'Chocolate Brownie',                    section:'dessert-mini', type:'veg' },
    { id:'des-m05', name:'Chocolate Pudding / Vanilla Pudding',  section:'dessert-mini', type:'veg' },
    { id:'des-m06', name:'Ice-Cream / Pista Kulfi',              section:'dessert-mini', type:'veg' },
    { id:'des-m07', name:'Phirni',                               section:'dessert-mini', type:'veg' },
    { id:'des-m08', name:'Rasmalai',                             section:'dessert-mini', type:'veg' },
    { id:'des-m09', name:'Besan Laddoo, Burfi, Rasgula',        section:'dessert-mini', type:'veg' },

    /* Koshur Dessert */
    { id:'des-k01', name:'Gulab Jamun',                          section:'dessert', type:'veg' },
    { id:'des-k02', name:'Ice Cream',                            section:'dessert', type:'veg' },
    { id:'des-k03', name:'Jalebi Rabri / Daal or Gajar Halwa (Seasonal)', section:'dessert', type:'veg' },
    { id:'des-k04', name:'Coffee',                               section:'dessert', type:'veg' },

    /* ═══════════════════════════════════════
       FRUIT COUNTER
    ═══════════════════════════════════════ */
    { id:'fruit-01', name:'5 to 6 Indian Seasonal Fruits',       section:'fruit-counter', type:'veg' },

    /* ═══════════════════════════════════════
       HIGH TEA — SOFT DRINK
    ═══════════════════════════════════════ */
    { id:'ht-sd-01', name:'Cold Drinks',             section:'soft-drink', type:'veg' },
    { id:'ht-sd-02', name:'Fresh Lemon Soda',        section:'soft-drink', type:'veg' },
    { id:'ht-sd-03', name:'Kesar Qehwa',             section:'soft-drink', type:'veg' },

    /* HIGH TEA — TEA/COFFEE */
    { id:'ht-tc-01', name:'Lipton Tea (Regular)',    section:'tea-coffee', type:'veg' },
    { id:'ht-tc-02', name:'Coffee (Regular)',        section:'tea-coffee', type:'veg' },

    /* HIGH TEA — APPETIZERS VEG */
    { id:'ht-av-01', name:'Sandwich',                section:'appetizers-hightea', type:'veg' },
    { id:'ht-av-02', name:'Grilled Sandwich',        section:'appetizers-hightea', type:'veg' },
    { id:'ht-av-03', name:'Samosa Cocktail',         section:'appetizers-hightea', type:'veg' },
    { id:'ht-av-04', name:'Paneer Pakora',           section:'appetizers-hightea', type:'veg' },
    { id:'ht-av-05', name:'Chilly Champ',            section:'appetizers-hightea', type:'veg' },
    { id:'ht-av-06', name:'Chicken Pakora',          section:'appetizers-hightea', type:'non-veg' },
    { id:'ht-av-07', name:'Grilled Chicken Sandwich',section:'appetizers-hightea', type:'non-veg' },
    { id:'ht-av-08', name:'Chicken Wrap',            section:'appetizers-hightea', type:'non-veg' },
    { id:'ht-av-09', name:'Chicken Kabab',           section:'appetizers-hightea', type:'non-veg' },
    { id:'ht-av-10', name:'Chicken Burger',          section:'appetizers-hightea', type:'non-veg' },

    /* HIGH TEA — MAIN COURSE */
    { id:'ht-mc-01', name:'Pav Bhaji',               section:'main-course-hightea', type:'veg' },
    { id:'ht-mc-02', name:'Chole Puri',              section:'main-course-hightea', type:'veg' },
    { id:'ht-mc-03', name:'Rajmash Kulcha',          section:'main-course-hightea', type:'veg' },
    { id:'ht-mc-04', name:'Keema Naan',              section:'main-course-hightea', type:'non-veg' },
    { id:'ht-mc-05', name:'Chicken Hakka Noodles',   section:'main-course-hightea', type:'non-veg' },
    { id:'ht-mc-06', name:'Chicken Fried Rice',      section:'main-course-hightea', type:'non-veg' },

    /* HIGH TEA — DESSERT */
    { id:'ht-des-01', name:'Besan Laddoo, Burfi, Rasgula', section:'dessert-hightea', type:'veg' },
    { id:'ht-des-02', name:'Pista Kulfi',            section:'dessert-hightea', type:'veg' },
    { id:'ht-des-03', name:'Gulab Jamun',            section:'dessert-hightea', type:'veg' },

    /* ═══════════════════════════════════════
       WAZWAN CLOUD KITCHEN
    ═══════════════════════════════════════ */
    { id:'waz-nv01', name:'Mutton Rogan Josh',           section:'wazwan-nonveg', type:'non-veg', rate:'₹1,300/kg' },
    { id:'waz-nv02', name:'Mutton Kaliya / Yakhni',      section:'wazwan-nonveg', type:'non-veg', rate:'₹1,300/kg' },
    { id:'waz-nv03', name:'Mutton Keema (Macch)',         section:'wazwan-nonveg', type:'non-veg', rate:'₹1,400/kg' },
    { id:'waz-nv04', name:'Fried Chicken (Leg + Chest)', section:'wazwan-nonveg', type:'non-veg', rate:'₹800/kg' },
    { id:'waz-nv05', name:'Tabak Maaz (Fried Ribs)',     section:'wazwan-nonveg', type:'non-veg', rate:'₹1,300/kg' },
    { id:'waz-nv06', name:'Mutton Rista',                section:'wazwan-nonveg', type:'non-veg', rate:'₹1,500/kg' },
    { id:'waz-nv07', name:'Mutton Goshtaba',             section:'wazwan-nonveg', type:'non-veg', rate:'₹1,500/kg' },
    { id:'waz-nv08', name:'Mutton Mirchi Korma',         section:'wazwan-nonveg', type:'non-veg', rate:'₹1,300/kg' },
    { id:'waz-nv09', name:'Fish — Mooli / Fish Nadroo (Kashmiri Style)', section:'wazwan-nonveg', type:'non-veg', rate:'₹900/kg' },
    { id:'waz-nv10', name:'Khatti Kaleji',               section:'wazwan-nonveg', type:'non-veg', rate:'₹800/kg' },
    { id:'waz-nv11', name:'Mutton Pulao',                section:'wazwan-nonveg', type:'non-veg', rate:'₹1,300/kg' },
    { id:'waz-nv12', name:'Plain Rice',                  section:'wazwan-nonveg', type:'veg',     rate:'₹400/kg' },

    { id:'waz-v01', name:'Damalloo',                     section:'wazwan-veg', type:'veg', rate:'₹500/kg' },
    { id:'waz-v02', name:'Rajmash',                      section:'wazwan-veg', type:'veg', rate:'₹400/kg' },
    { id:'waz-v03', name:'Shahi Paneer',                 section:'wazwan-veg', type:'veg', rate:'₹800/kg' },
    { id:'waz-v04', name:'Paneer Yellow',                section:'wazwan-veg', type:'veg', rate:'₹800/kg' },
    { id:'waz-v05', name:'Nadroo Yakhni / Al Yakhni / Mushroom Yakhni', section:'wazwan-veg', type:'veg', rate:'₹600/kg' },
    { id:'waz-v06', name:'Dry Gobi',                     section:'wazwan-veg', type:'veg', rate:'₹200/kg' },
    { id:'waz-v07', name:'Khatte Bengan',                section:'wazwan-veg', type:'veg', rate:'₹200/kg' },
    { id:'waz-v08', name:'Haakh Saag',                   section:'wazwan-veg', type:'veg', rate:'₹200/kg' },
    { id:'waz-v09', name:'Monj Nadroo (Red / White)',    section:'wazwan-veg', type:'veg', rate:'₹300/kg' },
    { id:'waz-v10', name:'Namkeen Pulao / Sweet Pulao',  section:'wazwan-veg', type:'veg', rate:'₹800/kg' },
    { id:'waz-v11', name:'Mooli Chutney',                section:'wazwan-veg', type:'veg', rate:'₹150/kg' },

    { id:'waz-sw01', name:'Phirni (Cold)',               section:'wazwan-sweet', type:'veg', rate:'₹800/kg' },
    { id:'waz-sw02', name:'Shifuta',                     section:'wazwan-sweet', type:'veg', rate:'₹1,800/kg' },
  ];

  return { PACKAGES, SECTIONS, ITEMS };

})();
