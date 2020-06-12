const analyticsDB = {};

/*
An entry will look like this:
'shortURL': {
  dateCreated: new Date(Date.now()).toLocaleString(),
  visits: 0,
  visitors: {
    visitor_ID: [dates visited]
  }
}
*/

module.exports = { analyticsDB };