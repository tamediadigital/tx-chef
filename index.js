const AWS = require('aws-sdk');
const condense = require('selective-whitespace');
const getTodaysDateKey = require('./helpers/getDayKey');
const weHaveMenuDataForToday = require('./helpers/weHaveMenuDataForToday');
const eurest = require('./helpers/eurest');
const atrium = require('./helpers/bkw-atrium');

// Use these special tokens to add some semantics to the data we scrape from
// the webpages. This will allow us to send a single string to the translate API
// (which saves time and cost) and give us a way to parse / grep the values out of
// the string later on (like when we want to build a data object from the scraped
// and translated values).
const { CATEGORY_TOKEN, PRICE_TOKEN, DESCRIPTION_TOKEN, MEAL_TITLE_TOKEN, ID_TOKEN, SEPERATOR } = require('./constants');

// Cost per character via AWS Translate
// https://aws.amazon.com/translate/pricing/
const COST_PER_CHAR = 0.000015;

// Creates a client
const translate = new AWS.Translate({ apiVersion: '2017-07-01' });

const { DEBUG_ATRIUM, DEBUG_EUREST } = process.env;

/**
 * Build a data object from a string with special delimeters.
 * @param {String} text
 * @returns {Object}
 */
function objectify(text) {
	const parts = text.split(SEPERATOR).map(v => v.trim());
	const meals = [];

	parts.forEach(section => {
		const obj = {};

		section.split('\n').forEach(s => {
			if (s.indexOf(CATEGORY_TOKEN) === 0) {
				obj.category = condense(s.replace(CATEGORY_TOKEN, ''));
			} else if (s.indexOf(MEAL_TITLE_TOKEN) === 0) {
				obj.mealTitle = condense(s.replace(MEAL_TITLE_TOKEN, ''));
			} else if (s.indexOf(DESCRIPTION_TOKEN) === 0) {
				obj.description = condense(s.replace(DESCRIPTION_TOKEN, ''));
			} else if (s.indexOf(PRICE_TOKEN) === 0) {
				obj.price = condense(s.replace(PRICE_TOKEN, ''));
			} else if (s.indexOf(ID_TOKEN) === 0) {
				obj.id = condense(s.replace(ID_TOKEN, ''));
			}
		});

		if (obj.mealTitle && obj.mealTitle !== '') {
			meals.push(obj);
		}
	});
	return meals;
}

/**
 * Get an object containing the scraped menu data from the supplied url
 * @param {String} url
 * @param {String} sourceLanguage
 * @returns {Object}
 */
const getMenuData = (url, sourceLanguage) => {
	// Here we will store the orignal text with special delimeters.
	let originalText = '';

	return new Promise((resolve, reject) => {
		const scrapedPage = url.includes('eurest') ? eurest : atrium;

		scrapedPage(url).then(data => {
			console.log(data);
			console.log('\n\n\n\n\n\n\n--------');
			const todaysItemKey = getTodaysDateKey();

			if (!weHaveMenuDataForToday(data, todaysItemKey)) {
				resolve({ error: 'NO_MENU_DATA_TODAY', todaysItemKey });
			} else {
				Object.keys(data.meals).forEach(menuItemKey => {
					const item = data.meals[menuItemKey];
					const { category } = item;
				
					const mealCategory = category || '';
					originalText += `${CATEGORY_TOKEN} ${condense(mealCategory)}\n`;

					const mealTitle = condense(item.title);
					const mealDescription = condense(item.description || '');

					originalText += `${MEAL_TITLE_TOKEN} ${mealTitle}\n`;

					if (mealDescription) {
						originalText += `${DESCRIPTION_TOKEN} ${mealDescription}\n`;
					}

					originalText += `${ID_TOKEN} ${menuItemKey}\n`;
					originalText += `${PRICE_TOKEN} ${item.prices.map(s => condense(s)).join(' | ')}\n`;
					originalText += `${SEPERATOR}\n`;
				});

				const translationRequest = translate.translateText({
					SourceLanguageCode: sourceLanguage,
					TargetLanguageCode: 'en',
					Text: originalText,
				});

				translationRequest.on('success', (response) => {
					const originalTextObject = objectify(originalText);

					if (!response || !response.data || !response.data.TranslatedText) {
						reject(new Error('Unknown translation error occured'));
						return;
					}

					const englishObject = objectify(response.data.TranslatedText);

					if (DEBUG_ATRIUM || DEBUG_EUREST) {
						console.log('originalText', originalText, '\n');
						console.log('response.data.TranslatedText', response.data.TranslatedText, '\n');
						console.log('originalTextObject', originalTextObject, '\n');
						console.log('englishObject', englishObject, '\n');
					};

					// Merge the english translations with the original language
					// to make the block building easier
					englishObject.forEach((obj, index) => {
						if (obj.category) {
							originalTextObject[index].categoryEn = obj.category;
						}
						if (obj.mealTitle) {
							originalTextObject[index].mealTitleEn = obj.mealTitle;
						}
						if (obj.description) {
							originalTextObject[index].descriptionEn = obj.description;
						}
					});

					const textLength = originalText.length;
					const cost = `${textLength * COST_PER_CHAR} USD`;
					console.log(`Cost: ${textLength} chars * ${COST_PER_CHAR} = ${cost}`);

					resolve(originalTextObject);
				});

				translationRequest.on('error', (error, response) => {
					console.log('Error!');
					console.log({ error, response });
					reject(error);
				});

				translationRequest.send();
			}
		});
	});
};

module.exports = getMenuData;
