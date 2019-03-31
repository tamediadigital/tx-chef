const zp = require('simple-zeropad');

/**
 * Returns a string in the form of YYYY-MM-DD
 */
function getDayKey() {
    const today = new Date()
    const year = today.getFullYear();
    const month = zp(today.getMonth() + 1);
    const day = zp(today.getDate())
    return `${year}-${month}-${day}`
}

module.exports = getDayKey;
