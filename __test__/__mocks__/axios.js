const fs = require('fs');
const path = require('path');

const data = fs.readFileSync(path.resolve(__dirname, '../fixtures/werdino.html'), 'utf8');

module.exports = {
    get: jest.fn(() => Promise.resolve({ data }))
}