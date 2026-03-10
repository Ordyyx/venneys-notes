// ============================================================
// MENU DATA — array-based structure for guaranteed order in Firestore
// sections[] → categories[] → items[] or subcategories[] → items[]
// ============================================================

const MENU_DATA = { sections: [
  { key: "breakfast", label: "Breakfast", hours: { schedules: [{ days: [6, 0], start: 540, end: 690 }] }, categories: [
    { name: "Breakfast Bites", items: [
      { id: "bb1", name: "Venney's Large Breakfast", desc: "2 bacon rashers, 2 sausages, 2 eggs, tater tots, tomatoes, mushrooms, baked beans and toast. (GF Available)" },
      { id: "bb2", name: "Venney's Small Breakfast", desc: "A bacon rasher, sausage, egg, tater tots, tomatoes, mushrooms, baked beans and toast. (GF Available)" },
      { id: "bb3", name: "Venney's Vegan Breakfast", desc: "2 Quorn sausages, tater tots, avocado, tomatoes, mushrooms, baked beans and toast. (GF, VE)" },
      { id: "bb4", name: "Venney's Vegetarian Breakfast", desc: "2 Quorn sausages, 2 eggs, tater tots, halloumi, tomatoes, mushrooms, baked beans and toast. (GF, V)" },
      { id: "bb5", name: "Eggs Benedict", desc: "Topped with ham, poached eggs and hollandaise sauce." },
      { id: "bb6", name: "Eggs on Toast", desc: "(V)", mods: "flavour", flavours: ["Poached", "Scrambled", "Fried"] },
      { id: "bb7", name: "Spiced Avocado & Egg Muffins", desc: "Poached eggs and avocado on breakfast muffins. (V)" },
      { id: "bb8", name: "Belgium Waffle", desc: "Fresh seasonal fruit, Maple Syrup and Chocolate Sauce. (V)" },
      { id: "bb9", name: "Sausage Bun", desc: "(V and VE Available)" },
      { id: "bb10", name: "Bacon Bun", desc: "" },
      { id: "bb11", name: "Egg Bun", desc: "(V)" },
      { id: "bb12", name: "Breakfast Bun", desc: "Sausage, bacon, egg and tater tots." },
      { id: "bb13", name: "Greek Yoghurt with Granola", desc: "With fresh seasonal fruit and honey. (V)" },
    ]},
    { name: "Smoothies", items: [
      { id: "sm1", name: "Avo-Go-Go", desc: "Spinach, Broccoli, Avocado, Coconut, Mango, Ginger & Lime" },
      { id: "sm2", name: "Pash-n-shoot", desc: "Passionfruit, Pineapple & Mango" },
      { id: "sm3", name: "The Big 4", desc: "Strawberry, Mango, Pineapple and Kiwi" },
      { id: "sm4", name: "Coco Loco", desc: "Mango, Coconut, Lime, Pineapple and Mint" },
    ]},
  ]},
  { key: "lunch", label: "Lunch", hours: { schedules: [{ days: [1, 2, 3, 4, 5], start: 720, end: 960 }] }, categories: [
    { name: "Starters", items: [
      { id: "ls1", name: "Smoked Trout", desc: "With citrus and dill mayonnaise and fresh lemon." },
      { id: "ls2", name: "Breakfast Scotch Egg", desc: "With tomato ketchup, smoked bacon and potato rösti. (GF Available)" },
      { id: "ls3", name: "Salt Baked Rainbow Beetroot", desc: "(V)(GF)", mods: "flavour", flavours: ["White Roll", "Granary Roll"] },
      { id: "ls4", name: "Pan Fried Garlic Mushroom", desc: "With siracha mayonnaise. (V)(GF)" },
      { id: "ls5", name: "Soup of the Day", desc: "(GF Available)", mods: "flavour", flavours: ["White Roll", "Granary Roll"] },
    ]},
    { name: "Classic Mains", items: [
      { id: "lm1", name: "Beer Battered Traditional Haddock", desc: "With chips, charred lemon, tartar sauce and mushy or garden peas. (GF Available)", isFishChips: true },
      { id: "lm2", name: "Original 8oz Burger", desc: "With Monterey Jack cheese, onion rings, coleslaw, tomato and lettuce. (GF Available)", isBurger: true },
      { id: "lm3", name: "Traditional Scampi", desc: "With chips, charred lemon, tartar sauce and mushy or garden peas. (GF Available)", isFishChips: true },
      { id: "lm4", name: "Fish Platter", desc: "Haddock, scampi, calamari, chips and mushy or garden peas.", isFishChips: true },
      { id: "lm5", name: "Goat's Cheeseburger", desc: "With pickles, red onion chutney, onion rings and coleslaw. (V)", isBurger: true },
      { id: "lm6", name: "Steak & Ale Pie", desc: "With chips, mushy peas and gravy." },
      { id: "lm7", name: "Beef Bourguignon", desc: "With dauphinoise potatoes, green beans, thyme, bacon and onion gravy. (GF Available)" },
      { id: "lm8", name: "Cumberland Pinwheel Sausage", desc: "With creamed mash, buttered vegetables and onion gravy." },
      { id: "lm9", name: "Marinated Pepper Rigatoni", desc: "With basil, pesto, cracked black pepper and parmesan. (V)(VE Available)" },
      { id: "lm10", name: "Sirloin Steak", desc: "With flat mushroom, tomato, hand cut chips and salad. (GF)", isSteak: true },
      { id: "lm11", name: "Ribeye Steak", desc: "With flat mushroom, tomato, handcut chips and salad. (GF)", isSteak: true },
      { id: "lm12", name: "Fillet Steak", desc: "With flat mushroom, tomato, handcut chips and salad. (GF)", isSteak: true },
    ]},
    { name: "Sides", items: [
      { id: "lsi1", name: "French Fries", desc: "" }, { id: "lsi2", name: "Sweet Potato Fries", desc: "" },
      { id: "lsi3", name: "Bread & Butter", desc: "" }, { id: "lsi4", name: "Chips", desc: "" },
      { id: "lsi5", name: "Garlic Mushrooms", desc: "" }, { id: "lsi6", name: "Dressed Salad", desc: "" },
      { id: "lsi7", name: "Coleslaw", desc: "" }, { id: "lsi8", name: "Onion Rings", desc: "" },
      { id: "lsi9", name: "Truffle & Parmesan Fries", desc: "" }, { id: "lsi10", name: "Pot of Gravy", desc: "" },
      { id: "lsi11", name: "Garlic Bread Slice", desc: "" }, { id: "lsi12", name: "Cheesy Garlic Bread", desc: "" },
    ]},
  ]},
  { key: "evening", label: "Evening", hours: { schedules: [{ days: [1,2,3,4], start: 960, end: 1185 }, { days: [5,6], start: 960, end: 1215 }] }, categories: [
    { name: "Starters", items: [
      { id: "es1", name: "Smoked Trout", desc: "With citrus dill mayonnaise, Yorkshire pudding and watercress." },
      { id: "es2", name: "Breakfast Scotch Egg", desc: "With homemade hash browns and ketchup. (GF Available)" },
      { id: "es3", name: "Salt Baked Rainbow Beetroot", desc: "With goats cheese, honey mousse and candied walnuts. (V)(GF)" },
      { id: "es4", name: "Pan Fried Garlic Mushroom", desc: "With crispy bruschetta, pesto and parmesan. (GF Available)(V)" },
    ]},
    { name: "Classic Mains", items: [
      { id: "em1", name: "Beer Battered Traditional Haddock", desc: "With chips, charred lemon, tartar sauce and mushy or garden peas. (GF Available)", isFishChips: true },
      { id: "em2", name: "Double 4oz Blue Cheese Burger", desc: "With pickles, tomatoes, lettuce, onion rings, chips and coleslaw. (GF Available)", isBurger: true },
      { id: "em3", name: "Traditional Scampi", desc: "With chips, charred lemon, tartar sauce and mushy or garden peas. (GF Available)", isFishChips: true },
      { id: "em4", name: "Beef Wellington", desc: "With roasted carrots, shallots, dauphinoise potatoes and cherry jus." },
      { id: "em5", name: "Pan Fried Duck Breast", desc: "With celeriac puree, fondant potato and a five spice jus." },
      { id: "em6", name: "Crisp Belly Pork", desc: "With sweet potato puree, pak choi and peanut butter soy jus." },
      { id: "em7", name: "Pan Fried Crispy Pancetta", desc: "With king prawn carbonara and pan fried sea bass." },
      { id: "em8", name: "Sirloin Steak", desc: "With flat mushroom, tomato, handcut chips and salad. (GF)", isSteak: true },
      { id: "em9", name: "Ribeye Steak", desc: "With flat mushroom, tomato, handcut chips and salad. (GF)", isSteak: true },
      { id: "em10", name: "Fillet Steak", desc: "With flat mushroom, tomato, handcut chips and salad. (GF)", isSteak: true },
    ]},
    { name: "Sides", items: [
      { id: "esi1", name: "French Fries", desc: "" }, { id: "esi2", name: "Sweet Potato Fries", desc: "" },
      { id: "esi3", name: "Bread & Butter", desc: "" }, { id: "esi4", name: "Chips", desc: "" },
      { id: "esi5", name: "Garlic Mushrooms", desc: "" }, { id: "esi6", name: "Dressed Salad", desc: "" },
      { id: "esi7", name: "Coleslaw", desc: "" }, { id: "esi8", name: "Onion Rings", desc: "" },
      { id: "esi9", name: "Truffle & Parmesan Fries", desc: "" }, { id: "esi10", name: "Pot of Gravy", desc: "" },
      { id: "esi11", name: "Garlic Bread Slice", desc: "" }, { id: "esi12", name: "Cheesy Garlic Bread", desc: "" },
    ]},
  ]},
  { key: "sunday", label: "Sunday", hours: { schedules: [{ days: [0], start: 720, end: 1095 }] }, categories: [
    { name: "Starters", items: [
      { id: "sus1", name: "Prawn and Crayfish Cocktail", desc: "With Marie rose sauce, iceberg lettuce, fresh lemon and granary roll." },
      { id: "sus2", name: "Halloumi Fries", desc: "With siracha mayonnaise." },
      { id: "sus3", name: "Dressed Crab", desc: "With dill and citrus mayonnaise." },
    ]},
    { name: "Mains", items: [
      { id: "sum1", name: "Slow Roasted Beef Dinner", desc: "With yorkshire pudding, stuffing, mash, roast potatoes, parsnip, carrot, cabbage and gravy." },
      { id: "sum2", name: "Roast Chicken Breast Dinner", desc: "With yorkshire pudding, stuffing, mash, roast potatoes, parsnip, carrot, cabbage and gravy." },
      { id: "sum3", name: "Roasted Pork Loin Dinner", desc: "With yorkshire pudding, stuffing, mash, roast potatoes, parsnip, carrot, cabbage and gravy." },
      { id: "sum4", name: "Quorn Sausage Dinner", desc: "With yorkshire pudding, stuffing, mash, roast potatoes, parsnip, carrot, cabbage and gravy." },
      { id: "sum5", name: "Lincolnshire Sausage Dinner", desc: "With yorkshire pudding, stuffing, mash, roast potatoes, parsnip, carrot, cabbage and gravy." },
      { id: "sum6", name: "Traditional Haddock", desc: "With hand cut chips, peas, tartar sauce and lemon.", isFishChips: true },
      { id: "sum7", name: "1/2 Traditional Haddock", desc: "With hand cut chips, peas, tartar sauce and lemon.", isFishChips: true },
      { id: "sum8", name: "Scampi", desc: "With hand cut chips, peas, tartar sauce and lemon.", isFishChips: true },
      { id: "sum9", name: "1/2 Scampi", desc: "With hand cut chips, peas, tartar sauce and lemon.", isFishChips: true },
    ]},
    { name: "Sides", items: [
      { id: "susi1", name: "Yorkshire Pudding", desc: "" }, { id: "susi2", name: "Stuffing", desc: "" },
      { id: "susi3", name: "Cauliflower Cheese", desc: "" }, { id: "susi4", name: "Roast Potatoes", desc: "" },
      { id: "susi5", name: "Buttered Vegetables", desc: "" },
    ]},
  ]},
  { key: "dessert", label: "Dessert", hours: null, categories: [
    { name: "Desserts", items: [
      { id: "ds1", name: "White Chocolate & Blueberry Blondie", desc: "With strawberry coulis and Strawberry Sensation ice cream." },
      { id: "ds2", name: "Venney's Cheesecake", desc: "Ask about our flavour of the day!" },
      { id: "ds3", name: "Venney's Pavlova", desc: "Ask about our flavour of the day! (V)" },
      { id: "ds4", name: "Treacle Tart", desc: "(V)", mods: "flavour", flavours: ["Custard", "Ice Cream"] },
      { id: "ds5", name: "Sticky Toffee Pudding", desc: "With butterscotch sauce and vanilla ice cream. (V)" },
      { id: "ds6", name: "Baked Alaska", desc: "With wild berry." },
    ]},
    { name: "Ice Cream & Sorbet", items: [
      { id: "ic1", name: "Ice Cream", desc: "£2.00 per scoop", mods: "scoops", flavours: ["Vanilla","Strawberry","Mint Choc Chip","Chocolate","Raspberry Cheesecake","Honeycomb","Cookie Dough","Cherry Chocolate","Rum & Raisin","Salted Caramel"] },
      { id: "sb1", name: "Sorbet", desc: "£2.00 per scoop (V)(VE)(GF)", mods: "scoops", flavours: ["Raspberry","Mango"] },
    ]},
    { name: "Dessert Extras", items: [
      { id: "de1", name: "Jug of Cream", desc: "" },
      { id: "de2", name: "Jug of Custard", desc: "" },
    ]},
  ]},
  { key: "children", label: "Children's", hours: null, categories: [
    { name: "Children's Food", items: [
      { id: "ch1", name: "Chicken Nuggets", desc: "With chips. (GF Available)", mods: "flavour", flavours: ["Beans", "Peas"] },
      { id: "ch2", name: "Chicken Burger", desc: "With chips. (GF Available)", isBurger: true, mods: "flavour", flavours: ["Beans", "Peas"] },
      { id: "ch3", name: "Linguini with Beef Bolognaise", desc: "" },
      { id: "ch4", name: "Fresh Haddock Goujons", desc: "With chips. (GF Available)", mods: "flavour", flavours: ["Beans", "Peas"] },
      { id: "ch5", name: "Quorn Sausage", desc: "With chips. (GF)(VE)", mods: "flavour", flavours: ["Beans", "Peas"] },
    ]},
    { name: "Children's Drinks", items: [
      { id: "cd1", name: "Fruit Shoot", desc: "", mods: "flavour", flavours: ["Orange","Apple and Blackcurrant","Summer Fruits"] },
      { id: "cd2", name: "Blue Tornado", desc: "Bright and Glittery Kid-tail" },
      { id: "cd3", name: "Candy Colada", desc: "Creamy and Sweet Kid-tail" },
      { id: "cd4", name: "Berry Delight", desc: "Berry-Tastic Kid-tail" },
    ]},
    { name: "Children's Desserts", items: [
      { id: "cds1", name: "Ice Cream", desc: "£2.00/scoop", mods: "scoops", flavours: ["Vanilla","Strawberry","Chocolate"] },
      { id: "cds2", name: "Sorbet", desc: "(V)(VG) £2.00/scoop", mods: "scoops", flavours: ["Raspberry","Mango"] },
    ]},
  ]},
  { key: "drinks", label: "Drinks", hours: null, categories: [
    { name: "Draught", items: [
      { id: "dr1", name: "Madri", desc: "", mods: "draught" },
      { id: "dr2", name: "Staropramen", desc: "", mods: "draught" },
      { id: "dr3", name: "Carling", desc: "", mods: "draught" },
      { id: "dr4", name: "Alpacalypse", desc: "", mods: "draught" },
      { id: "dr5", name: "Worthingtons", desc: "", mods: "draught" },
      { id: "dr6", name: "Guinness", desc: "", mods: "draught" },
      { id: "dr7", name: "Aspalls Cider", desc: "", mods: "draught" },
    ]},
    { name: "Bottles", items: [
      { id: "bt1", name: "Hawkstone Cider", desc: "" }, { id: "bt2", name: "Hawkstone Hedgerow", desc: "" },
      { id: "bt3", name: "Hawkstone Premier", desc: "" }, { id: "bt4", name: "Hawkstone Session", desc: "" },
      { id: "bt5", name: "Hawkstone Pils", desc: "" }, { id: "bt6", name: "Desperados", desc: "" },
      { id: "bt7", name: "Rekorderlig", desc: "", mods: "flavour", flavours: ["Strawberry & Lime","Wild Berries"] },
      { id: "bt8", name: "Smirnoff Ice", desc: "" }, { id: "bt9", name: "Peroni", desc: "(GF Available)" },
      { id: "bt10", name: "Atlantic Pale Ale", desc: "" }, { id: "bt11", name: "WKD Blue", desc: "" },
      { id: "bt12", name: "Doom Bar", desc: "" }, { id: "bt13", name: "Timothy Taylors", desc: "" },
      { id: "bt14", name: "Budweiser", desc: "" },
    ]},
    { name: "0% Bottles", items: [
      { id: "na1", name: "Doom Bar 0%", desc: "" }, { id: "na2", name: "Madri 0%", desc: "" },
      { id: "na3", name: "Guinness 0%", desc: "" }, { id: "na4", name: "Peroni 0%", desc: "" },
      { id: "na5", name: "Corona 0%", desc: "" },
      { id: "na6", name: "Kopparberg 0%", desc: "", mods: "flavour", flavours: ["Pear","Mixed Berries"] },
    ]},
    { name: "Spirits", subcategories: [
      { name: "Vodka", items: [
        { id: "sv1", name: "Smirnoff Vodka", desc: "", mods: "spirit" },
        { id: "sv2", name: "Smirnoff Mango & Passionfruit", desc: "", mods: "spirit" },
        { id: "sv3", name: "Absolut Original", desc: "", mods: "spirit" },
        { id: "sv4", name: "Absolut Vanilla", desc: "", mods: "spirit" },
        { id: "sv5", name: "Absolut Citroen", desc: "", mods: "spirit" },
        { id: "sv6", name: "Black Cow Original", desc: "", mods: "spirit" },
        { id: "sv7", name: "Black Cow Strawberry", desc: "", mods: "spirit" },
        { id: "sv8", name: "AU Pink Lemonade", desc: "", mods: "spirit" },
        { id: "sv9", name: "AU Bubblegum", desc: "", mods: "spirit" },
        { id: "sv10", name: "Thunder Toffee Vodka", desc: "", mods: "spirit" },
        { id: "sv11", name: "Hawkstone Vodka", desc: "", mods: "spirit" },
      ]},
      { name: "Gin", items: [
        { id: "sg1", name: "Hawkstone Gin", desc: "", mods: "spirit" },
        { id: "sg2", name: "Burleigh Gin", desc: "", mods: "spirit" },
        { id: "sg3", name: "Hendricks Dry Gin", desc: "", mods: "spirit" },
        { id: "sg4", name: "Tanqueray Dry Gin", desc: "", mods: "spirit" },
        { id: "sg5", name: "Tanqueray Seville Gin", desc: "", mods: "spirit" },
        { id: "sg6", name: "Bombay Dry Gin", desc: "", mods: "spirit" },
        { id: "sg7", name: "Chase Marmalade Gin", desc: "", mods: "spirit" },
        { id: "sg8", name: "Whitley & Neill", desc: "", mods: "spirit", flavours: ["Raspberry","Ginger & Rhubarb","Black Cherry","Parma Violet"] },
        { id: "sg9", name: "Kopparberg Gin", desc: "", mods: "spirit", flavours: ["Passionfruit","Strawberry & Lime"] },
        { id: "sg10", name: "Gordon Gin", desc: "", mods: "spirit", flavours: ["White Peach","Sloe","Passionfruit","Lemon","Pink"] },
      ]},
      { name: "Rum", items: [
        { id: "sr1", name: "Bambu", desc: "", mods: "spirit" }, { id: "sr2", name: "Hawksbill Mango", desc: "", mods: "spirit" },
        { id: "sr3", name: "Kraken Spiced", desc: "", mods: "spirit" }, { id: "sr4", name: "Twin Fin Golden Spiced", desc: "", mods: "spirit" },
        { id: "sr5", name: "Captain Morgan Tikki", desc: "", mods: "spirit" }, { id: "sr6", name: "Captain Morgan Spiced / Dark", desc: "", mods: "spirit" },
        { id: "sr7", name: "Bacardi", desc: "", mods: "spirit" }, { id: "sr8", name: "Malibu", desc: "", mods: "spirit" },
        { id: "sr9", name: "Dead Mans Finger", desc: "", mods: "spirit" },
      ]},
      { name: "Whisky / Bourbon", items: [
        { id: "sw1", name: "Isle of Jura 10 Years", desc: "", mods: "spirit" }, { id: "sw2", name: "Naked Grouse", desc: "", mods: "spirit" },
        { id: "sw3", name: "Monkey Shoulder", desc: "", mods: "spirit" }, { id: "sw4", name: "Jameson", desc: "", mods: "spirit" },
        { id: "sw5", name: "Bells", desc: "", mods: "spirit" },
        { id: "sw6", name: "Jack Daniels", desc: "", mods: "spirit", flavours: ["Original","Honey"] },
        { id: "sw7", name: "Southern Comfort", desc: "", mods: "spirit" },
      ]},
      { name: "Other Spirits", items: [
        { id: "so1", name: "Archers", desc: "", mods: "spirit" }, { id: "so2", name: "Tia Maria", desc: "", mods: "spirit" },
        { id: "so3", name: "Baileys 50ml", desc: "", mods: "spirit" }, { id: "so4", name: "Disaronno", desc: "", mods: "spirit" },
        { id: "so5", name: "Martini Dry 50ml", desc: "", mods: "spirit" }, { id: "so6", name: "Limoncello", desc: "", mods: "spirit" },
        { id: "so7", name: "Pimm's", desc: "", mods: "spirit" }, { id: "so8", name: "Jägermeister", desc: "", mods: "spirit" },
      ]},
      { name: "Brandy", items: [
        { id: "sbr1", name: "Martel Cognac", desc: "", mods: "spirit" }, { id: "sbr2", name: "Three Barrells", desc: "", mods: "spirit" },
        { id: "sbr3", name: "Cherry Brandy", desc: "", mods: "spirit" },
      ]},
      { name: "Shots / Bombs", items: [
        { id: "sh1", name: "Tequila", desc: "", mods: "spirit" }, { id: "sh2", name: "Tequila Rose", desc: "", mods: "spirit" },
        { id: "sh3", name: "Sourz Range", desc: "", mods: "spirit" }, { id: "sh4", name: "Sambuca Range", desc: "", mods: "spirit" },
      ]},
    ]},
    { name: "Soft Drinks", items: [
      { id: "sd1", name: "J2O Range", desc: "", mods: "flavour_ice", flavours: ["Apple & Raspberry","Orange & Passionfruit","Apple & Mango","Dragon Berry"] },
      { id: "sd2", name: "Coca-Cola Classic", desc: "", mods: "softdrink" },
      { id: "sd3", name: "Coke Zero", desc: "", mods: "softdrink" },
      { id: "sd4", name: "Diet Coke", desc: "", mods: "softdrink" },
      { id: "sd5", name: "Britvic Orange", desc: "", mods: "softdrink" },
      { id: "sd6", name: "Britvic Lemon", desc: "", mods: "softdrink" },
      { id: "sd7", name: "Appletiser", desc: "", mods: "softdrink" },
      { id: "sd8", name: "Redbull", desc: "", mods: "softdrink" },
      { id: "sd9", name: "Cordial with Water", desc: "", mods: "softdrink" },
      { id: "sd10", name: "Harrogate Still", desc: "" },
      { id: "sd11", name: "Harrogate Sparkling", desc: "" },
      { id: "sd12", name: "Fresh Juice", desc: "", mods: "flavour_ice", flavours: ["Orange","Cranberry","Pineapple","Apple"] },
      { id: "sd13", name: "Fruit Shoot", desc: "", mods: "flavour", flavours: ["Summer Fruits","Orange","Apple & Blackcurrant"] },
    ]},
    { name: "Soda's on Tap", items: [
      { id: "st1", name: "Pepsi", desc: "", mods: "tap_soda" }, { id: "st2", name: "Pepsi Max", desc: "", mods: "tap_soda" },
      { id: "st3", name: "Tango", desc: "", mods: "tap_soda" }, { id: "st4", name: "Lemonade", desc: "", mods: "tap_soda" },
    ]},
    { name: "London Essence", items: [
      { id: "le1", name: "Indian Tonic", desc: "", mods: "softdrink" }, { id: "le2", name: "Craft Lemonade", desc: "", mods: "softdrink" },
      { id: "le3", name: "Ginger Ale", desc: "", mods: "softdrink" }, { id: "le4", name: "White Peach", desc: "", mods: "softdrink" },
      { id: "le5", name: "Raspberry & Rose", desc: "", mods: "softdrink" }, { id: "le6", name: "Orange & Elderflower", desc: "", mods: "softdrink" },
    ]},
    { name: "Cordials", items: [
      { id: "co1", name: "Britvic Orange", desc: "", mods: "softdrink" },
      { id: "co2", name: "Britvic Bitter Lemon", desc: "", mods: "softdrink" },
      { id: "co3", name: "Cordial & Water", desc: "", mods: "cordial", flavours: ["Blackcurrant","Orange","Lime"] },
      { id: "co4", name: "Pint Cordial & Soda", desc: "", mods: "cordial", flavours: ["Blackcurrant","Orange","Lime"] },
      { id: "co5", name: "Half Cordial & Soda", desc: "", mods: "cordial", flavours: ["Blackcurrant","Orange","Lime"] },
    ]},
    { name: "Cocktails", items: [
      { id: "ck1", name: "Pornstar Martini", desc: "" }, { id: "ck2", name: "Raspberry Cola Cube", desc: "" },
      { id: "ck3", name: "Espresso Martini", desc: "" }, { id: "ck4", name: "Aperol Spritz", desc: "" },
      { id: "ck5", name: "Glitter Bomb", desc: "" }, { id: "ck6", name: "Pina Colada", desc: "" },
      { id: "ck7", name: "Sex on the Beach", desc: "" },
      { id: "ck8", name: "Mojito", desc: "", mods: "flavour", flavours: ["Sweet","Dry"] },
      { id: "ck9", name: "Mojito Passionfruit", desc: "", mods: "flavour", flavours: ["Sweet","Dry"] },
    ]},
    { name: "Mocktails", items: [
      { id: "mk1", name: "Oceana Colada", desc: "" }, { id: "mk2", name: "Naked Porn Star", desc: "" },
      { id: "mk3", name: "Nojito", desc: "", mods: "flavour", flavours: ["Sweet","Dry"] },
      { id: "mk4", name: "Nojito Passionfruit", desc: "", mods: "flavour", flavours: ["Sweet","Dry"] },
    ]},
    { name: "Hot Drinks", subcategories: [
      { name: "Coffee & More", items: [
        { id: "hd1", name: "Espresso", desc: "" }, { id: "hd2", name: "Black Americano", desc: "" },
        { id: "hd3", name: "White Coffee", desc: "" }, { id: "hd4", name: "Flat White", desc: "" },
        { id: "hd5", name: "Cappuccino", desc: "" }, { id: "hd6", name: "Latte", desc: "" },
        { id: "hd7", name: "Mocha", desc: "" }, { id: "hd8", name: "Choccalatte", desc: "" },
        { id: "hd9", name: "Pot Of Tea", desc: "" },
        { id: "hd10", name: "Flavoured Tea", desc: "", mods: "flavour", flavours: ["Earl Grey","Green Tea","Camomile","Peppermint"] },
        { id: "hd11", name: "Hot Chocolate", desc: "" },
      ]},
      { name: "Hot Drink Extras", items: [
        { id: "he1", name: "Jug of Cream / Extra Milk", desc: "" },
        { id: "he2", name: "Caramel Syrup", desc: "" }, { id: "he3", name: "Hazelnut Syrup", desc: "" },
        { id: "he4", name: "Vanilla Syrup", desc: "" },
      ]},
    ]},
  ]},
]};

const ALLERGENS = [
  "Celery", "Gluten", "Crustaceans", "Eggs", "Fish",
  "Lupin", "Milk", "Molluscs", "Mustard", "Nuts",
  "Peanuts", "Sesame Seeds", "Soya", "Sulphur Dioxide"
];

const STEAK_SAUCES = ["Blue Cheese Glaze", "Green Peppercorn", "Cowboy Butter", "Garlic Butter", "No Sauce"];

const TABLES = Array.from({ length: 31 }, (_, i) => {
  const num = i + 1;
  return { id: num, label: num === 13 ? "Table 36" : `Table ${num}` };
});
