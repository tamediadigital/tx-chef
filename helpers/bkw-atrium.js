const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const condense = require('condense-whitespace');

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

		const title = 
			$menuSection
				.find('.menu-title')
				.text()
				.replace(/\s+/gm, ' ')
				.trim();

		if (!day.meals[title]) {
			day.meals[title] = {
				title,
				id: String(i),
			};
		}

		day.meals[title].provenance = condense(
			$menuSection
				.find('.menu-provenance')
				.text()
				.trim()
		);

		day.meals[title].description = $menuSection
			.find('.menu-description')
			.text()
			.replace(/<br\s?\/>/gm, '')
			.replace(/\s+/gm, ' ')
			.trim();

		day.meals[title].prices = $menuSection
			.find('.menu-prices span.val')
			.map(
				(index, el) =>
					`${$(el)
						.text()
						.trim()} CHF`
			)
			.get();

		day.meals[title].vegetarian = $menuSection.find('.label-vegetarian').length > 0;
		day.meals[title].vegan = $menuSection.find('.label-vegan').length > 0;
	});

	return day;
};

/**
 * Export promise
 */
module.exports = url =>
	axios.get(url).then(res => {
		const { data } = res;

		if (process.env.DEBUG_ATRIUM) {
			const atriumData = fs.readFileSync(path.resolve(__dirname, '../__test__/fixtures/bkw-atrium.html'), 'utf8');
			return getMenu(cheerio.load(atriumData));
		  }
		return getMenu(cheerio.load(data));
	});
