const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Get the daily menu details from a Eurest page
 */
const getMenu = $ => {
  const day = {
    date: $('.date')
      .first()
      .text()
      .trim(),
    meals: {},
  };

  $('.list-item').each((i, menuSection) => {
    const $menuSection = $(menuSection);

    const category = $menuSection
      .find('.menuline')
      .text()
      .trim();

    if (!day.meals[category]) {
      day.meals[category] = {
        id: String(i),
      };
    }

    day.meals[category].title = $menuSection
      .find('h3')
      .text()
      .trim();

    day.meals[category].description =
			$menuSection
      .find('.wide p')
      .text()
				.trim() || null;

    day.meals[category].prices = $menuSection
      .find('.price-wrapper p')
      .map((index, el) =>
				$(el)
        .text()
        .trim()
        .replace('Extern', 'CHF'))
      .get();
  });

  return day;
};

/**
 * Export promise
 */
module.exports = url =>
	axios.get(url).then(res => {
  const { data } = res;

  if (process.env.DEBUG_EUREST) {
    const werdinoData = fs.readFileSync(path.resolve(__dirname, '../__test__/fixtures/werdino.html'), 'utf8');
    return getMenu(cheerio.load(werdinoData));
  }
  return getMenu(cheerio.load(data));
});
