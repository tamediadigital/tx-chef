const zp = require('simple-zeropad');
const { DEBUG_DATE } = require('../constants');

/**
 * Returns a string in the form of DD.MM.YYYY
 */
function getDayKey() {
	if (process.env.DEBUG_EUREST || process.env.DEBUG_ATRIUM) {
		return DEBUG_DATE;
	};

	const today = new Date();
	const year = today.getFullYear() - 2000;
	const month = zp(today.getMonth() + 1);
	const day = zp(today.getDate());
	return `${day}.${month}.${year}`;
}

module.exports = getDayKey;
