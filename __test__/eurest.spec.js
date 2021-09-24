const fn = require('../helpers/eurest');

jest.mock('axios');

test('exports a promise with menu data', () => {
  expect.assertions(2);
  return fn().then(data => {
    expect(data.date).toBe('22.09.21');
    expect(data).toMatchSnapshot();
  });
});

test('gets first meal', () => {
  expect.assertions(4);
  return fn().then(data => {
    const meal = Object.values(data.meals).filter(mealObj => mealObj.category === 'Brasserie').pop();

    expect(meal.title).toBe('Healthy Bagel');
    expect(meal.description).toBe('Kraftkorn-Malz Bagel mit Avocado, Tomaten, Rührei und Rauchlachs (NO)');
    expect(meal.prices[0]).toBe('CHF 9,50');
    expect(meal.prices[1]).toBe('Ext. 13,50');
  });
});

