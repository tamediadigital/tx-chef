const fn = require('../helpers/bkw-atrium.js');

jest.mock('axios');

test('exports a promise with menu data', () => {
  expect.assertions(3);
  return fn('bkw-atrium').then(data => {
    expect(data.date).toBe('22.09.');
    expect(Object.keys(data.meals)).toMatchObject([
    'Menu Deluxe',
    'Kalbsragout',
    'Kürbis-Wähe',
    'Tageshit',
    ]);
    expect(data).toMatchSnapshot();
  });
});

test('finds the first meal', () => {
  expect.assertions(6);
  return fn('bkw-atrium').then(data => {
    const meal = data.meals['Menu Deluxe'];

    expect(meal.title).toBe('Menu Deluxe');
    expect(meal.description).toBe('Heute in der Genusspause');
    expect(meal.provenance).toBe('');
    expect(meal.prices).toMatchObject(['16.50 CHF', '12.50 CHF']);
    expect(meal.vegetarian).toBe(false);
    expect(meal.vegan).toBe(false);
  });
});

test('finds vegetarian meals', () => {
  expect.assertions(3);
  return fn('bkw-atrium').then(data => {
    const meal = data.meals['Kürbis-Wähe'];

    expect(meal.title).toBe('Kürbis-Wähe');
    expect(meal.vegetarian).toBe(true);
    expect(meal.vegan).toBe(false);
  });
});
