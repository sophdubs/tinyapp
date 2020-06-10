const { users } = require('../models/user_data');

const addUserToDB = function(email, password, userID) {
  users[userID] = {
    id: userID,
    email,
    password
  };
};

function generateRandomString() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let str = '';
  while (str.length !== 6) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};

const userExists = email => {
  return (Object.values(users).find(user => user.email === email) !== undefined);
};

const findUserByEmail = email => {
  const user = Object.values(users).find(user => user.email === email);
  return user;
};


module.exports = { addUserToDB, generateRandomString, userExists, findUserByEmail };