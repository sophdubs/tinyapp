const analyticsDB = {};

/*
An entry will look like this:
'shortURL': {
  dateCreated: new Date(Date.now()).toLocaleString().split(',')[0],
  visits: 0,
  visitors: {
    visitor_ID: [dates visited]
  }
}
*/

module.exports = { analyticsDB };