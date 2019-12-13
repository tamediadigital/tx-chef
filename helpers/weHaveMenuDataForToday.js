/**
 * Validate that we have menu data for the given date key
 * @param {Object} menuData - the scraped data from the online Werdino menue
 */
function weHaveMenuDataForToday(menuData) {
	const { date, meals } = menuData;
	return typeof date === 'string' && date.trim().length > 0 && meals && Object.keys(meals).length > 0;
}

module.exports = weHaveMenuDataForToday;
