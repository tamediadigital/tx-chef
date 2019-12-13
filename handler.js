const fetch = require('fetch-everywhere');
const messageBuilder = require('./helpers/messageBuilder');
const noDataTodayMessage = require('./helpers/noDataTodayMessage');
const devConfig = require('./config/config.dev.json');
const getMenuData = require('.');

const httpsArrayOnly = array => array.filter(a => a && typeof a === 'string' && a.includes('https'));

const WERDINO_WEBHOOK_ADDRESSES = process.env.WERDINO_WEBHOOK_ADDRESSES || devConfig.WERDINO_WEBHOOK_ADDRESSES;
const BUBENBERG_WEBHOOK_ADDRESSES = process.env.BUBENBERG_WEBHOOK_ADDRESSES || devConfig.BUBENBERG_WEBHOOK_ADDRESSES;
const BERN_ZENTWEG_WEBHOOK_ADDRESSES = process.env.BERN_ZENTWEG_WEBHOOK_ADDRESSES || devConfig.BERN_ZENTWEG_WEBHOOK_ADDRESSES;
const BUSSIGNY_WEBHOOK_ADDRESSES = process.env.BUSSIGNY_WEBHOOK_ADDRESSES || devConfig.BUSSIGNY_WEBHOOK_ADDRESSES;
const LE_SCOOP_WEBHOOK_ADDRESSES = process.env.LE_SCOOP_WEBHOOK_ADDRESSES || devConfig.LE_SCOOP_WEBHOOK_ADDRESSES;
const BKW_ATRIUM_WEBHOOK_ADDRESSES = process.env.BKW_ATRIUM_WEBHOOK_ADDRESSES || devConfig.BKW_ATRIUM_WEBHOOK_ADDRESSES;

const ENVIORNMENT_DATA = {
	WERDINO: {
		NAME: 'Werdino',
		URL: 'https://clients.eurest.ch/de/tamediazuerich/menu',
		WEBHOOKS: httpsArrayOnly(WERDINO_WEBHOOK_ADDRESSES.split(',')),
		SOURCE_LANGUAGE: 'de'
	},
	BUBENBERG: {
		NAME: 'Bubenberg',
		URL: 'https://clients.eurest.ch/dzz/de/Bubenberg',
		WEBHOOKS: httpsArrayOnly(BUBENBERG_WEBHOOK_ADDRESSES.split(',')),
		SOURCE_LANGUAGE: 'de'
	},
	BERN_ZENTWEG: {
		NAME: 'Bern Zentweg',
		URL: 'https://www.eurest.ch/dzb',
		WEBHOOKS: httpsArrayOnly(BERN_ZENTWEG_WEBHOOK_ADDRESSES.split(',')),
		SOURCE_LANGUAGE: 'de'
	},
	BUSSIGNY: {
		NAME: 'Bussigny',
		URL: 'https://www.eurest.ch/cil',
		WEBHOOKS: httpsArrayOnly(BUSSIGNY_WEBHOOK_ADDRESSES.split(',')),
		SOURCE_LANGUAGE: 'fr'
	},
	LE_SCOOP: {
		NAME: 'Le Scoop',
		URL: 'https://www.eurest.ch/tamedia-lausanne',
		WEBHOOKS: httpsArrayOnly(LE_SCOOP_WEBHOOK_ADDRESSES.split(',')),
		SOURCE_LANGUAGE: 'fr'
	},
	BKW_ATRIUM: {
		NAME: 'BKW Atrium',
		URL: 'https://bkw-bern.sv-restaurant.ch/de/menuplan',
		WEBHOOKS: httpsArrayOnly(BKW_ATRIUM_WEBHOOK_ADDRESSES.split(',')),
	 SOURCE_LANGUAGE: 'de'
	},
};

function runWerdino() {
	Object.keys(ENVIORNMENT_DATA).map(key => {
		const slackTargetData = ENVIORNMENT_DATA[key];
		const { URL, WEBHOOKS, NAME, SOURCE_LANGUAGE } = slackTargetData;

		getMenuData(URL, SOURCE_LANGUAGE)
			.then(async data => {
				let blocks;

				if (data.error && data.error === 'NO_MENU_DATA_TODAY') {
					blocks = noDataTodayMessage(URL, NAME);
				} else {
					blocks = messageBuilder(data, URL, NAME, SOURCE_LANGUAGE);
				}

				await Promise.all(
					WEBHOOKS.map(address => {
						return new Promise((resolve, reject) => {
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
						});
					})
				);
			})
			.catch(err => console.log(`Error in getMenuData: ${err}`));
	});
}

module.exports.runWerdino = runWerdino;
