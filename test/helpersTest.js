const { expect } = require('chai');

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

const testUrlDB = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  test01: { longURL: "https://www.testURL1.ca", userID: "AAAAAA" },
  test02: { longURL: "https://www.testURL2.ca", userID: "AAAAAA" }
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
  const randomString = generateRandomString();
  it('should generate a random alphanumeric string', function() {
    expect(!randomString.match(/^[A-Za-z0-9]+$/)).to.be.false;
  });
  it('should generate a random string of length 6', function() {
    expect(randomString.length).to.equal(6);
  });
});

describe('#userExists', function() {
  it('should return true if user exists in the user database', function() {
    const email = 'user@example.com';
    expect(userExists(email, testUsers)).to.be.true;
  });
  it('should return false if user does not exist in the user database', function() {
    const email = 'notAuser@example.com';
    expect(userExists(email, testUsers)).to.be.false;
  });
});

describe('#findUserByEmail', function() {
  it('should return the user if user exists in the user database', function() {
    const email = 'user@example.com';
    expect(findUserByEmail(email, testUsers)).to.deep.equal({
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    });
  });
  it('should return undefined if user does not exist in the user database', function() {
    const email = 'notAuser@example.com';
    expect(findUserByEmail(email, testUsers)).to.be.undefined;
  });
});

describe('#urlsForUser', function() {
  const user1 = 'AAAAAA';
  const user2 = 'BBBBBB';
  const urlsForUser1 = urlsForUser(user1, testUrlDB);
  it('should return a filtered object containing only the urls created by the user', function() {
    expect(Object.keys(urlsForUser1).length).to.equal(2);
    expect(urlsForUser1['test01']).to.deep.equal({longURL: "https://www.testURL1.ca", userID: "AAAAAA"});
    expect(urlsForUser1['test02']).to.deep.equal({longURL: "https://www.testURL2.ca", userID: "AAAAAA"});
  });
  it('should return an empty object if user has not created any urls', function() {
    expect(urlsForUser(user2, testUrlDB)).to.deep.equal({});
  });
});
