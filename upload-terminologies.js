const AWS = require('aws-sdk');
const { CATEGORY_TOKEN, PRICE_TOKEN, DESCRIPTION_TOKEN, MEAL_TITLE_TOKEN, ID_TOKEN, SEPERATOR } = require('./constants');

const CSV = `en,de,fr
${CATEGORY_TOKEN},${CATEGORY_TOKEN},${CATEGORY_TOKEN}
${PRICE_TOKEN},${PRICE_TOKEN},${PRICE_TOKEN}
${DESCRIPTION_TOKEN},${DESCRIPTION_TOKEN},${DESCRIPTION_TOKEN}
${MEAL_TITLE_TOKEN},${MEAL_TITLE_TOKEN},${MEAL_TITLE_TOKEN}
${ID_TOKEN},${ID_TOKEN},${ID_TOKEN}
${SEPERATOR},${SEPERATOR},${SEPERATOR}`;

const params = {
	MergeStrategy: 'OVERWRITE',
	Name: 'CUSTOM_TOKENS',
	TerminologyData: {
		File: Buffer.from(CSV),
		Format: 'CSV',
	},
	Description: 'Custom Tokens to use with the menu data. These tokens should never be translated',
};

const translate = new AWS.Translate({ apiVersion: '2017-07-01', region: 'eu-central-1' });

translate.importTerminology(params, function(err, data) {
	if (err) {
		console.log(err, err.stack);
	} else {
		console.log(data);
	}
});
