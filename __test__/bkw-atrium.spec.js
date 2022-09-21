const fn = require('../helpers/bkw-atrium');

const DEBUG = true;

describe('get atrium menu', () => {
	test('exports a promise with menu data', () => {
		expect.assertions(2);
		return fn('bkw-atrium.com', DEBUG).then(data => {
			expect(data.date).toBe('21.09.');
			expect(data).toMatchSnapshot();
		});
	});

	test('finds the first meal', () => {
		expect.assertions(5);
		return fn('bkw-atrium', DEBUG).then(data => {
			const meal = Object.values(data.meals)
				.filter(mealObj => mealObj.title === 'Grilliertes MSC Rotbarschfilet')
				.pop();

			expect(meal.description).toBe('mit Zitronensauce, Couscous und Mangold mit Rahmsauce Add on: 1 ASC Krevettenspiess CHF 3.50');
			expect(meal.provenance).toBe('Herkunft: Krevetten: Vietnam, Zucht, Rotbarsch, Wildfang, Island');
			expect(meal.prices).toMatchObject(['13.50 CHF', '9.50 CHF']);
			expect(meal.vegetarian).toBe(false);
			expect(meal.vegan).toBe(false);
		});
	});

	test('finds vegetarian meals', () => {
		expect.assertions(2);
		return fn('bkw-atrium', DEBUG).then(data => {
			const meal = Object.values(data.meals)
				.filter(mealObj => mealObj.title === 'Fusilli Nikos')
				.pop();

			expect(meal.vegetarian).toBe(true);
			expect(meal.vegan).toBe(false);
		});
	});
});
