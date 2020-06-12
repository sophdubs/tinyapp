// Adds user to db
const addUserToDB = function(email, password, userID, db) {
  db[userID] = {
    id: userID,
    email,
    password
  };
};

// Generates a random string of 6 characters using A-Z, a-z, 0-9 chars.
const generateRandomString = function() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let str = '';
  while (str.length !== 6) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};

// Returns boolean based on if user email is already in user database.
const userExists = (email, db) => {
  return (Object.values(db).find(user => user.email === email) !== undefined);
};

// Returns user matching the given email
const findUserByEmail = (email, db) => {
  const user = Object.values(db).find(user => user.email === email);
  return user;
};

// Returns a filtered object containing only the url objects that were created by the given user
const urlsForUser = (userID, db) => {
  const usersURLs = {};
  for (const [id, urlObj] of Object.entries(db)) {
    if (urlObj.userID === userID) {
      usersURLs[id] = urlObj;
    }
  }
  return usersURLs;
};

const addURLToAnalytics = (shortURL, db) => {
  let urlObj = {
    dateCreated: new Date(Date.now()).toLocaleString(),
    visits: 0,
    visitors: {}
  };
  db[shortURL] = urlObj;
};


module.exports = { addUserToDB, generateRandomString, userExists, findUserByEmail, urlsForUser, addURLToAnalytics };