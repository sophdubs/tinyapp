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