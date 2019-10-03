const fetch = require('fetch-everywhere');
const messageBuilder = require('./helpers/messageBuilder');
const noDataTodayMessage = require('./helpers/noDataTodayMessage');
const devConfig = require('./config/config.dev.json');
const getMenuData = require('.');

const httpsArrayOnly = array => array.filter(a => a && typeof a === 'string' && a.includes('https'));

const WERDINO_WEBHOOK_ADDRESSES = process.env.WERDINO_WEBHOOK_ADDRESSES || devConfig.WERDINO_WEBHOOK_ADDRESSES;
const BUBENBERG_WEBHOOK_ADDRESSES = process.env.BUBENBERG_WEBHOOK_ADDRESSES || devConfig.BUBENBERG_WEBHOOK_ADDRESSES;

const ENVIORNMENT_DATA = {
	WERDINO: {
		NAME: 'Werdino',
		URL: 'https://clients.eurest.ch/de/tamediazuerich/menu',
		WEBHOOKS: httpsArrayOnly(WERDINO_WEBHOOK_ADDRESSES.split(',')),
	},
	BUBENBERG: {
		NAME: 'Bubenberg',
		URL: 'https://clients.eurest.ch/dzz/de/Bubenberg',
		WEBHOOKS: httpsArrayOnly(BUBENBERG_WEBHOOK_ADDRESSES.split(',')),
	},
};

function runWerdino() {
	Object.keys(ENVIORNMENT_DATA).map(key => {
		const slackTargetData = ENVIORNMENT_DATA[key];
		const { URL, WEBHOOKS, NAME } = slackTargetData;

		getMenuData(URL)
			.then(async data => {
				let blocks;

				if (data.error && data.error === 'NO_MENU_DATA_TODAY') {
					blocks = noDataTodayMessage(URL, NAME);
				} else {
					blocks = messageBuilder(data, URL, NAME);
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
