const { Translate } = require('@google-cloud/translate');
const condense = require('condense-whitespace');
const getDayKey = require('./helpers/getDayKey');
const weHaveMenuDataForToday = require('./helpers/weHaveMenuDataForToday');
const werdino = require('./helpers/werdino');
const todaysItemKey = getDayKey();

// Creates a client
const translate = new Translate();

function objectify(text) {
	const parts = text.split('🦄\n');

	const meals = [];

	parts.forEach(section => {
		const obj = {};

		section.split('\n').forEach(s => {
			const title = '[T_] ';
			const price = '[M_P] ';
			const descr = '[M_D] ';
			const mealTitle = '[M_T] ';

			if (s.indexOf(title) === 0) {
				obj.title = s.replace(title, '');
			} else if (s.indexOf(mealTitle) === 0) {
				obj.mealTitle = s.replace(mealTitle, '');
			} else if (s.indexOf(descr) === 0) {
				obj.description = s.replace(descr, '');
			} else if (s.indexOf(price) === 0) {
				obj.price = s.replace(price, '');
			}
		});

		if (obj.title && obj.title !== '') {
			meals.push(obj);
		}
	});
	return meals;
}

const getWerdinoData = () => {
	let german = '';

	return new Promise(resolve => {
		werdino().then(data => {
			if (!weHaveMenuDataForToday(data, todaysItemKey)) {
				resolve({ error: 'NO_MENU_DATA_TODAY', todaysItemKey });
			} else {
				Object.keys(data.meals).forEach(category => {
					const item = data.meals[category];

					german += `[T_] ${condense(category)}\n`;

					const mealTitle = condense(item.title);
					const mealDescription = condense(item.description || '');

					german += `[M_T] ${mealTitle}\n`;

					if (mealDescription) {
						german += `[M_D] ${mealDescription}\n`;
					}

					german += `[M_P] ${item.prices.map(s => condense(s)).join(' | ')}\n`;
					german += '🦄\n';
				});

				translate
					.translate(german, 'en')
					.then(translations => {
						translations = Array.isArray(translations) ? translations : [translations];

						const germanObject = objectify(german);
						const englishObject = objectify(translations[0]);

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

						console.log(`Cost: ${german.length} characters * 0.00002/per char = ${german.length * 0.00002} USD`);
						resolve(germanObject);
					})
					.catch(err => console.log(`Error translating: ${err}`));
			}
		});
	});
};

module.exports = getWerdinoData;
