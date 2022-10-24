const fn = require('../helpers/weHaveMenuDataForToday');

const FRIDAY = '13-12-2019';
const SATURDAY = '14-12-2019';

describe('weHaveMenuDataForToday', () => {
	test('returns false for days without meal items', () => {
		const fixture = {
			date: '',
			meals: {},
		};

		expect(fn(fixture, FRIDAY)).toBe(false);
	});

	test('returns false for 0-length date strings', () => {
		const fixture = {
			date: '',
			meals: {},
		};

		expect(fn(fixture, FRIDAY)).toBe(false);
	});

	test('returns true for valid days in the XX-XX-XXXX format', () => {
		const fixture = {
			date: FRIDAY,
			meals: {
				foo: {},
			},
		};

		expect(fn(fixture, FRIDAY)).toBe(true);
	});

	test('returns false for invalid days in the XX-XX-XXXX format', () => {
		const fixture = {
			date: FRIDAY,
			meals: {
				foo: {},
			},
		};

		expect(fn(fixture, SATURDAY)).toBe(false);
	});

	test('returns true for valid days in XX.XX. format', () => {
		const fixture = {
			date: '13.12.',
			meals: {
				foo: {},
			},
		};
		
		const fixture2 = {
			date: '07.01.',
			meals: {
				foo: {},
			},
		};

		expect(fn(fixture, '13.12.')).toBe(true);
		expect(fn(fixture2, '07.01.')).toBe(true);
	});
	
	test('returns true for valid days in XX.XX.XX format', () => {
		const fixture = {
			date: '13.12.22',
			meals: {
				foo: {},
			},
		};
		
		const fixture2 = {
			date: '07.01.22',
			meals: {
				foo: {},
			},
		};

		expect(fn(fixture, '13.12.22')).toBe(true);
		expect(fn(fixture2, '07.01.22')).toBe(true);
	});

	test('returns false for mismatched days in the XX.XX. format', () => {
		const fixture = {
			date: '13.12.',
			meals: {
				foo: {},
			},
		};

		expect(fn(fixture, '14.12.')).toBe(false);
	});
});
