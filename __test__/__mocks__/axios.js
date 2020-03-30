const fs = require('fs');
const path = require('path');

const axios = jest.genMockFromModule('axios');

const get = jest.fn(url => {
	if (url && url.includes('bkw-atrium-assert-menu-data')) {
		const atriumData2 = fs.readFileSync(
			path.resolve(__dirname, '../fixtures/bkw-atrium-assert-menu-data.html'),
			'utf8'
		);
		return Promise.resolve({ data: atriumData2 });
	} if (url && url.includes('bkw-atrium')) {
		const atriumData = fs.readFileSync(path.resolve(__dirname, '../fixtures/bkw-atrium.html'), 'utf8');
		return Promise.resolve({ data: atriumData });
	}
	const werdinoData = fs.readFileSync(path.resolve(__dirname, '../fixtures/werdino.html'), 'utf8');
	return Promise.resolve({ data: werdinoData });
});

axios.get = get;

module.exports = axios;
