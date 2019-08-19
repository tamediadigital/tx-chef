const fn = require('../helpers/werdino.js');

test('exports a promise with menu data', () => {
  expect.assertions(2);
  return fn().then(data => {
    expect(data.date).toBe('19.08.19');
    expect(Object.keys(data.meals)).toMatchObject([
      'Brasserie',
      'Grün und natürlich',
      'Feuer und Flamme',
      'Tagessuppe',
    ]);
  });
});

test('menu data', () => {
  expect.assertions(9);
  return fn().then(data => {
    console.log(JSON.stringify(data, null, 2));

    // Brasserie
    const bmeal = data.meals.Brasserie;

    expect(bmeal.title).toBe('Gyros vom Schwein');
    expect(bmeal.description).toBe('(Schweiz) mit Reis, Pita Brot, Salat und Tomaten dazu ein Sauerrahm Dip');
    expect(Array.isArray(bmeal.prices)).toBe(true);
    expect(bmeal.prices[0]).toBe('CHF 9,50');

    // Grün und natürlich
    const gmeal = data.meals['Grün und natürlich'];

    expect(gmeal.title).toBe('Älplermagronen');
    expect(gmeal.description).toBe('mit Kartoffeln, Bergkäse und Röstzwiebeln dazu Apfelmus und Parmesan');
    expect(Array.isArray(gmeal.prices)).toBe(true);
    expect(gmeal.prices[0]).toBe('CHF 9,50');
    expect(gmeal.prices[1]).toBe('CHF 13,50');
  });
});
