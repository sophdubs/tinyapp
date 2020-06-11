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
    expect(testUsers['1234']).to.not.be.undefined;
    expect(testUsers['1234']).to.deep.equal({id: '1234', email: 'test@gmail.com', password: 'password'});
  });
});

describe('#generateRandomString', function() {
  let randomString = generateRandomString();
  it('should generate a random alphanumeric string', function() {
    expect(!randomString.match(/^[A-Za-z0-9]+$/)).to.be.false;
  });
  it('should generate a random string of length 6', function() {
    expect(randomString.length).to.equal(6);
  });
});

describe('#userExists', function() {
  it('should return true if user exists in the user database', function() {
    let email = 'user@example.com'
    expect(userExists(email, testUsers)).to.be.true;
  });
  it('should return false if user does not exist in the user database', function() {
    let email = 'notAuser@example.com'
    expect(userExists(email, testUsers)).to.be.false;
  });
});