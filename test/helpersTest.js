const { assert, expect } = require('chai');

const { addUserToDB, generateRandomString, userExists, findUserByEmail, urlsForUser } = require('../helpers/helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('#addUserToDB', function() {
  it('should successfully add user to user database', function() {
    const id = '1234';
    const email = 'test@gmail.com';
    const password = "password";
    addUserToDB(email, password, id, testUsers);
    // Checking that the entry exists
    expect(testUsers['1234']).to.not.be.undefined;
    // Checking that the user object matches the expected user object
    expect(testUsers['1234']).to.deep.equal({id: '1234', email: 'test@gmail.com', password: 'password'});
  });
});

describe('#generateRandomString', function() {
  it('should generate a random alphanumeric string of 6 characters', function() {
    let randomString = generateRandomString();
    // Checking that string is alphanumeric
    expect(!'randomString'.match(/^[A-Za-z0-9]+$/)).to.be.false;
    // Checking that string is of length 6
    expect(randomString.length).to.equal(6);
  });
});