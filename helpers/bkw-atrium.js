const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const condense = require('selective-whitespace');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

/**
 * Get BKW Atrium daily menu
 */
const getMenu = $ => {
	const day = {
		date: $('label[for="mp-tab1"]')
			.find('span.date')
			.text()
			.trim(),
		meals: {},
	};

	$('.menu-item').each((i, menuSection) => {
		const $menuSection = $(menuSection);

		// Cheerio doesn't know anything about visible elements,
		// so we should only grab the first four elements because
		// that is what is visible by default on the Atrium menu page
		if (i > 3) {
			return;
		}

		const id = i;

		if (!day.meals[id]) {
			day.meals[id] = {
				id: String(id),
			};
		}

		// Atrium does not use categories, but this will keep the data structure similar to eurest
		day.meals[id].category = '';

		day.meals[id].title = $menuSection
			.find('.menu-title')
			.text()
			.replace(/\s+/gm, ' ')
			.trim();

		day.meals[id].provenance = condense(
			$menuSection
				.find('.menu-provenance')
				.text()
				.trim()
		);

		day.meals[id].description = $menuSection
			.find('.menu-description')
			.text()
			.replace(/<br\s?\/>/gm, '')
			.replace(/\s+/gm, ' ')
			.trim();

		day.meals[id].prices = $menuSection
			.find('.menu-prices span.val')
			.map(
				(index, el) =>
					`${$(el)
						.text()
						.trim()} CHF`
			)
			.get();

		day.meals[id].vegetarian = $menuSection.find('.label-vegetarian').length > 0;
		day.meals[id].vegan = $menuSection.find('.label-vegan').length > 0;
	});

	return day;
};

/**
 * Export promise
 */
module.exports = async (url, debug = false) => {
	if (process.env.DEBUG_ATRIUM || debug) {
		const atriumData = fs.readFileSync(path.resolve(__dirname, '../__test__/fixtures/bkw-atrium.html'), 'utf8');
		return getMenu(cheerio.load(atriumData, { ignoreWhitespace: true }));
	}

	let browser;

	try {
		// We use puppeteer-core because puputeer on its own is too big to fit in a lambda function
	    browser = await puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath,
			headless: chromium.headless,
			ignoreHTTPSErrors: true,
		});

		const page = await browser.newPage();

		await page.goto(url, {
			waitUntil: 'networkidle0',
		});

		const pageData = await page.evaluate(() => ({
			html: document.documentElement.innerHTML,
		}));

		await browser.close();
		return getMenu(cheerio.load(pageData.html, { ignoreWhitespace: true }));
	} catch (error) {
		console.log('ERROR in ATRIUM SCRAPING', error);
	} finally {
		if (browser !== null && browser.close) {
			await browser.close();
		}
	}
};
