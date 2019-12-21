const fn = require('../helpers/eurest');

jest.mock('axios');

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

test('gets first meal', () => {
  expect.assertions(3);
  return fn().then(data => {
    const meal = data.meals.Brasserie;

    expect(meal.title).toBe('Gyros vom Schwein');
    expect(meal.description).toBe('(Schweiz) mit Reis, Pita Brot, Salat und Tomaten dazu ein Sauerrahm Dip');
    expect(meal.prices[0]).toBe('CHF 9,50');
  });
});

test('gets second meal', () => {
  expect.assertions(4);
  return fn().then(data => {
    const meal = data.meals['Grün und natürlich'];

    expect(meal.title).toBe('Älplermagronen');
    expect(meal.description).toBe('mit Kartoffeln, Bergkäse und Röstzwiebeln dazu Apfelmus und Parmesan');
    expect(meal.prices[0]).toBe('CHF 9,50');
    expect(meal.prices[1]).toBe('CHF 13,50');
  });
});

test('gets third meal', () => {
  expect.assertions(4);
  return fn().then(data => {
    const meal = data.meals['Feuer und Flamme'];

    expect(meal.title).toBe('Entenbrust (Frankreich)');
    expect(meal.description).toBe('mit Kirschen-Balsamicojus, Kartoffel Gnocchi und glasierte Karotten mit Ingwer');
    expect(meal.prices[0]).toBe('CHF 14,00');
    expect(meal.prices[1]).toBe('CHF 18,00');
  });
});

test('gets fourth meal', () => {
  expect.assertions(4);
  return fn().then(data => {
    const meal = data.meals.Tagessuppe;

    expect(meal.title).toBe('Gartenkressesuppe');
    expect(meal.description).toBe(null);
    expect(meal.prices[0]).toBe('CHF 1,40');
    expect(meal.prices[1]).toBe('CHF 1,70');
  });
});
