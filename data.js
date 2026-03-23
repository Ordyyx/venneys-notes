// ============================================================
// MENU DATA - scraped from venneysatthegranby.co.uk/menus/
// ============================================================

const MENU_DATA = {
  breakfast: {
    label: "Breakfast",
    hours: { days: [6, 0], start: 9 * 60, end: 11 * 60 + 30 }, // Sat & Sun 9am-11:30am
    categories: {
      "Breakfast Bites": [
        { id: "bb1", name: "Venney's Large Breakfast", desc: "2 bacon rashers, 2 sausages, 2 eggs, tater tots, tomatoes, mushrooms, baked beans and toast. (GF Available)" },
        { id: "bb2", name: "Venney's Small Breakfast", desc: "A bacon rasher, sausage, egg, tater tots, tomatoes, mushrooms, baked beans and toast. (GF Available)" },
        { id: "bb3", name: "Venney's Vegan Breakfast", desc: "2 Quorn sausages, tater tots, avocado, tomatoes, mushrooms, baked beans and toast. (GF, VE)" },
        { id: "bb4", name: "Venney's Vegetarian Breakfast", desc: "2 Quorn sausages, 2 eggs, tater tots, halloumi, tomatoes, mushrooms, baked beans and toast. (GF, V)" },
        { id: "bb5", name: "Eggs Benedict", desc: "A delicious breakfast muffin topped with ham, poached eggs and hollandaise sauce." },
        { id: "bb6", name: "Eggs on Toast", desc: "A choice of poached, scrambled or fried eggs on fresh bread. (V)" },
        { id: "bb7", name: "Spiced Avocado & Egg Muffins", desc: "Poached eggs and avocado on breakfast muffins. (V)" },
        { id: "bb8", name: "Belgium Waffle", desc: "Fresh, seasonal fruit on a Belgium waffle, served with Maple Syrup and Chocolate Sauce. (V)" },
        { id: "bb9", name: "Sausage Bun", desc: "Sausage in a fresh bun. (V and VE Available)" },
        { id: "bb10", name: "Bacon Bun", desc: "Bacon in a bun." },
        { id: "bb11", name: "Egg Bun", desc: "Egg in a bun. (V)" },
        { id: "bb12", name: "Breakfast Bun", desc: "Sausage, bacon, egg and tater tots in a bun." },
        { id: "bb13", name: "Greek Yoghurt with Granola", desc: "Served with fresh seasonal fruit and honey. (V)" },
      ],
      "Smoothies": [
        { id: "sm1", name: "Avo-Go-Go", desc: "Spinach, Broccoli, Avocado, Coconut, Mango, Ginger & Lime" },
        { id: "sm2", name: "Pash-n-shoot", desc: "Passionfruit, Pineapple & Mango" },
        { id: "sm3", name: "The Big 4", desc: "Strawberry, Mango, Pineapple and Kiwi" },
        { id: "sm4", name: "Coco Loco", desc: "Mango, Coconut, Lime, Pineapple and Mint" },
      ]
    }
  },
  lunch: {
    label: "Lunch",
    hours: { days: [1, 2, 3, 4, 5], start: 12 * 60, end: 16 * 60 }, // Mon-Sat 12pm-4pm
    categories: {
      "Starters": [
        { id: "ls1", name: "Smoked Trout", desc: "Served with citrus and dill mayonnaise and fresh lemon." },
        { id: "ls2", name: "Breakfast Scotch Egg", desc: "Served with tomato ketchup, smoked bacon and potato rösti. (GF Available)" },
        { id: "ls3", name: "Salt Baked Rainbow Beetroot", desc: "Served with a choice of white or granary bread roll. (V)(GF)" },
        { id: "ls4", name: "Pan Fried Garlic Mushroom", desc: "Served with siracha mayonnaise. (V)(GF)" },
        { id: "ls5", name: "Soup of the Day", desc: "Served with white or granary bread roll. Ask a team member for more information. (GF Available)" },
      ],
      "Classic Mains": [
        { id: "lm1", name: "Beer Battered Traditional Haddock", desc: "Served with Venney's double hand cooked chips, charred lemon, tartar sauce and mushy or garden peas. (GF Available)", isFishChips: true },
        { id: "lm2", name: "Original 8oz Burger", desc: "Served with Monterey Jack cheese, onion rings, coleslaw, tomato and lettuce. (GF Available)", isBurger: true },
        { id: "lm3", name: "Traditional Scampi", desc: "Served with Venney's double hand cooked chips, charred lemon, tartar sauce and mushy and garden peas. (GF Available)", isFishChips: true },
        { id: "lm4", name: "Fish Platter", desc: "Served with haddock, scampi, calamari chips and a choice of mushy or garden peas.", isFishChips: true },
        { id: "lm5", name: "Goat's Cheeseburger", desc: "Served with pickles, red onion chutney, onion rings and coleslaw. (V)", isBurger: true },
        { id: "lm6", name: "Steak & Ale Pie", desc: "Served with chips, mushy peas and gravy." },
        { id: "lm7", name: "Beef Bourguignon", desc: "Served with dauphinoise potatoes, green beans, thyme, bacon and onion gravy. (GF Available)" },
        { id: "lm8", name: "Cumberland Pinwheel Sausage", desc: "Served with creamed mash, buttered vegetables and onion gravy." },
        { id: "lm9", name: "Marinated Pepper Rigatoni", desc: "Served with basil, pesto, cracked black pepper and parmesan. (V)(VE Available)" },
        { id: "lm10", name: "Sirloin Steak", desc: "Served with flat mushroom, tomato, hand cut chips and salad. (GF)", isSteak: true },
        { id: "lm11", name: "Ribeye Steak", desc: "Served with flat mushroom, tomato, handcut chips and salad. (GF)", isSteak: true },
        { id: "lm12", name: "Fillet Steak", desc: "Served with flat mushroom, tomato, handcut chips and salad. (GF)", isSteak: true },
      ],
      "Sides": [
        { id: "lsi1", name: "French Fries", desc: "" },
        { id: "lsi2", name: "Sweet Potato Fries", desc: "" },
        { id: "lsi3", name: "Bread & Butter", desc: "" },
        { id: "lsi4", name: "Chips", desc: "" },
        { id: "lsi5", name: "Garlic Mushrooms", desc: "" },
        { id: "lsi6", name: "Dressed Salad", desc: "" },
        { id: "lsi7", name: "Coleslaw", desc: "" },
        { id: "lsi8", name: "Onion Rings", desc: "" },
        { id: "lsi9", name: "Truffle & Parmesan Fries", desc: "" },
        { id: "lsi10", name: "Pot of Gravy", desc: "" },
        { id: "lsi11", name: "Garlic Bread Slice", desc: "" },
        { id: "lsi12", name: "Cheesy Garlic Bread", desc: "" },
      ]
    }
  },
  evening: {
    label: "Evening",
    hours: {
      weekday: { days: [1, 2, 3, 4], start: 16 * 60, end: 19 * 60 + 45 },
      weekend: { days: [5, 6], start: 16 * 60, end: 20 * 60 + 15 }
    },
    categories: {
      "Starters": [
        { id: "es1", name: "Smoked Trout", desc: "Served with citrus dill mayonnaise, Yorkshire pudding and watercress." },
        { id: "es2", name: "Breakfast Scotch Egg", desc: "Served with homemade hash browns and ketchup. (GF Available)" },
        { id: "es3", name: "Salt Baked Rainbow Beetroot", desc: "Served with goats cheese, honey mousse and candied walnuts. (V)(GF)" },
        { id: "es4", name: "Pan Fried Garlic Mushroom", desc: "Served with Crispy bruschetta, pesto and parmesan. (GF Available)(V)" },
      ],
      "Classic Mains": [
        { id: "em1", name: "Beer Battered Traditional Haddock", desc: "Served with Venney's double hand cooked chips, charred lemon, tartar sauce and mushy or garden peas. (GF Available)", isFishChips: true },
        { id: "em2", name: "Double 4oz Blue Cheese Burger", desc: "Served with pickles, tomatoes, lettuce, onion rings, chips and coleslaw. (GF Available)", isBurger: true },
        { id: "em3", name: "Traditional Scampi", desc: "Served with Venney's double hand cooked chips, charred lemon, tartar sauce and mushy or garden peas. (GF Available)", isFishChips: true },
        { id: "em4", name: "Beef Wellington", desc: "Served with roasted carrots, shallots, dauphinoise potatoes chips and cherry jus." },
        { id: "em5", name: "Pan Fried Duck Breast", desc: "Served with celeriac, puree, fondant potato and a five spice jus." },
        { id: "em6", name: "Crisp Belly Pork", desc: "Served with sweet potato puree, pak choi and a peanut butter soy jus." },
        { id: "em7", name: "Pan Fried Crispy Pancetta", desc: "Served with king prawn carbonara and pan fried sea bass." },
        { id: "em8", name: "Sirloin Steak", desc: "Served with flat mushroom, tomato, handcut chips and salad. (GF)", isSteak: true },
        { id: "em9", name: "Ribeye Steak", desc: "Served with flat mushroom, tomato, handcut chips and salad. (GF)", isSteak: true },
        { id: "em10", name: "Fillet Steak", desc: "Served with flat mushroom, tomato, handcut chips and salad. (GF)", isSteak: true },
        { id: "em11", name: "Beef Bouginon", desc: ""},
        { id: "em12", name: "Steak & Ale Pie", desc: ""}
      ],
      "Sides": [
        { id: "esi1", name: "French Fries", desc: "" },
        { id: "esi2", name: "Sweet Potato Fries", desc: "" },
        { id: "esi3", name: "Bread & Butter", desc: "" },
        { id: "esi4", name: "Chips", desc: "" },
        { id: "esi5", name: "Garlic Mushrooms", desc: "" },
        { id: "esi6", name: "Dressed Salad", desc: "" },
        { id: "esi7", name: "Coleslaw", desc: "" },
        { id: "esi8", name: "Onion Rings", desc: "" },
        { id: "esi9", name: "Truffle & Parmesan Fries", desc: "" },
        { id: "esi10", name: "Pot of Gravy", desc: "" },
        { id: "esi11", name: "Garlic Bread Slice", desc: "" },
        { id: "esi12", name: "Cheesy Garlic Bread", desc: "" },
      ]
    }
  },
  dessert: {
    label: "Dessert",
    hours: null, // Always available
    categories: {
      "Desserts": [
        { id: "ds1", name: "White Chocolate and Blueberry Blondie", desc: "Served with strawberry coulis and Strawberry Sensation ice cream." },
        { id: "ds2", name: "Venney's Cheesecake", desc: "Ask the team about our Cheesecake flavour of the day! (V)" },
        { id: "ds3", name: "Venney's Pavlova", desc: "Ask the team about our Pavlova flavour of the day! (V)" },
        { id: "ds4", name: "Carrot Cake", desc: "" },
        { id: "ds5", name: "Sticky Toffee Pudding", desc: "Served with butterscotch sauce and vanilla ice cream. (V)" },
        { id: "ds6", name: "Baked Alaska", desc: "Served with Wild Berry." },
      ]
    }
  },
  children: {
    label: "Children's",
    hours: null, // Always available
    categories: {
      "Children's Menu": [
        { id: "ch1", name: "Chicken Nuggets", desc: "Served with chips and a choice of beans or peas. (GF Available)" },
        { id: "ch2", name: "Chicken Burger", desc: "Served with chips and a choice of beans or peas. (GF Available)" },
        { id: "ch3", name: "Linguine with Beef Bolognaise", desc: "" },
        { id: "ch4", name: "Fresh Haddock Goujons", desc: "Served with chips and a choice of beans or peas. (GF Available)" },
        { id: "ch5", name: "Quorn Sausage", desc: "Served with chips and a choice of beans or peas. (GF) (VE)" },
      ]
    }
  },
  sunday: {
    label: "Sunday",
    hours: { days: [0], start: 12 * 60, end: 18 * 60 + 15 }, // Sunday 12pm-6:15pm
    categories: {
      "Starters": [
        { id: "sus1", name: "Prawn and Crayfish Cocktail", desc: "Served with Marie rose sauce, iceberg lettuce, fresh lemon and a granary roll." },
        { id: "sus2", name: "Halloumi Fries", desc: "with siracha mayonnaise." },
        { id: "sus3", name: "Dressed Crab", desc: "with dill and citrus mayonnaise." },
      ],
      "Mains": [
        { id: "sum1", name: "Slow Roasted Beef Dinner", desc: "with yorkshire pudding, stuffing, mash potato, roast potatoes, roast parsnip, roast carrot, buttered cabbage and gravy." },
        { id: "sum2", name: "Roast Chicken Breast Dinner", desc: "with yorkshire pudding, stuffing, mash potato, roast potatoes, roast parsnip, roast carrot, buttered cabbage and gravy." },
        { id: "sum3", name: "Roasted Pork Loin Dinner", desc: "with yorkshire pudding, stuffing, mash potato, roast potatoes, roast parsnip, roast carrot, buttered cabbage and gravy." },
        { id: "sum4", name: "Quorn Sausage Dinner", desc: "with yorkshire pudding, stuffing, mash potato, roast potatoes, roast parsnip, roast carrot, buttered cabbage and gravy." },
        { id: "sum5", name: "Lincolnshire Sausage Dinner", desc: "with yorkshire pudding, stuffing, mash potato, roast potatoes, roast parsnip, roast carrot, buttered cabbage and gravy." },
        { id: "sum6", name: "Traditional Haddock", desc: "with hand cut chips, garden or mushy peas, tartar sauce and a lemon wedge.", isFishChips: true },
        { id: "sum7", name: "1/2 Traditional Haddock", desc: "with hand cut chips, garden or mushy peas, tartar sauce and a lemon wedge.", isFishChips: true },
        { id: "sum8", name: "Scampi", desc: "with hand cut chips, garden or mushy peas, tartar sauce and a lemon wedge.", isFishChips: true },
        { id: "sum9", name: "1/2 Scampi", desc: "with hand cut chips, garden or mushy peas, tartar sauce and a lemon wedge.", isFishChips: true },
      ],
      "Sides": [
        { id: "susi1", name: "Yorkshire Pudding", desc: "" },
        { id: "susi2", name: "Stuffing", desc: "" },
        { id: "susi3", name: "Cauliflower Cheese", desc: "" },
        { id: "susi4", name: "Roast Potatoes", desc: "" },
        { id: "susi5", name: "Buttered Vegetables", desc: "" },
      ]
    }
  }
};

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
