const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Get Werdino daily menu
 */
const getMenu = $ => {
  const day = {
    date: $('.date').first()
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
      day.meals[category] = {};
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
      .map((i, el) =>
        $(el)
          .text()
          .trim()
          .replace('Extern', 'CHF')
      )
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

    return getMenu(cheerio.load(data));
  });
