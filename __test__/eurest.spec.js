const fn = require('../helpers/eurest');

jest.mock('axios');

test('exports a promise with menu data', () => {
  expect.assertions(2);
  return fn().then(data => {
    expect(data.date).toBe('10.01.20');
    expect(Object.keys(data.meals)).toMatchObject([
      'Brasserie',
      'Grün und natürlich',
      'Feuer und Flamme',
      'Tagessuppe',
    ]);
  });
});

test('gets first meal', () => {
  expect.assertions(4);
  return fn().then(data => {
    const meal = data.meals.Brasserie;

    expect(meal.title).toBe('Pouletbrust (Schweiz)');
    expect(meal.description).toBe('an Honig-Rosmarin Jus mit Randen-Kartoffelstock und Rosenkohl');
    expect(meal.prices[0]).toBe('CHF 9,50');
    expect(meal.prices[1]).toBe('CHF 13,50');
  });
});

test('gets second meal', () => {
  expect.assertions(4);
  return fn().then(data => {
    const meal = data.meals['Grün und natürlich'];

    expect(meal.title).toBe('Zucchetti Piccata');
    expect(meal.description).toBe('auf Spaghetti mit Tomatensauce "Arrabiata", Broccoli, gebratene Champignons und Parmesan');
    expect(meal.prices[0]).toBe('CHF 9,50');
    expect(meal.prices[1]).toBe('CHF 13,50');
  });
});

test('gets third meal', () => {
  expect.assertions(4);
  return fn().then(data => {
    const meal = data.meals['Feuer und Flamme'];

    expect(meal.title).toBe('Kalbs Wienerschnitzel');
    expect(meal.description).toBe('(Schweiz) mit Zitronenschnitz, Pommes frites und gebratenes Wintergemüse');
    expect(meal.prices[0]).toBe('CHF 16,00');
    expect(meal.prices[1]).toBe('CHF 20,00');
  });
});

test('gets fourth meal', () => {
  expect.assertions(4);
  return fn().then(data => {
    const meal = data.meals.Tagessuppe;

    expect(meal.title).toBe('Champignon-Lauchsuppe');
    expect(meal.description).toBe('mit Sbrinz');
    expect(meal.prices[0]).toBe('CHF 1,40');
    expect(meal.prices[1]).toBe('CHF 1,70');
  });
});
