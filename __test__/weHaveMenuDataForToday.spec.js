const fn = require('../helpers/weHaveMenuDataForToday');

describe('weHaveMenuDataForToday', () => {
	test('should return false for days without menu items', () => {
		const fixture = {
			date: '1234',
			meals: {},
		};

		expect(fn(fixture)).toBe(false);
	});

	test('should return false for days without a valid date', () => {
		const fixture = {
			date: '',
			meals: {},
		};

		expect(fn(fixture)).toBe(false);
	});

	test('weHaveMenuDataForToday returns true for valid days', () => {
		expect(fn({ date: '12-34-56', meals: { foo: {} } })).toBe(true);
	});
});
