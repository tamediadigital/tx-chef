/**
 * Validate that we have menu data for the given date key
 * @param {Object} menuData - the scraped data from the online Werdino menue
 * @param {*} todaysItemKey - today's date key in the form of '2019-03-30'
 */
function weHaveMenuDataForToday(menuData, todaysItemKey) {
    const dates = menuData.map(dayData => Object.keys(dayData.meals));
    return dates.every(a => a.includes(todaysItemKey));
}

module.exports = weHaveMenuDataForToday; 