const fn = require('../helpers/bkw-atrium');

const DEBUG = true;

describe('get atrium menu', () => {
	test('exports a promise with menu data', () => {
		expect.assertions(2);
		return fn('bkw-atrium.com', DEBUG).then(data => {
			expect(data.date).toBe('22.09.');
			expect(data).toMatchSnapshot();
		});
	});

	test('finds the first meal', () => {
		expect.assertions(6);
		return fn('bkw-atrium', DEBUG).then(data => {
			const meal = Object.values(data.meals)
				.filter(mealObj => mealObj.title === 'Menu Deluxe')
				.pop();

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
		return fn('bkw-atrium', DEBUG).then(data => {
			const meal = Object.values(data.meals)
				.filter(mealObj => mealObj.title === 'Kürbis-Wähe')
				.pop();

			expect(meal.title).toBe('Kürbis-Wähe');
			expect(meal.vegetarian).toBe(true);
			expect(meal.vegan).toBe(false);
		});
	});
});
