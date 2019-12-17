const zp = require('simple-zeropad');

/**
 * Returns a string in the form of YYYY-MM-DD
 */
function getDayKey() {
	const today = new Date();
  const year = today.getFullYear() - 2000;
  const month = zp(today.getMonth() + 1);
	const day = zp(today.getDate());
	return `${day}.${month}.${year}`;
}

module.exports = getDayKey;
