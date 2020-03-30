const fn = require('../helpers/bkw-atrium.js');

jest.mock('axios');

test('exports a promise with menu data', () => {
  expect.assertions(1);
  return fn('bkw-atrium-assert-menu-data').then(data => {
    console.log(JSON.stringify(data, null, 2));
    expect(data.date).toBe('07.01.');
  });
});

