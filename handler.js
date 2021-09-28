const fetch = require('fetch-everywhere');
const messageBuilder = require('./helpers/messageBuilder');
const noDataTodayMessage = require('./helpers/noDataTodayMessage');
const devConfig = require('./config/config.dev.json'); // eslint-disable-line import/no-unresolved
const getMenuData = require('.');

/**
 * Get the suppled enviornment variable, or provide a development default
 * @param {String} envVarName
 * @returns {Array}
 */
const getWebhookAddresses = envVarName => {
	const env = process.env[envVarName];

	if (env) {
		return env.split(',');
	}

	if (devConfig[envVarName]) {
		return devConfig[envVarName].split(',');
	}

	throw new Error(`No enviornment variable found for ${envVarName}`);
};

const ENVIORNMENT_DATA = {
	WERDINO_TAMEDIA: {
		NAME: 'Werdino',
		URL: 'https://clients.eurest.ch/de/tamediazuerich/menu',
		WEBHOOKS: getWebhookAddresses('WERDINO_TAMEDIA_WEBHOOK_ADDRESS'),
		SOURCE_LANGUAGE: 'de',
	},
	WERDINO_DOODLE: {
		NAME: 'Werdino',
		URL: 'https://clients.eurest.ch/de/tamediazuerich/menu',
		WEBHOOKS: getWebhookAddresses('WERDINO_DOODLE_WEBHOOK_ADDRESS'),
		SOURCE_LANGUAGE: 'de',
	},
	BUBENBERG: {
		NAME: 'Bubenberg',
		URL: 'https://clients.eurest.ch/dzz/de/Bubenberg',
		WEBHOOKS: getWebhookAddresses('BUBENBERG_WEBHOOK_ADDRESS'),
		SOURCE_LANGUAGE: 'de',
	},
	BERN_ZENTWEG: {
		NAME: 'Bern Zentweg',
		URL: 'https://www.eurest.ch/dzb',
		WEBHOOKS: getWebhookAddresses('BERN_ZENTWEG_WEBHOOK_ADDRESS'),
		SOURCE_LANGUAGE: 'de',
	},
	BUSSIGNY: {
		NAME: 'Bussigny',
		URL: 'https://www.eurest.ch/cil',
		WEBHOOKS: getWebhookAddresses('BUSSIGNY_WEBHOOK_ADDRESS'),
		SOURCE_LANGUAGE: 'fr',
	},
	LE_SCOOP: {
		NAME: 'Le Scoop',
		URL: 'https://www.eurest.ch/tamedia-lausanne',
		WEBHOOKS: getWebhookAddresses('LE_SCOOP_WEBHOOK_ADDRESS'),
		SOURCE_LANGUAGE: 'fr',
	},
	BKW_ATRIUM: {
		NAME: 'BKW Atrium',
		URL: 'https://bkw-bern.sv-restaurant.ch/de/menuplan',
		WEBHOOKS: getWebhookAddresses('BKW_ATRIUM_WEBHOOK_ADDRESS'),
		SOURCE_LANGUAGE: 'de',
	},
};

function run() {
	Object.keys(ENVIORNMENT_DATA).forEach((key) => {
		const slackTargetData = ENVIORNMENT_DATA[key];
		const { URL, WEBHOOKS, NAME, SOURCE_LANGUAGE } = slackTargetData;

		getMenuData(URL, SOURCE_LANGUAGE)
			.then(async (data) => {
				let blocks;

				if (data.error && data.error === 'NO_MENU_DATA_TODAY') {
					blocks = noDataTodayMessage(URL, NAME);
				} else {
					blocks = messageBuilder(data, URL, NAME, SOURCE_LANGUAGE);
				}

				await Promise.all(
					WEBHOOKS.map(
						address =>
							new Promise((resolve, reject) => {
								fetch(address, {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({ blocks }),
								})
									.then(response => {
										console.log(response.status, response.statusText);
										resolve();
									})
									.catch(error => {
										console.log('Error with Slack Webhook:', error);
										reject();
									});
							})
					)
				);
			})
			.catch((err) => {
				console.log(`Error in getMenuData: ${err}`);
			});
	});
}

module.exports.run = run;
