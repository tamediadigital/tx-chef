/**
 * Strip date strings of punctuation values.
 *
 * @note We might get date info in the format of XX.XX. or XX-XX-XXXX
 * So let's remove the punctuation that would just leave us with
 * only the integer parts of the date.
 * @param {String} dateString
 * @returns {String}
 */
function clean(dateString) {
	if (typeof dateString !== 'string') {
		return '';
	}
	return dateString.replace(/\.|-/gm, '').trim();
}

/**
 * Validate that we have menu data for the given date key.
 *
 * @param {Object} menuData - the scraped data from the website in object form
 * @param {String} todaysDate - today's date in the form of XX-XX-XXXX
 * @returns {Boolean}
 */
function weHaveMenuDataForToday(menuData, todaysDate) {
	const { date, meals } = menuData;

	const convertedDate = clean(date);
	const convertedTodaysDate = clean(todaysDate);

	return (
		convertedDate.length > 0 &&
		convertedTodaysDate.length > 0 &&
		convertedTodaysDate.search(convertedDate) === 0 &&
		meals &&
		Object.keys(meals).length > 0
	);
}

module.exports = weHaveMenuDataForToday;
