const fetch = require('fetch-everywhere');
const messageBuilder = require('./helpers/messageBuilder');
const noDataTodayMessage = require('./helpers/noDataTodayMessage');
const devConfig = require('./config/config.dev.json');
const getWerdinoData = require('.');

const getWebhookAddresses = () => {
	const addresses = [
		process.env.SLACK_WEBHOOK_ADDRESS,
		process.env.SLACK_WEBHOOK_ADDRESS2,
		process.env.SLACK_WEBHOOK_ADDRESS3,
	].filter(a => typeof a === 'string');

	if (addresses.length === 0) {
		return [devConfig.SLACK_WEBHOOK_ADDRESS];
	}

	return addresses;
};

function runWerdino() {
	getWerdinoData()
		.then(async data => {
			let blocks;

			if (data.error && data.error === 'NO_MENU_DATA_TODAY') {
				blocks = noDataTodayMessage();
			} else {
				blocks = messageBuilder(data);
			}

			await Promise.all(
				getWebhookAddresses().map(address => {
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
		.catch(err => console.log(`Error in getWerdinoData: ${err}`));
}

module.exports.runWerdino = runWerdino;
