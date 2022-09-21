const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const condense = require('selective-whitespace');
const chromium = require('chrome-aws-lambda');

/**
 * Get the daily menu details from a Eurest page
 */
const getMenu = $ => {
  const day = {
    date: condense($('.date')
      .first()
      .text()),
    meals: {},
  };

  $('.list-item').each((i, menuSection) => {
    const $menuSection = $(menuSection);

    const id = i;

    if (!day.meals[id]) {
      day.meals[id] = {
        id: String(id),
      };
    }
  
    day.meals[id].category = $menuSection
    .find('.menuline')
    .text()
    .trim() || null;

    day.meals[id].title = $menuSection
      .find('h3')
      .text()
      .trim();

    day.meals[id].description =
			$menuSection
      .find('.wide p')
      .text()
				.trim() || null;

    day.meals[id].prices = $menuSection
      .find('.price-wrapper p')
      .map((index, el) =>
				$(el)
        .text()
        .trim()
        .replace('Extern', 'CHF'))
      .get();
  });

  // clean up the extra whitespace in the elements
  Object.keys(day.meals).forEach(dayKey => {
    const meal = day.meals[dayKey];
    meal.category = condense(meal.category);
    meal.title = condense(meal.title);
    meal.prices = meal.prices.map(price => condense(price));
    meal.description = typeof meal.description === 'string' ? condense(meal.description) : meal.description;
  });

  return day;
};

/**
 * Export promise
 */
module.exports = async (url, debug = false) => {
  if (process.env.DEBUG_EUREST || debug) {
    const werdinoData = fs.readFileSync(path.resolve(__dirname, '../__test__/fixtures/werdino.html'), 'utf8');
    return getMenu(cheerio.load(werdinoData, { ignoreWhitespace: true }));
  }

  let browser;

  try {

    // We load pupputeer only for local tests, otherwise puppeteer is
    // too big of a dependency to fit in a lambda function
    if (process.env.ENVIRONMENT === 'local') {
      const puppeteer = require('puppeteer'); // eslint-disable-line import/no-extraneous-dependencies, global-require
      browser = await puppeteer.launch();
    } else {
      // In the real lambda function we use the puppeteer version provided by the lambda environment
      browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    }

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
    console.log('ERROR in EUREST SCRAPING', error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

module.exports.getMenu = getMenu;