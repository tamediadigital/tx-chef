const fn = require('../helpers/bkw-atrium.js');

jest.mock('axios');

test('exports a promise with menu data', () => {
  expect.assertions(2);
  return fn('bkw-atrium').then(data => {
    expect(data.date).toBe('13.12.');
    expect(Object.keys(data.meals)).toMatchObject([
      'Herzlichen Dank',
      'Paniertes Tofuschnitzel',
      'Ghackets und Hörnli',
      'Hot Komponenten Salatbuffet',
    ]);
  });
});

test('menu data', () => {
  expect.assertions(10);
  return fn('bkw-atrium').then(data => {
    const bmeal = data.meals['Herzlichen Dank'];

    expect(bmeal.title).toBe('Herzlichen Dank');
    expect(bmeal.description).toBe('für Ihre Treue. Wir wünschen Ihnen ein schönes Wochenende. Ihr atrium-Team');
    expect(bmeal.provenance).toBe('');
    expect(bmeal.prices.length).toBe(0);

    const gmeal = data.meals['Ghackets und Hörnli'];

    expect(gmeal.title).toBe('Ghackets und Hörnli');
    expect(gmeal.description).toBe('mit Rindfleischsauce, Reibkäse und Apfelmus oder Menusalat Add on: gebackene Zwiebelringe CHF 2.00');
    expect(Array.isArray(gmeal.prices)).toBe(true);
    expect(gmeal.prices[0]).toBe('9.50 CHF');
    expect(gmeal.prices[1]).toBe('13.50 CHF');
    expect(gmeal.provenance).toBe('Rind, Schweiz');
  });
});

test('find the vegetarian label', () => {
  expect.assertions(2);
  return fn('bkw-atrium').then(data => {
    const vmeal = data.meals['Paniertes Tofuschnitzel'];
    expect(vmeal.vegetarian).toBe(true);

    const bmeal = data.meals['Herzlichen Dank'];
    expect(bmeal.vegetarian).toBe(false);
  });
});
