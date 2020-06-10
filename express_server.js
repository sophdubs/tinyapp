const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = 8080;

const { users } = require('./models/user_data');
const { urlDatabase } = require('./models/url_data');



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

function generateRandomString() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let str = '';
  while (str.length !== 6) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};


// Helper Funcs
// Separate this to a helperfunc file when refactoring**
const addUserToDB = function(email, password, userID) {
  users[userID] = {
    id: userID,
    email,
    password
  };
};

const userExists = email => {
  return (Object.values(users).find(user => user.email === email) !== undefined);
};

const findUserByEmail = email => {
  const user = Object.values(users).find(user => user.email === email);
  return user;
};

// end of helper funcs 

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls', (req, res) => {
  let userID = req.cookies['user_id'];
  let user = users[userID]
  let templateVars = { 
    urls: urlDatabase,
    user
  };
  res.render("urls_index", templateVars);
});

app.get('/urls/new', (req, res) => {
  let userID = req.cookies['user_id'];
  let user = users[userID];
  let templateVars = {
    user
  };
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let userID = req.cookies['user_id'];
  let user = users[userID]
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user
  };
  res.render("urls_show", templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
})

app.get('/urls.json', (req, res) => {
  res.send(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n')
});

app.get('/register', (req, res) => {
  const templateVars = {user: null};
  res.render("register", templateVars);
});

app.get('/login', (req, res) => {
  const templateVars = {user: null};
  res.render("login", templateVars);
});

app.post('/urls', (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});


app.post('/register', (req, res) => {
  const {email, password} = req.body;

  // If email or password is empty string, send back response with 400 status code
  if (!email || !password) {
    res.status(400).send('Error: email and/or password field empty.');
  }

  // If user tries to register with an email already in the users DB, sent back response with 400 status code
  if (userExists(email)) {
    res.status(400).send('Error: email is already registered.');
  }

  const userID = generateRandomString();
  addUserToDB(email, password, userID);
  res.cookie('user_id', userID);
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  let newLongURL = req.body.new_long_URL;
  urlDatabase[req.params.shortURL] = newLongURL;
  res.redirect('/urls');
});


app.post('/login', (req, res) => {
  // extract information from request
  const {email, password} = req.body;

  // find user in users DB by email (if no user is found, user will be undefined)
  const userObj = findUserByEmail(email);

  // if no user with that email, return response with 403 status code
  if (!userObj) {
    res.status(403).send('That email is not registered');
  }

  // if user exists but password does not match, return response with 4-3 status code
  if (userObj.password !== password) {
    res.status(403).send('Password is incorrect');
  } 

  // User exists and password is a match
  res.cookie('user_id', userObj.id);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});