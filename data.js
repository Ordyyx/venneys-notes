const MENUS = {
  "Drinks": {
    icon: "🍷",
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      start: "00:00",
      end: "23:00"
    },
    sections: {
      "Soft Drinks": {
        subsections: {
          "Common": {
            "Pepsi": {
              choices: {
                "Size": ["Regular", "Pint"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Pepsi Max": {
              choices: {
                "Size": ["Regular", "Pint"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Tango": {
              choices: {
                "Size": ["Regular", "Pint"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Lemonade": {
              choices: {
                "Size": ["Regular", "Pint"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Cordial": {
              choices: {
                "Flavour": ["Lime", "Blackcurrant", "Orange"],
                "Mixer": ["Water", "Soda", "Lemonade"],
                "Size": ["Pint", "Half Pint"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Fresh Juice": {
              choices: {
                "Flavour": ["Orange", "Cranberry", "Apple", "Pineapple"],
                "Ice": ["Ice", "No Ice"]
              }
            }
          },
          "Bottles": {
            "J2O": {
              choices: {
                "Flavour": ["Apple & Raspberry", "Orange & Passionfruit", "Apple & Mango", "Dragon Berry"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Coca-Cola": {
              choices: {
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Coke Zero": {
              choices: {
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Diet Coke": {
              choices: {
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Britvic Orange": {
              choices: {
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Britvic Lemon": {
              choices: {
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Appletiser": {
              choices: {
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Harrowgate": {
              choices: {
                "Type": ["Still", "Sparkling"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Fruit Shoot": {
              choices: {
                "Flavour": ["Summer Fruits", "Orange & Apple", "Apple & Blackcurrant"]
              }
            }
          },
          "London Essence": {
            "Tonic": {},
            "London Essence Lemonade": {},
            "Ginger Ale": {},
            "White Peach": {},
            "Raspberry & Rose": {},
            "Orange & Elderflower": {},
          }
        }
      },
      "Draught": {
        "Carling": {
          choices: { "Type": ["Pint", "Half Pint", "Shandy", "Half Shandy", "Top", "Half Top"] }
        },
        "Staropramen": {
          choices: { "Type": ["Pint", "Half Pint", "Shandy", "Half Shandy", "Top", "Half Top"] }
        },
        "Madri": {
          choices: { "Type": ["Pint", "Half Pint", "Shandy", "Half Shandy", "Top", "Half Top"] }
        },
        "Guinness": {
          choices: { "Type": ["Pint", "Half Pint"] }
        },
        "Worthingtons": {
          choices: { "Type": ["Pint", "Half Pint", "Shandy", "Half Shandy", "Top", "Half Top"] }
        },
        "Alpacalypse": {
          choices: { "Type": ["Pint", "Half Pint", "Shandy", "Half Shandy", "Top", "Half Top"] }
        }
      },
      "Bottles": {
        "Hawkstone Hedgerow": {},
        "Hawkstone Cider": {},
        "Hawkstone Lager": {},
        "Hawkstone Session": {},
        "Hawkstone Pils": {},
        "Desperados": {},
        "Rekorderlig": {
          choices: {
            "Flavour": ["Strawberry & Lime", "Wild Berries"]
          }
        },
        "Smirnoff Ice": {},
        "Peroni": {
          choices: {
            "Type": ["Normal", "Gluten-Free"]
          }
        },
        "Atlantic Pale Ale": {},
        "WKD Blue": {},
        "Doom Bar": {},
        "Timothy Taylor's": {},
        "Budweiser": {},
      },
      "Hot Drinks": {
        "Espresso": {},
        "Black Americano": {},
        "White Coffee": {},
        "Flat White": {},
        "Cappuccino": {},
        "Latte": {},
        "Mocha": {},
        "Chocolatte": {},
        "Pot of Tea": {
          choices: {"Amount": ["1 Person", "2 People"]}
        },
        "Flavoured Tea": {
          choices: {
            "Flavour": ["Earl Grey", "Green Tea", "Camomile", "Peppermint"],
            "Amount": ["1 Person", "2 People"]
          }
        },
        "Hot Chocolate": {},
        "Jug of Cream": {},
        "Jug of Milk": {},
        "Syrup": {
          choices: {
            "Flavour": ["Hazelnut", "Vanilla", "Caramel", "Coconut"]
          }
        }
      },
      "Spirits": {
        subsections: {
          "Vodka": {
            "Smirnoff Red": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Smirnoff Mango & Passionfruit": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Absolut": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Absolut Vanilla": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Absolut Citron": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Hawkstone Vodka": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]
              }
            }
          },
          "Gin": {
            "Hawkstone Gin": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Burleigh": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Hendricks": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Tanqueray Dry": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Tanqueray Seville": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Bombay Sapphire": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Chase Marmalade": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "WN Raspberry": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "WN Ginger & Rhubarb": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "WN Black Cherry": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Gordon's": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Gordon's Pink": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Gordon's Lemon": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
            "Gordon's Sloe": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Lemonade", "Tonic", "London Essence Lemonade", "Ginger Ale"],
                "Ice": ["Ice", "No Ice"]
              }
            },
          },
          "Rum": {
            "Bumbu": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Kraken": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Twin Fin": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Captain Morgan's Tiki": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Captain Morgan's": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Captain Morgan's Dark": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Bacardi": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Malibu": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
          },
          "Whisky": {
            "Isle of Jura": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Naked Grouse": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Monkey Shoulder": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Jameson": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Bell's": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Jack Daniel's": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Jack Daniel's Honey": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
            "Southern Comfort": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade"],
                "Ice": ["Ice", "No Ice"]                
              }
            },
          },
          "General Spirits": {
            "Archers": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }              
            },
            "Tia Maria": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }              
            },
            "Baileys": {
              choices: {
                "Ice": ["Ice", "No Ice"]                
              }              
            },
            "Disaronno": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }              
            },            
            "Martini": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }              
            },            
            "Limoncello": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }              
            },            
            "Pimms": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }              
            },            
            "Jagermeister": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }              
            },            
          },
          "Shots": {
            "Tequila": {},
            "Tequila Rose": {},
            "Sourz": {
              choices: {
                "Flavour": ["Raspberry", "Strawberry"]
              }
            },
            "Sambuca": {
              choices:{
                "Flavour": ["Black", "Cherry"]
              }
            }
          },
          "Brandy": {
            "Martel Cognac": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }                 
            },
            "Three Barrels": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }                 
            },
            "Cherry Brandy": {
              choices: {
                "Measure": ["Single", "Double"],
                "Mixer": ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                "Ice": ["Ice", "No Ice"]                
              }                 
            },
          }
        }
      },
      "Cocktails": {
        "Pornstar Martini": {},
        "Raspberry Cola Cube": {},
        "Espresso Martini": {},
        "Aperol Spritz": {},
        "Glitter Bomb": {},
        "Pina Colada": {},
        "Sex on the Beach": {},
        "Mojito": {
          choices: {
            "Intensity": ["Sweet", "Dry"]
          }
        },
        "Passionfruit Mojito": {
          choices: {
            "Intensity": ["Sweet", "Dry"]
          }
        }
      },
      "Mocktails 🔞": {
        "Oceana Colada": {},
        "Naked Pornstar": {},
        "Nojito": {
          choices: {
            "Intensity": [ "Sweet", "Dry"]
          }
        },
        "Passionfruit Nojito": {
          choices: {
            "Intensity": ["Sweet", "Dry"]
          }
        }
      },
      "Kidtails": {
        "Candy Colada": {},
        "Berry Delight": {},
        "Blue Tornado": {}
      },
      "Non-Alcoholic": {
        "Doom Bar 0%": {},
        "Madri 0%": {},
        "Guinness 0%": {},
        "Peroni 0%": {},
        "Corona Cero": {},
        "Kopparberg 0%": {
          choices: {
            "Flavour": ["Pear", "Mixed Berries"]
          }
        },
      }
    }
  },

  "Breakfast": {
    icon: "🍳",
    availability: {
      days: ["Sat", "Sun"],
      start: "09:00",
      end: "11:30"
    },
    sections: {
      "Main Bites": {
        "Venney's Large Breakfast": {
          choices: { "Eggs": ["Fried", "Scrambled", "Poached"] }
        },
        "Venney's Small Breakfast": {
          choices: { "Eggs": ["Fried", "Scrambled", "Poached"] }
        },
        "Venney's Vegan Breakfast": {},
        "Venney's Vegetarian Breakfast": {
          choices: { "Eggs": ["Fried", "Scrambled", "Poached"] }
        },
        "Eggs Benedict": {},
        "Eggs on Toast": {
          choices: { "Eggs": ["Poached", "Scrambled", "Fried"] }
        },
        "Spiced Avocado & Egg Muffins": {},
        "Belgium Waffle": {},
        "Sausage Bun": {},
        "Bacon Bun": {},
        "Egg Bun": {
          choices: { "Eggs": ["Fried", "Scrambled", "Poached"] }
        },
        "Breakfast Bun": {},
        "Greek Yoghurt with Granola": {}
      },
      "Smoothies": {
        "Avo-Go-Go": {},
        "Pash-n-shoot": {},
        "The Big 4": {},
        "Coco Loco": {}
      }
    }
  },

  "Lunch": {
    icon: "☀️",
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      start: "12:00",
      end: "16:00"
    },
    sections: {
      "Starters": {
        "Smoked Trout": {},
        "Breakfast Scotch Egg": {},
        "Salt Baked Rainbow Beetroot": {},
        "Pan Fried Garlic Mushroom": {},
        "Soup of the Day": {
          choices: { "Bread": ["White Roll", "Granary Roll"] }
        }
      },
      "Mains": {
        "Beer Battered Traditional Haddock": {
          choices: {
            "Type": ["Battered", "Grilled"],
            "Peas": ["Mushy Peas", "Garden Peas"],
            "Chip": ["Chips", "Fries"],
            "Tartar": ["Tartar", "No Tartar"]
          }
        },
        "Original 8oz Burger": {},
        "Traditional Scampi": {
          choices: {
            "Type": ["Battered", "Grilled"],
            "Peas": ["Mushy Peas", "Garden Peas"],
            "Chip": ["Chips", "Fries"],
            "Tartar": ["Tartar", "No Tartar"]
          }
        },
        "Fish Platter": {
          choices: {
            "Type": ["Battered", "Grilled"],
            "Peas": ["Mushy Peas", "Garden Peas"],
            "Chip": ["Chips", "Fries"],
            "Tartar": ["Tartar", "No Tartar"]
          }
        },
        "Goat's Cheese Burger": {},
        "Steak & Ale Pie": {},
        "Beef Bourguignon": {},
        "Cumberland Pinwheel Sausage": {},
        "Marinated Pepper Rigatoni": {},
        "Chicken Caesar Salad": {},
        "Sirloin Steak": {
          choices: {
            "Rarity": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
            "Sauce": ["No Sauce", "Blue Cheese Glaze", "Green Peppercorn", "Cowboy Butter", "Garlic Butter"]
          }
        },
        "Ribeye Steak": {
          choices: {
            "Rarity": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
            "Sauce": ["No Sauce", "Blue Cheese Glaze", "Green Peppercorn", "Cowboy Butter", "Garlic Butter"]
          }
        },
        "Fillet Steak": {
          choices: {
            "Rarity": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
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
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      start: "16:00",
      end: "20:15"
    },
    sections: {
      "Starters": {
        "Smoked Trout": {},
        "Breakfast Scotch Egg": {},
        "Salt Baked Rainbow Beetroot": {},
        "Pan Fried Garlic Mushroom": {},
        "Soup of the Day": {
          choices: { "Bread": ["White Roll", "Granary Roll"] }
        }
      },
      "Mains": {
        "Beer Battered Traditional Haddock": {
          choices: {
            "Type": ["Battered", "Grilled"],
            "Peas": ["Mushy Peas", "Garden Peas"],
            "Chip": ["Chips", "Fries"],
            "Tartar": ["Tartar", "No Tartar"]
          }
        },
        "Double 4oz Cheese Burger": {
          choices: { "Cheese": ["Monterey Jack", "Blue Cheese"] }
        },
        "Traditional Scampi": {
          choices: {
            "Type": ["Battered", "Grilled"],
            "Peas": ["Mushy Peas", "Garden Peas"],
            "Chip": ["Chips", "Fries"],
            "Tartar": ["Tartar", "No Tartar"]
          }
        },
        "Beef Bourguignon": {},
        "Marinated Pepper Rigatoni": {},
        "Steak & Ale Pie": {},  
        "Beef Wellington": {},
        "Pan Fried Duck Breast": {},
        "Crispy Belly Pork": {},
        "Pan Fried Crispy Pancetta": {},
        "Fish Platter": {
          choices: {
            "Type": ["Battered", "Grilled"],
            "Peas": ["Mushy Peas", "Garden Peas"],
            "Chip": ["Chips", "Fries"],
            "Tartar": ["Tartar", "No Tartar"]
          }
        },
        "Goat's Cheese Burger": {},
        "Cumberland Pinwheel Sausage": {},
        "Chicken Caesar Salad": {},
        "Sirloin Steak": {
          choices: {
            "Rarity": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
            "Sauce": ["No Sauce", "Blue Cheese Glaze", "Green Peppercorn", "Cowboy Butter", "Garlic Butter"]
          }
        },
        "Ribeye Steak": {
          choices: {
            "Rarity": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
            "Sauce": ["No Sauce", "Blue Cheese Glaze", "Green Peppercorn", "Cowboy Butter", "Garlic Butter"]
          }
        },
        "Fillet Steak": {
          choices: {
            "Rarity": ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
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
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      start: "00:00",
      end: "20:15"
    },
    sections: {
      "Desserts": {
        "White Chocolate and Blueberry Blondie": {},
        "Venney's Cheesecake": {},
        "Venney's Pavlova": {},
        "Sticky Toffee Pudding": {},
        "Baked Alaska": {},
        "Ice Cream": {
          scoopBuilder: {
            maxScoops: 4,
            flavours: ["Vanilla", "Strawberry", "Mint-Choc Chip", "Chocolate", "Raspberry Cheesecake", "Honeycomb", "Cookie Dough", "Cherry Chocolate", "Rum & Raisin", "Salted Caramel"]
          }
        },
        "Sorbet": {
          scoopBuilder: {
            maxScoops: 2,
            flavours: ["Raspberry", "Mango"]
          }
        }
      }
    }
  },

  "Children's": {
    icon: "🧒",
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      start: "09:00",
      end: "20:15"
    },
    sections: {
      "Children's Mains": {
        "Chicken Nuggets": {
          choices: { "Side": ["Beans", "Garden Peas", "Mushy Peas"] }
        },
        "Chicken Burger": {
          choices: { "Side": ["Beans", "Garden Peas", "Mushy Peas"] }
        },
        "Linguine with Beef Bolognaise": {},
        "Fresh Haddock Goujons": {
          choices: { "Side": ["Beans", "Garden Peas", "Mushy Peas"] }
        },
        "Quorn Sausage": {
          choices: { "Side": ["Beans", "Garden Peas", "Mushy Peas"] }
        }
      }
    }
  },

  "Sunday": {
    icon: "🥩",
    availability: {
      days: ["Sun"],
      start: "12:00",
      end: "18:15"
    },
    sections: {
      "Starters": {
        "Prawn and Crayfish Cocktail": {},
        "Halloumi Fries": {},
        "Dressed Crab": {}
      },
      "Roast Dinners": {
        "Slow Roasted Beef Dinner": {},
        "Roast Chicken Breast Dinner": {},
        "Roasted Pork Loin Dinner": {},
        "Quorn Sausage Dinner": {},
        "Lincolnshire Sausage Dinner": {}
      },
      "Other Mains": {
        "Traditional Haddock": {
          choices: {
            "Type": ["Battered", "Grilled"],
            "Peas": ["Mushy Peas", "Garden Peas"],
            "Chip": ["Chips", "Fries"],
            "Tartar": ["Tartar", "No Tartar"]
          }
        },
        "1/2 Traditional Haddock": {
          choices: {
            "Type": ["Battered", "Grilled"],
            "Peas": ["Mushy Peas", "Garden Peas"],
            "Chip": ["Chips", "Fries"],
            "Tartar": ["Tartar", "No Tartar"]
          }
        },
        "Scampi": {
          choices: {
            "Type": ["Battered", "Grilled"],
            "Peas": ["Mushy Peas", "Garden Peas"],
            "Chip": ["Chips", "Fries"],
            "Tartar": ["Tartar", "No Tartar"]
          }
        },
        "1/2 Scampi": {
          choices: {
            "Type": ["Battered", "Grilled"],
            "Peas": ["Mushy Peas", "Garden Peas"],
            "Chip": ["Chips", "Fries"],
            "Tartar": ["Tartar", "No Tartar"]
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
