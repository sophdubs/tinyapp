const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = 8080;

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

// Separate this to its own file when refactoring**
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Users database
// Separate this to its own file when refactoring**
const users = {
  WpcvfS: { id: 'WpcvfS', email: 'test@gmail.com', password: 'lol' }
};

// Helper Func
// Separate this to a helperfunc file when refactoring**
const addUserToDB = function(email, password, userID) {
  users[userID] = {
    id: userID,
    email,
    password
  };
};

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
  console.log(urlDatabase);
  res.redirect(`/urls/${randomString}`);
});

const userExists = email => {
  return (Object.values(users).find(user => user.email === email) !== undefined);
}

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
  console.log(users);
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

// Going to need to change this, no longer using username
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});