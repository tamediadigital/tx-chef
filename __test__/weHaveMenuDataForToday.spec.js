const fn = require('../helpers/weHaveMenuDataForToday');

const fixture = {
  "date": "04.07.19",
  "meals": {
    "Brasserie": {
      "title": "Ceasar Salat mit Speckwürfeli",
      "description": "(Schweiz) garniert mit Chicken Nuggets (Schweiz) und Croutons",
      "prices": [
        "CHF 9,50",
        "CHF 13,50"
      ]
    },
    "Grün und natürlich": {
      "title": "Griechische Gemüsepfanne",
      "description": "mit Feta, Ofenkartoffel mit Tzatzikisauce und Rotkabissalat",
      "prices": [
        "CHF 9,50",
        "CHF 13,50"
      ]
    },
    "Feuer und Flamme": {
      "title": "Grillierte Jacobsmuscheln (USA)",
      "description": "nach Grenobler Art mit warmem Antipastigemüse und Pommes Frites",
      "prices": [
        "CHF 22,00",
        "CHF 26,00"
      ]
    },
    "Tagessuppe": {
      "title": "Fischsuppe a la Bouillabaisse",
      "description": null,
      "prices": [
        "CHF 1,40",
        "CHF 1,70"
      ]
    },
    "Buddha Bowl": {
      "title": "Fresh California Bowl",
      "description": null,
      "prices": [
        "CHF 12,50",
        "CHF 16,50"
      ]
    }
  }
};

  test('weHaveMenuDataForToday returns false on a weekend', () => {
    const sat = '06.07.19';
    const sun = '07.07.19';
    expect(fn(fixture, sat)).toBe(false);
    expect(fn(fixture, sun)).toBe(false);
  });

  test('weHaveMenuDataForToday returns true for valid days', () => {
    expect(fn(fixture, '04.07.19')).toBe(true);
  });