'use strict'
const superb = require('superb')
const getTodaysDate = require('./getTodaysDate');

/**
 * Determine which emoji should be used for specific (or unknown titles)
 * @param {String} title 
 */
const getIconForTitle = title => {
  const lowerTitle = title.toLowerCase()
  switch (lowerTitle) {
    case 'brasserie':
      return ':meat_on_bone:'
    case 'grün und natürlich':
      return ':broccoli:'
    case 'feuer und flamme':
      return ':fire:'
    case 'tagessuppe':
      return ':ramen:'
    default:
      return ':mega:'
  }
}

/**
 * Wrap the description in underscores, or return an empty string.
 * Mainly to force the prefered formatting.
 * @param {String|undefined} str 
 */
const getDescription = str => {
  if (typeof str === 'string' && str.length > 0) {
    return `_${str}_`
  }
  return ' '
}

/**
 * Build a block for Slack using the supplied language data
 * @param {Object} obj 
 */
const sectionBuilder = obj => {
  const section = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${getIconForTitle(obj.title)} *${obj.titleEn}*`
      }
    },
    {
      type: 'divider'
    },

    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `:flag-gb: *${obj.mealTitleEn}*\n${getDescription(
            obj.descriptionEn
          )}`
        },
        {
          type: 'mrkdwn',
          text: `:flag-de: *${obj.mealTitle}*\n${getDescription(
            obj.description
          )}`
        }
      ]
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `${obj.price}\n \n`
        }
      ]
    }
  ]

  return section
}

/**
 * Build the actual message blocks including the "header", sections and "footer"
 * @param {Object} obj 
 */
function messageBuilder (obj) {
  // Blocks stqrts off with Header only
  let blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Werdino menu for *${getTodaysDate()}*\n \n`
      }
    }
  ]

  // Now add in each section with the menu information for the day
  obj.forEach(o => {
    blocks = blocks.concat([...sectionBuilder(o)])
  })

  // Now attach the footer
  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Doodle hopes your day is *${superb.random()}*! | <https://clients.eurest.ch/de/tamediazuerich/menu|Online Werdino menu>`
      }
    ]
  })

  return blocks
}

module.exports = messageBuilder
