const { users } = require('../models/user_data');

// Adds user to db
const addUserToDB = function(email, password, userID) {
  users[userID] = {
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
const userExists = email => {
  return (Object.values(users).find(user => user.email === email) !== undefined);
};

// Returns user matching the given email
const findUserByEmail = email => {
  const user = Object.values(users).find(user => user.email === email);
  return user;
};


module.exports = { addUserToDB, generateRandomString, userExists, findUserByEmail };