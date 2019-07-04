/**
 * Validate that we have menu data for the given date key
 * @param {Object} menuData - the scraped data from the online Werdino menue
 * @param {*} todaysItemKey - today's date key in the form of '2019-03-30'
 */
function weHaveMenuDataForToday(menuData, todaysItemKey) {
    return menuData.date === todaysItemKey && Object.keys(menuData.meals).length > 0;
}

module.exports = weHaveMenuDataForToday; 