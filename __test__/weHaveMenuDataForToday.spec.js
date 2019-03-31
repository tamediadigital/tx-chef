const fn = require('../helpers/weHaveMenuDataForToday');

const fixture = [
    {
      "title": "Brasserie",
      "meals": {
        "2019-03-25": {
          "title": "Kalbsbrustbraten",
          "description": "(Schweiz) mit Balsamico-Jus, Lyonerkartoffeln und Gemüse",
          "prices": [
            "CHF 9.50",
            "CHF 13.50"
          ]
        },
        "2019-03-26": {
          "title": "ASIA WEK \"Pho Bo Ha Noi\"",
          "description": "Vietnamesische Nudelsuppe mit Rindfleisch (Schweiz), Reisnudeln und Kräutern",
          "prices": [
            "CHF 9.50",
            "CHF 13.50"
          ]
        },
        "2019-03-27": {
          "title": "Classic Edition",
          "description": "Aargauer Bauern-Schweinsbratwurst an Zwiebelsauce, dazu knusprige  Rösti und grüne Bohnen",
          "prices": [
            "CHF 9.50",
            "CHF 13.50"
          ]
        },
        "2019-03-28": {
          "title": "ASIA WEEK Indonesian",
          "description": "Chicken Satay Pouletspiessli (HU)  mit  Erdnussauce, Basmatireis   und Gurkensalat mit Reisessig",
          "prices": [
            "CHF 9.50",
            "CHF 13.50"
          ]
        },
        "2019-03-29": {
          "title": "Norwegische Salm Knusperli",
          "description": "auf Karotten-Kartoffelstock mit Gurken-Sesam Gemüse und Zitronen Dill Dip",
          "prices": [
            "CHF 9.50",
            "CHF 13.50"
          ]
        }
      }
    },
    {
      "title": "Grün und natürlich",
      "meals": {
        "2019-03-25": {
          "title": "Klimamontag",
          "description": "Steinpilzrisotto mit Rucola garniert und Parmesan",
          "prices": [
            "CHF 9.50",
            "CHF 13.50"
          ]
        },
        "2019-03-26": {
          "title": "Grünes Gemüse Thai Curry",
          "description": "mit Nüssen, Broccoli und Basmatireis",
          "prices": [
            "CHF 9.50",
            "CHF 13.50"
          ]
        },
        "2019-03-27": {
          "title": "ASIA WEEK Vegetarian Gyoza",
          "description": "Japanische Teigtaschen gefüllt mit Gemüse, dazu Reis und Kimchi",
          "prices": [
            "CHF 9.50",
            "CHF 13.50"
          ]
        },
        "2019-03-28": {
          "title": "Indisches",
          "description": "Blumenkohl-Kartoffel Curry mit Samosas und Joghurt-Minz Dip",
          "prices": [
            "CHF 9.50",
            "CHF 13.50"
          ]
        },
        "2019-03-29": {
          "title": "Pizza di Bufala",
          "description": "Büffelmozzarella, Basilikum und Olivenöl",
          "prices": [
            "CHF 9.50",
            "CHF 13.50"
          ]
        }
      }
    },
    {
      "title": "Feuer und Flamme",
      "meals": {
        "2019-03-25": {
          "title": "ASIA WEEK",
          "description": "Grilled Baramundi Filet (VN) Der König der Fische serviert auf Teriyaki Gemüse mit Reis",
          "prices": [
            "CHF 10.00",
            "CHF 14.00"
          ]
        },
        "2019-03-26": {
          "title": "Grilliertes Wildschwein",
          "description": "Entrecote (EU) mit Pilzrahmsauce, Quarkspätzli und Wirsing mit Preiselbeeren",
          "prices": [
            "CHF 12.00",
            "CHF 16.00"
          ]
        },
        "2019-03-27": {
          "title": "Geschnmorte Kalbshaxe",
          "description": "(Schweiz) mit Rotweinsauce, Semmelknödel und Apfel-Rotkohl",
          "prices": [
            "CHF 16.00",
            "CHF 20.00"
          ]
        },
        "2019-03-28": {
          "title": "Rinds Hohrückensteak",
          "description": "(Schweiz) mit Chimichurri Salsa, Pommes frites und Maisgemüse",
          "prices": [
            "CHF 16.50",
            "CHF 20.50"
          ]
        },
        "2019-03-29": {
          "title": "ASIA WEEK Goi Cuon",
          "description": "Vietnamesische Glücksrollen, in Reispapier gefüllt mit Salat, Glasnudeln, Kräuter und Krevetten (VN)",
          "prices": [
            "CHF 11.00",
            "CHF 15.00"
          ]
        }
      }
    },
    {
      "title": "Tagessuppe",
      "meals": {
        "2019-03-25": {
          "title": "Tom Kha Gai Suppe",
          "description": "",
          "prices": [
            "CHF 1.40",
            "CHF 1.70"
          ]
        },
        "2019-03-26": {
          "title": "Süsskartoffel-Bananensuppe",
          "description": "",
          "prices": [
            "CHF 1.40",
            "CHF 1.70"
          ]
        },
        "2019-03-27": {
          "title": "Sauer-Scharf Suppe",
          "description": "",
          "prices": [
            "CHF 1.40",
            "CHF 1.70"
          ]
        },
        "2019-03-28": {
          "title": "Miso Suppe mit Edamame",
          "description": "",
          "prices": [
            "CHF 1.40",
            "CHF 1.70"
          ]
        },
        "2019-03-29": {
          "title": "Thai-Hühnerbrühe",
          "description": "",
          "prices": [
            "CHF 1.40",
            "CHF 1.70"
          ]
        }
      }
    }
  ];

  test('weHaveMenuDataForToday returns false on a weekend', () => {
    const sat = '2019-03-30';
    const sun = '2019-03-31';
    expect(fn(fixture, sat)).toBe(false);
    expect(fn(fixture, sun)).toBe(false);
  });

  test('weHaveMenuDataForToday returns true on a weekday', () => {
    const mon = '2019-03-25';
    const tue = '2019-03-26';
    const wed = '2019-03-27';
    const thu = '2019-03-28';
    const fri = '2019-03-29';
    expect(fn(fixture, mon)).toBe(true);
    expect(fn(fixture, tue)).toBe(true);
    expect(fn(fixture, wed)).toBe(true);
    expect(fn(fixture, thu)).toBe(true);
    expect(fn(fixture, fri)).toBe(true);
  });