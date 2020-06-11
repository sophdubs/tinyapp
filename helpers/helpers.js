const { users } = require('../models/user_data');
const { urlDatabase } = require('../models/url_data');

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
const findUserByEmail = email => {
  const user = Object.values(users).find(user => user.email === email);
  return user;
};

// Returns a filtered object containing only the url objects that were created by the given user
const urlsForUser = userID => { 
  let usersURLs = {};
  for (let [id, urlObj] of Object.entries(urlDatabase)) {
    if (urlObj.userID === userID) {
      usersURLs[id] = urlObj;
    }
  }
  return usersURLs;
};


module.exports = { addUserToDB, generateRandomString, userExists, findUserByEmail, urlsForUser };