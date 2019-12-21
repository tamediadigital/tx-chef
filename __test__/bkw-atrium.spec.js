const fn = require('../helpers/bkw-atrium.js');

jest.mock('axios');

test('exports a promise with menu data', () => {
  expect.assertions(2);
  return fn('bkw-atrium').then(data => {
    expect(data.date).toBe('20.12.');
    expect(Object.keys(data.meals)).toMatchObject([
      'The KKM Burger',
      'Tortellini mit Rindfleisch',
      'Frühlings­rollen',
      'Hot Komponenten Salatbuffet',
    ]);
  });
});

test('finds the first meal', () => {
  expect.assertions(6);
  return fn('bkw-atrium').then(data => {
    const meal = data.meals['The KKM Burger'];

    expect(meal.title).toBe('The KKM Burger');
    expect(meal.description).toBe('mit Rindfleisch oder vegetarisch, im Briochebun mit Cocktailsauce, Coleslaw, Lollo rosso, Gurke und Tomate inkl. Softgetränk Offeriert von der BKW ...es het solang`s het...');
    expect(meal.provenance).toBe('Rind, Schweiz');
    expect(meal.prices.length).toBe(0);
    expect(meal.vegetarian).toBe(false);
    expect(meal.vegan).toBe(false);
  });
});

test('finds the second meal', () => {
  expect.assertions(7);
  return fn('bkw-atrium').then(data => {
    const meal = data.meals['Tortellini mit Rindfleisch'];

    expect(meal.title).toBe('Tortellini mit Rindfleisch');
    expect(meal.description).toBe('mit Pestorahmsauce und glasierten Cherrytomaten');
    expect(meal.prices[0]).toBe('9.50 CHF');
    expect(meal.prices[1]).toBe('13.50 CHF');
    expect(meal.provenance).toBe('Rind, Schweiz');
    expect(meal.vegetarian).toBe(false);
    expect(meal.vegan).toBe(false);
  });
});

test('finds the third meal', () => {
  expect.assertions(7);
  return fn('bkw-atrium').then(data => {
    const meal = data.meals['Frühlings­rollen'];

    expect(meal.title).toBe('Frühlings­rollen');
    expect(meal.description).toBe('mit Sweet-Chilisauce und sautiertem Chinagemüse Add on: 1 weitere Frühlingsrolle CHF 2.00');
    expect(meal.prices[0]).toBe('9.50 CHF');
    expect(meal.prices[1]).toBe('13.50 CHF');
    expect(meal.provenance).toBe('');
    expect(meal.vegetarian).toBe(false);
    expect(meal.vegan).toBe(true);
  });
});

test('finds the fourth meal', () => {
  expect.assertions(7);
  return fn('bkw-atrium').then(data => {
    const meal = data.meals['Hot Komponenten Salatbuffet'];

    expect(meal.title).toBe('Hot Komponenten Salatbuffet');
    expect(meal.description).toBe('Gemüse, Beilagen, Fleisch oder Fisch per 100g');
    expect(meal.prices[0]).toBe('2.40 CHF');
    expect(meal.prices[1]).toBe('3.20 CHF');
    expect(meal.provenance).toBe('');
    expect(meal.vegetarian).toBe(false);
    expect(meal.vegan).toBe(false);
  });
});

