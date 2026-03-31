const MENUS = {
  Drinks: {
    icon: "🍷",
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      start: "00:00",
      end: "23:00",
    },
    sections: {
      "Soft Drinks": {
        subsections: {
          Common: {
            Pepsi: {
              choices: {
                Size: ["Regular", "Pint"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Pepsi Max": {
              choices: {
                Size: ["Regular", "Pint"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Tango: {
              choices: {
                Size: ["Regular", "Pint"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Lemonade: {
              choices: {
                Size: ["Regular", "Pint"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Cordial: {
              choices: {
                Flavour: ["Lime", "Blackcurrant", "Orange"],
                Mixer: ["Water", "Soda", "Lemonade"],
                Size: ["Pint", "Half Pint"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Fresh Juice": {
              choices: {
                Flavour: ["Orange", "Cranberry", "Apple", "Pineapple"],
                Ice: ["Ice", "No Ice"],
              },
            },
          },
          Bottles: {
            J2O: {
              choices: {
                Flavour: [
                  "Apple & Raspberry",
                  "Orange & Passionfruit",
                  "Apple & Mango",
                  "Dragon Berry",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Coca-Cola": {
              choices: {
                Ice: ["Ice", "No Ice"],
              },
            },
            "Coke Zero": {
              choices: {
                Ice: ["Ice", "No Ice"],
              },
            },
            "Diet Coke": {
              choices: {
                Ice: ["Ice", "No Ice"],
              },
            },
            "Britvic Orange": {
              choices: {
                Ice: ["Ice", "No Ice"],
              },
            },
            "Britvic Lemon": {
              choices: {
                Ice: ["Ice", "No Ice"],
              },
            },
            Appletiser: {
              choices: {
                Ice: ["Ice", "No Ice"],
              },
            },
            Harrowgate: {
              choices: {
                Type: ["Still", "Sparkling"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Fruit Shoot": {
              choices: {
                Flavour: [
                  "Summer Fruits",
                  "Orange & Apple",
                  "Apple & Blackcurrant",
                ],
              },
            },
          },
          "London Essence": {
            Tonic: {},
            "London Essence Lemonade": {},
            "Ginger Ale": {},
            "White Peach": {},
            "Raspberry & Rose": {},
            "Orange & Elderflower": {},
          },
        },
      },
      "Beer/Cider": {
        subsections: {
          Draught: {
            Carling: {
              choices: {
                Type: [
                  "Pint",
                  "Half Pint",
                  "Shandy",
                  "Half Shandy",
                  "Top",
                  "Half Top",
                ],
              },
            },
            Staropramen: {
              choices: {
                Type: [
                  "Pint",
                  "Half Pint",
                  "Shandy",
                  "Half Shandy",
                  "Top",
                  "Half Top",
                ],
              },
            },
            Madri: {
              choices: {
                Type: [
                  "Pint",
                  "Half Pint",
                  "Shandy",
                  "Half Shandy",
                  "Top",
                  "Half Top",
                ],
              },
            },
            Guinness: {
              choices: { Type: ["Pint", "Half Pint"] },
            },
            Worthingtons: {
              choices: {
                Type: [
                  "Pint",
                  "Half Pint",
                  "Shandy",
                  "Half Shandy",
                  "Top",
                  "Half Top",
                ],
              },
            },
            Alpacalypse: {
              choices: {
                Type: [
                  "Pint",
                  "Half Pint",
                  "Shandy",
                  "Half Shandy",
                  "Top",
                  "Half Top",
                ],
              },
            },
          },
          Bottles: {
            "Hawkstone Hedgerow": {},
            "Hawkstone Cider": {},
            "Hawkstone Lager": {},
            "Hawkstone Session": {},
            "Hawkstone Pils": {},
            Desperados: {},
            Rekorderlig: {
              choices: {
                Flavour: ["Strawberry & Lime", "Wild Berries"],
              },
            },
            "Smirnoff Ice": {},
            Peroni: {
              choices: {
                Type: ["Normal", "Gluten-Free"],
              },
            },
            "Atlantic Pale Ale": {},
            "WKD Blue": {},
            "Doom Bar": {},
            "Timothy Taylor's": {},
            Budweiser: {},
          },
        },
      },
      Wine: {
        subsections: {
          Glass: {
            "Sauvignon Blanc": {
              choices: {
                Size: ["175ml", "250ml"],
                Spritzer: ["Lemonade", "Soda"],
              },
            },
            "Pinot Grigio": {
              choices: {
                Size: ["175ml", "250ml"],
                Spritzer: ["Lemonade", "Soda"],
              },
            },
            Chardonnay: {
              choices: {
                Size: ["175ml", "250ml"],
                Spritzer: ["Lemonade", "Soda"],
              },
            },
            Zinfandel: {
              choices: {
                Size: ["175ml", "250ml"],
                Spritzer: ["Lemonade", "Soda"],
              },
            },
            "Pinot Blush": {
              choices: {
                Size: ["175ml", "250ml"],
                Spritzer: ["Lemonade", "Soda"],
              },
            },
            Merlot: {
              choices: {
                Size: ["175ml", "250ml"],
              },
            },
            Shiraz: {
              choices: {
                Size: ["175ml", "250ml"],
              },
            },
            Malbec: {
              choices: {
                Size: ["175ml", "250ml"],
              },
            },
            "Prosecco Doc": {},
          },
          Bottle: {
            "Sauvignon Blanc": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Pinot Grigio": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            Chardonnay: {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            Zinfandel: {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Pinot Blush": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            Merlot: {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            Shiraz: {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            Malbec: {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            Prosecco: {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Neptune Point Sauvignon Blanc": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Domaine la Baurne Viognier": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Petit Chablis": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Coles de Provence Rosé": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Crianza Rioja": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Bon Courage Carbernet Sauvignon": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Neptune Point Pinot Noir": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Pasqua Valpolicella": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Prosecco Rosé": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
          },
          Champgane: {
            "Jules Feraud NV": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Moet & Chandon Brut Imperial": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
            "Bollinger Special Cuvee NV": {
              choices: {
                Glasses: ["1", "2", "3", "4", "5", "6", "7", "8"],
              },
            },
          },
        },
      },
      "Hot Drinks": {
        Espresso: {},
        "Black Americano": {},
        "White Coffee": {},
        "Flat White": {},
        Cappuccino: {},
        Latte: {},
        Mocha: {},
        Chocolatte: {},
        "Pot of Tea": {
          choices: { Amount: ["1 Person", "2 People"] },
        },
        "Flavoured Tea": {
          choices: {
            Flavour: ["Earl Grey", "Green Tea", "Camomile", "Peppermint"],
            Amount: ["1 Person", "2 People"],
          },
        },
        "Hot Chocolate": {},
        "Jug of Cream": {},
        "Jug of Milk": {},
        Syrup: {
          choices: {
            Flavour: ["Hazelnut", "Vanilla", "Caramel", "Coconut"],
          },
        },
      },
      Spirits: {
        subsections: {
          Vodka: {
            "Smirnoff Red": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Smirnoff Mango & Passionfruit": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Absolut: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Absolut Vanilla": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Absolut Citron": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Hawkstone Vodka": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
          },
          Gin: {
            "Hawkstone Gin": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            Burleigh: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            Hendricks: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Tanqueray Dry": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Tanqueray Seville": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Bombay Sapphire": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Chase Marmalade": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            "WN Raspberry": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            "WN Ginger & Rhubarb": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            "WN Black Cherry": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Gordon's": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Gordon's Pink": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Gordon's Lemon": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Gordon's Sloe": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: [
                  "Lemonade",
                  "Tonic",
                  "London Essence Lemonade",
                  "Ginger Ale",
                ],
                Ice: ["Ice", "No Ice"],
              },
            },
          },
          Rum: {
            Bumbu: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Kraken: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Twin Fin": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Captain Morgan's Tiki": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Captain Morgan's": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Captain Morgan's Dark": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Bacardi: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Malibu: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
          },
          Whisky: {
            "Isle of Jura": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Naked Grouse": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Monkey Shoulder": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Jameson: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Bell's": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Jack Daniel's": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Jack Daniel's Honey": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Southern Comfort": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade"],
                Ice: ["Ice", "No Ice"],
              },
            },
          },
          "General Spirits": {
            Archers: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Tia Maria": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Baileys: {
              choices: {
                Ice: ["Ice", "No Ice"],
              },
            },
            Disaronno: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Martini: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Limoncello: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Pimms: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            Jagermeister: {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
          },
          Shots: {
            Tequila: {},
            "Tequila Rose": {},
            Sourz: {
              choices: {
                Flavour: ["Raspberry", "Strawberry"],
              },
            },
            Sambuca: {
              choices: {
                Flavour: ["Black", "Cherry"],
              },
            },
          },
          Brandy: {
            "Martel Cognac": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Three Barrels": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
            "Cherry Brandy": {
              choices: {
                Measure: ["Single", "Double"],
                Mixer: ["Pepsi", "Pepsi Max", "Lemonade", "Tango"],
                Ice: ["Ice", "No Ice"],
              },
            },
          },
        },
      },
      Tails: {
        subsections: {
          Cocktails: {
            "Pornstar Martini": {},
            "Raspberry Cola Cube": {},
            "Espresso Martini": {},
            "Aperol Spritz": {},
            "Glitter Bomb": {},
            "Pina Colada": {},
            "Sex on the Beach": {},
            Mojito: {
              choices: {
                Intensity: ["Sweet", "Dry"],
              },
            },
            "Passionfruit Mojito": {
              choices: {
                Intensity: ["Sweet", "Dry"],
              },
            },
          },
          "Mocktails 🔞": {
            "Oceana Colada": {},
            "Naked Pornstar": {},
            Nojito: {
              choices: {
                Intensity: ["Sweet", "Dry"],
              },
            },
            "Passionfruit Nojito": {
              choices: {
                Intensity: ["Sweet", "Dry"],
              },
            },
          },
          Kidtails: {
            "Candy Colada": {},
            "Berry Delight": {},
            "Blue Tornado": {},
          },
        },
      },
      "Non-Alcoholic": {
        "Doom Bar 0%": {},
        "Madri 0%": {},
        "Guinness 0%": {},
        "Peroni 0%": {},
        "Corona Cero": {},
        "Kopparberg 0%": {
          choices: {
            Flavour: ["Pear", "Mixed Berries"],
          },
        },
      },
    },
  },

  Breakfast: {
    icon: "🍳",
    availability: {
      days: ["Sat", "Sun"],
      start: "09:00",
      end: "11:30",
    },
    sections: {
      "Main Bites": {
        "Venney's Large Breakfast": {
          price: 14.0,
          dietary: ["GFA"],
          choices: { Eggs: ["Fried", "Scrambled", "Poached"] },
        },
        "Venney's Small Breakfast": {
          price: 11.0,
          dietary: ["GFA"],
          choices: { Eggs: ["Fried", "Scrambled", "Poached"] },
        },
        "Venney's Vegetarian Breakfast": {
          price: 14.0,
          dietary: ["V", "GF"],
          choices: { Eggs: ["Fried", "Scrambled", "Poached"] },
        },
        "Venney's Vegan Breakfast": { price: 14.0, dietary: ["VG", "GF"] },
        "Eggs Benedict": { price: 10.0 },
        "Eggs on Toast": {
          price: 6.0,
          dietary: ["V"],
          choices: { Eggs: ["Poached", "Scrambled", "Fried"] },
        },
        "Spiced Avocado & Egg Muffins": { price: 9.0, dietary: ["V"] },
        "Belgium Waffle": { price: 9.0, dietary: ["V"] },
        "Sausage Bun": { price: 7.0, dietary: ["VGA"] },
        "Bacon Bun": { price: 7.0 },
        "Egg Bun": {
          price: 6.0,
          dietary: ["V"],
          choices: { Eggs: ["Fried", "Scrambled", "Poached"] },
        },
        "Breakfast Bun": { price: 9.0 },
        "Greek Yoghurt with Granola": { price: 7.0, dietary: ["V"] },
      },
      "Extra's": {
        Sausage: { price: 1.5 },
        Bacon: { price: 1.5 },
        "Baked Beans": { price: 1.5, dietary: ["V", "VG", "GF"] },
        "Black Pudding": { price: 1.5 },
        "Fried Egg": { price: 1.5, dietary: ["V", "GF"] },
        Tomato: { price: 1.5, dietary: ["V", "VG", "GF"] },
        Mushroom: { price: 1.5, dietary: ["V", "VG", "GF"] },
        "Tater Tots": { price: 1.5, dietary: ["V", "VG"] },
        Toast: { price: 1.5, dietary: ["V"] },
        "Fried Bread": { price: 1.5, dietary: ["V"] },
        "Bread and Butter": { price: 1.5, dietary: ["V"] },
        Jam: { price: 1.5, dietary: ["V", "VG", "GF"] },
        Marmalade: { price: 1.5, dietary: ["V", "VG", "GF"] },
      },
    },
  },

  Lunch: {
    icon: "☀️",
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      start: "12:00",
      end: "16:00",
    },
    sections: {
      "Classic Mains": {
        "Beer Battered Traditional Haddock": {
          price: 19.0,
          dietary: ["GFA"],
          choices: {
            Peas: ["Mushy Peas", "Garden Peas"],
            Tartar: ["Tartar", "No Tartar"],
          },
        },
        "Small Traditional Haddock": {
          price: 14.0,
          dietary: ["GFA"],
          choices: {
            Peas: ["Mushy Peas", "Garden Peas"],
            Tartar: ["Tartar", "No Tartar"],
          },
        },
        "Traditional Scampi": {
          price: 19.0,
          dietary: ["GFA"],
          choices: {
            Peas: ["Mushy Peas", "Garden Peas"],
            Tartar: ["Tartar", "No Tartar"],
          },
        },
        "Small Traditional Scampi": {
          price: 14.0,
          dietary: ["GFA"],
          choices: {
            Peas: ["Mushy Peas", "Garden Peas"],
            Tartar: ["Tartar", "No Tartar"],
          },
        },
        "Steak and Ale Pie": { price: 22.0 },
        "Marinated Pepper Rigatoni": { price: 19.0, dietary: ["V", "VGA"] },
      },
      "Fresh Sandwiches": {
        "Tuna Mayo": {
          price: 12.0,
          dietary: ["GFA"],
          choices: {
            Bread: ["Farmhouse", "White"],
            Side: ["Chips", "Crisps"],
          },
        },
        "Chicken, Bacon and Mayo": {
          price: 12.0,
          dietary: ["GFA"],
          choices: {
            Bread: ["Farmhouse", "White"],
            Side: ["Chips", "Crisps"],
          },
        },
        "Prawn Maryrose": {
          price: 12.0,
          dietary: ["GFA"],
          choices: {
            Bread: ["Farmhouse", "White"],
            Side: ["Chips", "Crisps"],
          },
        },
        "Cheese and Pickle": {
          price: 12.0,
          dietary: ["V", "GFA"],
          choices: {
            Bread: ["Farmhouse", "White"],
            Side: ["Chips", "Crisps"],
          },
        },
        "Fish Finger & Tartar Sauce": {
          price: 12.0,
          dietary: ["GFA"],
          choices: {
            Bread: ["Farmhouse", "White"],
            Side: ["Chips", "Crisps"],
          },
        },
        "Classic Club Sandwich": {
          price: 14.0,
          dietary: ["GFA"],
          choices: {
            Bread: ["Farmhouse", "White"],
            Side: ["Chips", "Crisps"],
          },
        },
        "Bacon, Lettuce and Tomato": {
          price: 14.0,
          dietary: ["GFA"],
          choices: {
            Bread: ["Farmhouse", "White"],
            Side: ["Chips", "Crisps"],
          },
        },
      },
      "Baked Potatoes": {
        "Cheese and Pickle": { price: 12.0, dietary: ["V", "GFA"] },
        "Cheese and Beans": { price: 12.0, dietary: ["V", "GFA"] },
        "Tuna Mayo": { price: 12.0, dietary: ["GFA"] },
      },
      "Lighter Bites": {
        "Caesar Salad": { price: 16.0 },
        "Breakfast Scotch Egg": { price: 9.0 },
        "Soup of the Day": {
          price: 9.0,
          dietary: ["VG", "GFA"],
          choices: { Bread: ["White Roll", "Granary Roll"] },
        },
      },
    },
  },

  Evening: {
    icon: "🌙",
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      start: "16:00",
      end: "20:15",
    },
    sections: {
      Starters: {
        "Smoked Trout": { price: 12.0 },
        "Breakfast Scotch Egg": { price: 9.0 },
        "Salt Baked Rainbow Beetroot": { price: 9.0, dietary: ["V", "GF"] },
        "Pan Fried Garlic Mushroom": { price: 9.0, dietary: ["V", "GFA"] },
        "Soup of the Day": {
          price: 9.0,
          dietary: ["GFA"],
          choices: { Bread: ["White Roll", "Granary Roll"] },
        },
      },
      "Classic Mains": {
        "Beer Battered Traditional Haddock": {
          price: 19.0,
          dietary: ["GFA"],
          choices: {
            Peas: ["Mushy Peas", "Garden Peas"],
            Tartar: ["Tartar", "No Tartar"],
          },
        },
        "Double 4oz Cheese Burger": {
          price: 20.0,
          choices: { Cheese: ["Monterey Jack", "Blue Cheese"] },
        },
        "Traditional Scampi": {
          price: 19.0,
          dietary: ["GFA"],
          choices: {
            Peas: ["Mushy Peas", "Garden Peas"],
            Tartar: ["Tartar", "No Tartar"],
          },
        },
        "Beef Bourguignon": { price: 24.0, dietary: ["GFA"] },
        "Marinated Pepper Rigatoni": { price: 19.0, dietary: ["V", "VGA"] },
        "Steak and Ale Pie": { price: 22.0 },
      },
      "A Lá Carte": {
        "Beef Wellington": { price: 37.0 },
        "Pan Fried Duck Breast": { price: 28.0 },
        "Crispy Belly Pork": { price: 25.0 },
        "Pan Fried Crispy Pancetta": { price: 28.0 },
      },
      Steaks: {
        "Sirloin Steak": {
          price: 26.0,
          dietary: ["GF"],
          choices: {
            Rarity: [
              "Rare",
              "Medium Rare",
              "Medium",
              "Medium Well",
              "Well Done",
            ],
            Sauce: [
              "No Sauce",
              "Blue Cheese Glaze (+£3)",
              "Peppercorn Sauce (+£3)",
              "Cowboy Butter (+£3)",
              "Garlic Butter (+£3)",
            ],
          },
        },
        "Rib-eye Steak": {
          price: 27.0,
          dietary: ["GF"],
          choices: {
            Rarity: [
              "Rare",
              "Medium Rare",
              "Medium",
              "Medium Well",
              "Well Done",
            ],
            Sauce: [
              "No Sauce",
              "Blue Cheese Glaze (+£3)",
              "Peppercorn Sauce (+£3)",
              "Cowboy Butter (+£3)",
              "Garlic Butter (+£3)",
            ],
          },
        },
        "Fillet Steak": {
          price: 35.0,
          dietary: ["GF"],
          choices: {
            Rarity: [
              "Rare",
              "Medium Rare",
              "Medium",
              "Medium Well",
              "Well Done",
            ],
            Sauce: [
              "No Sauce",
              "Blue Cheese Glaze (+£3)",
              "Peppercorn Sauce (+£3)",
              "Cowboy Butter (+£3)",
              "Garlic Butter (+£3)",
            ],
          },
        },
      },
      "Side Dishes": {
        "French Fries": { price: 3.5, dietary: ["V", "VG", "GF"] },
        "Sweet Potato Fries": { price: 3.95, dietary: ["V", "VG", "GF"] },
        "Bread & Butter": { price: 1.95, dietary: ["V"] },
        Chips: { price: 3.5, dietary: ["V", "VG", "GF"] },
        "Garlic Mushrooms": { price: 3.5, dietary: ["V", "GF"] },
        "Dressed Salad": { price: 3.0, dietary: ["V", "VG", "GF"] },
        Coleslaw: { price: 3.0, dietary: ["V", "GF"] },
        "Onion Rings": { price: 4.95, dietary: ["V"] },
        "Truffle & Parmesan Fries": { price: 4.95, dietary: ["V", "GF"] },
        "Pot of Gravy": { price: 1.5, dietary: ["GF"] },
        "Garlic Bread Slice": { price: 1.5, dietary: ["V"] },
        "Cheesy Garlic Bread": { price: 2.0, dietary: ["V"] },
      },
    },
  },

  Desserts: {
    icon: "🍰",
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      start: "00:00",
      end: "20:15",
    },
    sections: {
      Desserts: {
        "White Chocolate and Blueberry Blondie": {
          price: 10.0,
        },
        "Venney's Cheesecake": {
          price: 10.0,
        },
        "Venney's Pavlova": {
          price: 10.0,
        },
        "Sticky Toffee Pudding": {
          dietary: ["V"],
          price: 10.0,
        },
        "Baked Alaska": {
          price: 10.0,
        },
        "Ice Cream": {
          price: 2.5,
          scoopBuilder: {
            maxScoops: 4,
            flavours: [
              "Vanilla",
              "Strawberry",
              "Mint-Choc Chip",
              "Chocolate",
              "Raspberry Cheesecake",
              "Honeycomb",
              "Cookie Dough",
              "Cherry Chocolate",
              "Rum & Raisin",
              "Salted Caramel",
            ],
          },
        },
        Sorbet: {
          dietary: ["VE", "GF"],
          price: 2.5,
          scoopBuilder: {
            maxScoops: 2,
            flavours: ["Raspberry", "Mango"],
          },
        },
      },
    },
  },

  "Children's": {
    icon: "🧒",
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      start: "09:00",
      end: "20:15",
    },
    sections: {
      "Main's": {
        "Chicken Nuggets": {
          price: 9.0,
          dietary: ["GFA"],
          choices: { Side: ["Beans", "Peas"] },
        },
        "Chicken Burger": {
          price: 9.0,
          dietary: ["GFA"],
          choices: { Side: ["Beans", "Peas"] },
        },
        "Linguini with Beef Bolognaise": { price: 9.0 },
        "Fresh Haddock Goujons": {
          price: 9.0,
          dietary: ["GFA"],
          choices: { Side: ["Beans", "Peas"] },
        },
        "Quorn Sausage": {
          price: 9.0,
          dietary: ["V", "VG", "GF"],
          choices: { Side: ["Beans", "Peas"] },
        },
      },
      "Children's Drink's": {
        "Fruit Shoot": {
          price: 2.95,
          dietary: ["V", "VG", "GF"],
          choices: {
            Flavour: ["Orange", "Apple & Blackcurrant", "Summer Fruits"],
          },
        },
        "Blue Tornado": { price: 4.95, dietary: ["V", "VG", "GF"] },
        CandyColada: { price: 4.95, dietary: ["V", "VG", "GF"] },
        "Berry Delight": { price: 4.95, dietary: ["V", "VG", "GF"] },
      },
      "Children's Desserts": {
        "Ice Cream": {
          price: 2.5,
          dietary: ["V", "GF"],
          choices: { Flavour: ["Vanilla", "Strawberry", "Chocolate"] },
        },
        Sorbets: {
          price: 2.5,
          dietary: ["V", "VG"],
          choices: { Flavour: ["Raspberry", "Mango"] },
        },
      },
    },
  },

  Sunday: {
    icon: "🥩",
    availability: {
      days: ["Sun"],
      start: "12:00",
      end: "18:15",
    },
    sections: {
      Starters: {
        "Smoked Trout": { price: 12.0 },
        "Soup of the Day": {
          price: 9.0,
          dietary: ["GF"],
          choices: { Bread: ["White Roll", "Granary Roll"] },
        },
        "Pan Fried Garlic Mushrooms": { price: 9.0, dietary: ["V"] },
      },
      Mains: {
        "Slow Roasted Sirloin Beef": { price: 20.0, dietary: ["GFA"] },
        "Roasted Chicken Breast": { price: 18.0, dietary: ["GFA"] },
        "Roasted Pork Loin": { price: 19.0, dietary: ["GFA"] },
        "Quorn Sausages": { price: 18.0, dietary: ["V", "GF", "VGA"] },
        "Lincolnshire Sausages": { price: 18.0 },
        "Traditional Haddock": {
          price: 19.0,
          dietary: ["GFA"],
          choices: {
            Peas: ["Mushy Peas", "Garden Peas"],
            Tartar: ["Tartar", "No Tartar"],
          },
        },
        "Small Traditional Haddock": {
          price: 14.0,
          dietary: ["GFA"],
          choices: {
            Peas: ["Mushy Peas", "Garden Peas"],
            Tartar: ["Tartar", "No Tartar"],
          },
        },
        Scampi: {
          price: 19.0,
          dietary: ["GFA"],
          choices: {
            Peas: ["Mushy Peas", "Garden Peas"],
            Tartar: ["Tartar", "No Tartar"],
          },
        },
        "Small Scampi": {
          price: 14.0,
          dietary: ["GFA"],
          choices: {
            Peas: ["Mushy Peas", "Garden Peas"],
            Tartar: ["Tartar", "No Tartar"],
          },
        },
        "Sweet Potato Roulade": { price: 18.0, dietary: ["V", "VG"] },
        "Steak and Ale Pie": { price: 22.0 },
        "Venney's Children's Roast": {
          price: 14.0,
          choices: {
            Meat: [
              "Roasted Sirloin Beef (+£2)",
              "Roasted Pork Loin",
              "Chicken Breast",
              "Lincolnshire Sausages",
              "Quorn Sausages (V)",
            ],
          },
        },
      },
      "Side Dishes": {
        "Pot of Gravy": { price: 1.5, dietary: ["GF"] },
        Stuffing: { price: 2.0 },
        "Yorkshire Pudding": { price: 1.5, dietary: ["V"] },
        "Cauliflower Cheese": { price: 4.0, dietary: ["V", "GF"] },
        "Roast Potatoes": { price: 3.5, dietary: ["V", "VG", "GF"] },
        "Buttered Vegetables": { price: 4.0, dietary: ["V", "GF"] },
      },
    },
  },
};
