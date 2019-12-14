const AWS = require('aws-sdk');
const condense = require('condense-whitespace');
const getTodaysDateKey = require('./helpers/getDayKey');
const weHaveMenuDataForToday = require('./helpers/weHaveMenuDataForToday');
const werdino = require('./helpers/werdino');
const atrium = require('./helpers/bkw-atrium');

// Use these special tokens to add some semantics to the data we scrape from 
// the webpages. This will allow us to send a single string to the translate API
// (which saves time and cost) and give us a way to parse / grep the values out of
// the string later on (like when we want to build a data object from the scraped
// and translated values). 
const TITLE_TOKEN = '[T_] ';
const PRICE_TOKEN = '[M_P] ';
const DESCRIPTION_TOKEN = '[M_D] ';
const MEAL_TITLE_TOKEN = '[M_T] ';
const SEPERATOR = '🦄\n';

// Cost per character via AWS Translate
// https://aws.amazon.com/translate/pricing/
const COST_PER_CHARACTER = 0.000015;

// Creates a client
const translate = new AWS.Translate({ apiVersion: '2017-07-01' });

/**
 * Build a data object from a string with special delimeters.
 * @param {String} text
 * @returns {Object}
 */
function objectify(text) {
	const parts = text.split(SEPERATOR);

	const meals = [];

	parts.forEach(section => {
		const obj = {};

		section.split('\n').forEach(s => {
			if (s.indexOf(TITLE_TOKEN) === 0) {
				obj.title = s.replace(TITLE_TOKEN, '');
			} else if (s.indexOf(MEAL_TITLE_TOKEN) === 0) {
				obj.mealTitle = s.replace(MEAL_TITLE_TOKEN, '');
			} else if (s.indexOf(DESCRIPTION_TOKEN) === 0) {
				obj.description = s.replace(DESCRIPTION_TOKEN, '');
			} else if (s.indexOf(PRICE_TOKEN) === 0) {
				obj.price = s.replace(PRICE_TOKEN, '');
			}
		});

		if (obj.title && obj.title !== '') {
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
	// Here we will store the German text with special delimeters.
	let german = '';

	return new Promise((resolve, reject) => {
		const scapePage = url.includes('eurest') ? werdino : atrium;

		scapePage(url).then(data => {
			const todaysItemKey = getTodaysDateKey();

			if (!weHaveMenuDataForToday(data, todaysItemKey)) {
				resolve({ error: 'NO_MENU_DATA_TODAY', todaysItemKey });
			} else {
				Object.keys(data.meals).forEach(category => {
					const item = data.meals[category];

					german += `${TITLE_TOKEN} ${condense(category)}\n`;

					const mealTitle = condense(item.title);
					const mealDescription = condense(item.description || '');

					german += `${MEAL_TITLE_TOKEN} ${mealTitle}\n`;

					if (mealDescription) {
						german += `${DESCRIPTION_TOKEN} ${mealDescription}\n`;
					}

					german += `${PRICE_TOKEN} ${item.prices.map(s => condense(s)).join(' | ')}\n`;
					german += SEPERATOR;
				});

				const translationRequest = translate.translateText({
					SourceLanguageCode: sourceLanguage,
					TargetLanguageCode: 'en',
					Text: german,
				});

				translationRequest
					.on('success', function(response) {
						const germanObject = objectify(german);

						if (!response || !response.data || !response.data.TranslatedText) {
							reject(new Error('Unknown translation error occured'));
							return;
						}

						const englishObject = objectify(response.data.TranslatedText);

						// Merge the english translations with the German to make the block building easier
						englishObject.forEach((obj, index) => {
							if (obj.title) {
								germanObject[index].titleEn = obj.title;
							}
							if (obj.mealTitle) {
								germanObject[index].mealTitleEn = obj.mealTitle;
							}
							if (obj.description) {
								germanObject[index].descriptionEn = obj.description;
							}
						});

						console.log(`Cost: ${german.length} characters * ${COST_PER_CHARACTER}/per char = ${german.length * COST_PER_CHARACTER} USD`);
						resolve(germanObject);
					})
					.on('error', function(error, response) {
						console.log('Error!');
						console.log({ error, response });
						reject(error);
					})
					.send();
			}
		});
	});
};

module.exports = getMenuData;
