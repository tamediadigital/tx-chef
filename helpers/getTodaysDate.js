/**
 * Get today's date in a human-readable format like March 29, 2019
 */
const getTodaysDate = () => {
    var d = new Date()
  
    var options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  
    return d.toLocaleDateString('en-US', options)
  }

  module.exports = getTodaysDate;