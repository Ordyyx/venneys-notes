const MENUS = {

  "Breakfast": {
    icon: "🍳",
    sections: {
      "Main Bites": {
        "Venney's Large Breakfast": {
          note: "2 bacon, 2 sausages, 2 eggs, tater tots, tomatoes, mushrooms, beans, toast (GF Available)",
          choices: {
            "Eggs": ["Fried", "Scrambled", "Poached"]
          }
        },
        "Venney's Small Breakfast": {
          note: "Bacon, sausage, egg, tater tots, tomatoes, mushrooms, beans, toast (GF Available)",
          choices: {
            "Eggs": ["Fried", "Scrambled", "Poached"]
          }
        },
        "Venney's Vegan Breakfast": {
          note: "2 Quorn sausages, tater tots, avocado, tomatoes, mushrooms, beans, toast (GF, VE)"
        },
        "Venney's Vegetarian Breakfast": {
          note: "2 Quorn sausages, 2 eggs, tater tots, halloumi, tomatoes, mushrooms, beans, toast (GF, V)",
          choices: {
            "Eggs": ["Fried", "Scrambled", "Poached"]
          }
        },
        "Eggs Benedict": {
          note: "Muffin topped with ham, poached eggs and hollandaise sauce"
        },
        "Eggs on Toast": {
          note: "On fresh bread (V)",
          choices: {
            "Eggs": ["Poached", "Scrambled", "Fried"]
          }
        },
        "Spiced Avocado & Egg Muffins": {
          note: "Poached eggs and avocado on breakfast muffins (V)"
        },
        "Belgium Waffle": {
          note: "Fresh seasonal fruit, maple syrup and chocolate sauce (V)"
        },
        "Sausage Bun": {
          note: "Sausage in a fresh bun (V and VE Available)"
        },
        "Bacon Bun": {
          note: "Bacon in a bun"
        },
        "Egg Bun": {
          note: "Egg in a bun (V)",
          choices: {
            "Eggs": ["Fried", "Scrambled", "Poached"]
          }
        },
        "Breakfast Bun": {
          note: "Sausage, bacon, egg and tater tots in a bun"
        },
        "Greek Yoghurt with Granola": {
          note: "Fresh seasonal fruit and honey (V)"
        }
      },
      "Smoothies": {
        "Avo-Go-Go": {
          note: "Spinach, broccoli, avocado, coconut, mango, ginger & lime"
        },
        "Pash-n-shoot": {
          note: "Passionfruit, pineapple & mango"
        },
        "The Big 4": {
          note: "Strawberry, mango, pineapple and kiwi"
        },
        "Coco Loco": {
          note: "Mango, coconut, lime, pineapple and mint"
        }
      }
    }
  },

  "Lunch": {
    icon: "☀️",
    sections: {
      "Starters": {
        "Smoked Trout": {
          note: "Citrus and dill mayonnaise with a Yorkshire pudding"
        },
        "Breakfast Scotch Egg": {
          note: "Tomato ketchup, smoked bacon and potato rösti (GF Available)"
        },
        "Salt Baked Rainbow Beetroot": {
          note: "Goats cheese, honey mousse and candied walnuts (V)(GF)"
        },
        "Pan Fried Garlic Mushroom": {
          note: "Crispy bruschetta, pesto and parmesan (V)(GF)"
        },
        "Soup of the Day": {
          note: "Ask team for today's soup (GF Available)",
          choices: {
            "Bread": ["White Roll", "Granary Roll"]
          }
        }
      },
      "Mains": {
        "Beer Battered Traditional Haddock": {
          note: "Double-cooked chips, charred lemon, tartar sauce (GF Available)",
          choices: {
            "Peas": ["Mushy Peas", "Garden Peas"]
          }
        },
        "Original 8oz Burger": {
          note: "Monterey jack cheese, onion rings, coleslaw, tomato, pickles, lettuce (GF Available)"
        },
        "Traditional Scampi": {
          note: "Double-cooked chips, charred lemon, tartar sauce (GF Available)",
          choices: {
            "Peas": ["Mushy Peas", "Garden Peas"]
          }
        },
        "Fish Platter": {
          note: "Haddock, scampi, calamari, chips",
          choices: {
            "Peas": ["Mushy Peas", "Garden Peas"]
          }
        },
        "Goat's Cheese Burger": {
          note: "Pickles, red onion chutney, onion rings and coleslaw (V)"
        },
        "Steak & Ale Pie": {
          note: "Chips, mushy peas and gravy"
        },
        "Beef Bourguignon": {
          note: "Dauphinoise potatoes, green beans, thyme, bacon and onion gravy (GF Available)"
        },
        "Cumberland Pinwheel Sausage": {
          note: "Creamed mash, buttered vegetables and onion gravy"
        },
        "Marinated Pepper Rigatoni": {
          note: "Basil, pesto, cracked black pepper and parmesan (V)(VE Available)"
        },
        "Chicken Caesar Salad": {
          note: "Baby gem, rustic croutons, parmesan cheese and crispy parmesan (GF Available)"
        },
        "Sirloin Steak": {
          note: "Flat mushroom, tomato, hand cut chips and salad (GF)",
          choices: {
            "Cook": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
            "Sauce": ["No Sauce", "Blue Cheese Glaze", "Green Peppercorn", "Cowboy Butter", "Garlic Butter"]
          }
        },
        "Ribeye Steak": {
          note: "Flat mushroom, tomato, hand cut chips and salad (GF)",
          choices: {
            "Cook": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
            "Sauce": ["No Sauce", "Blue Cheese Glaze", "Green Peppercorn", "Cowboy Butter", "Garlic Butter"]
          }
        },
        "Fillet Steak": {
          note: "Flat mushroom, tomato, hand cut chips and salad (GF)",
          choices: {
            "Cook": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
            "Sauce": ["No Sauce", "Blue Cheese Glaze", "Green Peppercorn", "Cowboy Butter", "Garlic Butter"]
          }
        }
      },
      "Sides": {
        "French Fries": {},
        "Sweet Potato Fries": {},
        "Bread & Butter": {},
        "Chips": {},
        "Garlic Mushrooms": {},
        "Dressed Salad": {},
        "Coleslaw": {},
        "Onion Rings": {},
        "Truffle & Parmesan Fries": {},
        "Pot of Gravy": {},
        "Garlic Bread Slice": {},
        "Cheesy Garlic Bread": {}
      }
    }
  },

  "Evening": {
    icon: "🌙",
    sections: {
      "Starters": {
        "Smoked Trout": {
          note: "Citrus dill mayonnaise, Yorkshire pudding and watercress"
        },
        "Breakfast Scotch Egg": {
          note: "Homemade hash browns and ketchup (GF Available)"
        },
        "Salt Baked Rainbow Beetroot": {
          note: "Goats cheese, honey mousse and candied walnuts (V)(GF)"
        },
        "Pan Fried Garlic Mushroom": {
          note: "Crispy bruschetta, pesto and parmesan (GF Available)(V)"
        },
        "Soup of the Day": {
          note: "Ask team for today's soup (GF Available)",
          choices: {
            "Bread": ["White Roll", "Granary Roll"]
          }
        }
      },
      "Mains": {
        "Beer Battered Traditional Haddock": {
          note: "Double-cooked chips, charred lemon, tartar sauce (GF Available)",
          choices: {
            "Peas": ["Mushy Peas", "Garden Peas"],
            "Tartar": ["Tartar Sauce", "No Tartar Sauce"]
          }
        },
        "Double 4oz Cheese Burger": {
          note: "Pickles, tomatoes, lettuce, onion rings, chips, coleslaw (GF Available)",
          choices: {
            "Cheese": ["Monterey Jack", "Blue Cheese"]
          }
        },
        "Traditional Scampi": {
          note: "Double-cooked chips, charred lemon, tartar sauce (GF Available)",
          choices: {
            "Peas": ["Mushy Peas", "Garden Peas"],
            "Tartar": ["Tartar Sauce", "No Tartar Sauce"]
          }
        },
        "Beef Bourguignon": {
          note: "Dauphinoise potatoes, green beans, thyme, bacon and onion gravy (GF Available)"
        },
        "Marinated Pepper Rigatoni": {
          note: "Basil, pesto, cracked black pepper and rigatoni (V)(VE Available)"
        },
        "Steak and Ale Pie": {
          note: "Chips, mushy peas and gravy"
        },
        "Beef Wellington": {
          note: "Roasted carrots, shallots, dauphinoise potatoes, chips and cherry jus"
        },
        "Pan Fried Duck Breast": {
          note: "Blood orange and beetroot puree, fondant potato and five spice jus"
        },
        "Crispy Belly Pork": {
          note: "Sweet potato puree, pak choi, black pudding bon bon, peanut butter soy jus"
        },
        "Pan Fried Crispy Pancetta": {
          note: "King prawn carbonara and pan fried sea bass"
        },
        "Sirloin Steak": {
          note: "Flat mushroom, tomato, hand cut chips and salad (GF)",
          choices: {
            "Cook": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
            "Sauce": ["No Sauce", "Blue Cheese Glaze", "Green Peppercorn", "Cowboy Butter", "Garlic Butter"]
          }
        },
        "Ribeye Steak": {
          note: "Flat mushroom, tomato, hand cut chips and salad (GF)",
          choices: {
            "Cook": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
            "Sauce": ["No Sauce", "Blue Cheese Glaze", "Green Peppercorn", "Cowboy Butter", "Garlic Butter"]
          }
        },
        "Fillet Steak": {
          note: "Flat mushroom, tomato, hand cut chips and salad (GF)",
          choices: {
            "Cook": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
            "Sauce": ["No Sauce", "Blue Cheese Glaze", "Green Peppercorn", "Cowboy Butter", "Garlic Butter"]
          }
        }
      },
      "Sides": {
        "French Fries": {},
        "Sweet Potato Fries": {},
        "Bread & Butter": {},
        "Chips": {},
        "Garlic Mushrooms": {},
        "Dressed Salad": {},
        "Coleslaw": {},
        "Onion Rings": {},
        "Truffle & Parmesan Fries": {},
        "Pot of Gravy": {},
        "Garlic Bread Slice": {},
        "Cheesy Garlic Bread": {}
      }
    }
  },

  "Desserts": {
    icon: "🍰",
    sections: {
      "Desserts": {
        "White Chocolate and Blueberry Blondie": {
          note: "Strawberry coulis and Strawberry Sensation ice cream"
        },
        "Venney's Cheesecake": {
          note: "Ask team for today's flavour"
        },
        "Venney's Pavlova": {
          note: "Ask team for today's flavour"
        },
        "Sticky Toffee Pudding": {
          note: "Butterscotch sauce and vanilla ice cream (V)"
        },
        "Baked Alaska": {
          note: "Served with wild berry"
        }
      }
    }
  },

  "Children's": {
    icon: "🧒",
    sections: {
      "Children's Mains": {
        "Chicken Nuggets": {
          note: "Served with chips (GF Available)",
          choices: {
            "Side": ["Beans", "Peas"]
          }
        },
        "Chicken Burger": {
          note: "Served with chips (GF Available)",
          choices: {
            "Side": ["Beans", "Peas"]
          }
        },
        "Linguine with Beef Bolognaise": {},
        "Fresh Haddock Goujons": {
          note: "Served with chips (GF Available)",
          choices: {
            "Side": ["Beans", "Peas"]
          }
        },
        "Quorn Sausage": {
          note: "Served with chips (GF)(VE)",
          choices: {
            "Side": ["Beans", "Peas"]
          }
        }
      }
    }
  },

  "Sunday": {
    icon: "🥩",
    sections: {
      "Starters": {
        "Prawn and Crayfish Cocktail": {
          note: "Marie rose sauce, iceberg lettuce, fresh lemon and a granary roll"
        },
        "Halloumi Fries": {
          note: "With siracha mayonnaise"
        },
        "Dressed Crab": {
          note: "With dill and citrus mayonnaise"
        }
      },
      "Roast Dinners": {
        "Slow Roasted Beef Dinner": {
          note: "Yorkshire pudding, stuffing, mash, roast potatoes, parsnip, carrot, cabbage, gravy"
        },
        "Roast Chicken Breast Dinner": {
          note: "Yorkshire pudding, stuffing, mash, roast potatoes, parsnip, carrot, cabbage, gravy"
        },
        "Roasted Pork Loin Dinner": {
          note: "Yorkshire pudding, stuffing, mash, roast potatoes, parsnip, carrot, cabbage, gravy"
        },
        "Quorn Sausage Dinner": {
          note: "Yorkshire pudding, stuffing, mash, roast potatoes, parsnip, carrot, cabbage, gravy"
        },
        "Lincolnshire Sausage Dinner": {
          note: "Yorkshire pudding, stuffing, mash, roast potatoes, parsnip, carrot, cabbage, gravy"
        }
      },
      "Other Mains": {
        "Traditional Haddock": {
          note: "Hand cut chips, tartar sauce and lemon wedge",
          choices: {
            "Peas": ["Garden Peas", "Mushy Peas"]
          }
        },
        "1/2 Traditional Haddock": {
          note: "Hand cut chips, tartar sauce and lemon wedge",
          choices: {
            "Peas": ["Garden Peas", "Mushy Peas"]
          }
        },
        "Scampi": {
          note: "Hand cut chips, tartar sauce and lemon wedge",
          choices: {
            "Peas": ["Garden Peas", "Mushy Peas"]
          }
        },
        "1/2 Scampi": {
          note: "Hand cut chips, tartar sauce and lemon wedge",
          choices: {
            "Peas": ["Garden Peas", "Mushy Peas"]
          }
        }
      },
      "Sunday Sides": {
        "Yorkshire Pudding": {},
        "Stuffing": {},
        "Cauliflower Cheese": {},
        "Roast Potatoes": {},
        "Buttered Vegetables": {}
      }
    }
  }

};
