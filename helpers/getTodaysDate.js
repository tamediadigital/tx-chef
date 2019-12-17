/**
 * Get today's date in a human-readable format like March 29, 2019
 */
const getTodaysDate = () => {
	const d = new Date();

  const options = {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	};

	return d.toLocaleDateString('en-US', options);
};

module.exports = getTodaysDate;
