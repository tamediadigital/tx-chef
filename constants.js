module.exports.ISSUES_LINK = 'https://github.com/tamediadigital/tx-chef/issues';
module.exports.DEBUG_DATE = '20.12.2019';

// Use these special tokens to add some semantics to the data we scrape from
// the webpages. This will allow us to send a single string to the translate API
// (which saves time and cost) and give us a way to parse / grep the values out of
// the string later on (like when we want to build a data object from the scraped
// and translated values).
module.exports.TITLE_TOKEN = '[00]';
module.exports.PRICE_TOKEN = '[11]';
module.exports.DESCRIPTION_TOKEN = '[22]';
module.exports.MEAL_TITLE_TOKEN = '[33]';
module.exports.ID_TOKEN = '[44]';
module.exports.SEPERATOR = '[55]'