'use strict';
const superb = require('superb');
const getTodaysDate = require('./getTodaysDate');
const { ISSUES_LINK } = require('../constants');

function noDataTodayMessage() {
	let blocks = [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `:cry: *Uh oh.* We were unable to find Werdino Menu data for *${getTodaysDate()}*! :sob: Maybe it's a weekend, or a public holiday...or maybe Werdino is on strike? Or maybe you want to <${ISSUES_LINK}|report a problem with this Slack Integration>.\n\n:rainbow: *Worry not! You can still eat lunch! :sandwich:*\n\n- Check the <https://clients.eurest.ch/de/tamediazuerich/menu|Online Werdino menu> (just in case)\n- Check out some of the <https://www.google.com/search?rlz=1C5CHFA_enCH774CH774&q=restaurants%20near%20tamedia%20zurich&npsic=0&rflfq=1&rlha=0&rllag=47380586,8537624,857&tbm=lcl&ved=2ahUKEwje-Oqn6anhAhVVVBUIHQDpCKoQjGp6BAgKEDo&tbs=lrf:!2m1!1e3!2m4!1e2!5m2!2m1!2e80!3sIAE,lf:1,lf_ui:9&rldoc=1&rlfi=hd:;si:&qop=0#qop=0&rlfi=hd:;si:;mv:!1m2!1d47.37722708041483!2d8.540170626837494!2m2!1d47.37190139812913!2d8.526652293402435!4m2!1d47.37456430650411!2d8.533411460119964!5i17|highest rated restaurants in the area>\n- Try your luck with a <https://jamesoff.net/fun/random-recipe-generator/|random reciepe>\n- Or just make a sandwich...`,
			},
		},
		{
			type: 'divider',
		},
		{
			type: 'context',
			elements: [
				{
					type: 'mrkdwn',
					text: `Hopefully your lunch is *${superb.random()}*!`,
				},
			],
		},
	];

	return blocks;
}

module.exports = noDataTodayMessage;
