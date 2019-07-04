const fn = require('../helpers/werdino.js');

test('exports a promise with menu data', () => {
  expect.assertions(2);
  return fn().then(data => {
    expect(data.date).toBe('04.07.19');
    expect(Object.keys(data.meals)).toMatchObject([
      'Brasserie',
      'Grün und natürlich',
      'Feuer und Flamme',
      'Tagessuppe',
      'Buddha Bowl',
    ]);
  });
});

test('menu data', () => {
  expect.assertions(9);
  return fn().then(data => {
    console.log(JSON.stringify(data, null, 2));

    // Brasserie
    const bmeal = data.meals.Brasserie;

    expect(bmeal.title).toBe('Ceasar Salat mit Speckwürfeli');
    expect(bmeal.description).toBe('(Schweiz) garniert mit Chicken Nuggets (Schweiz) und Croutons');
    expect(Array.isArray(bmeal.prices)).toBe(true);
    expect(bmeal.prices[0]).toBe('CHF 9,50');

    // Grün und natürlich
    const gmeal = data.meals['Grün und natürlich'];

    expect(gmeal.title).toBe('Griechische Gemüsepfanne');
    expect(gmeal.description).toBe('mit Feta, Ofenkartoffel mit Tzatzikisauce und Rotkabissalat');
    expect(Array.isArray(gmeal.prices)).toBe(true);
    expect(gmeal.prices[0]).toBe('CHF 9,50');
    expect(gmeal.prices[1]).toBe('CHF 13,50');
  });
});
