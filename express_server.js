// Importing node modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// Importing databases
const { users } = require('./models/user_data');
const { urlDatabase } = require('./models/url_data');
// Importing helper functions
const { addUserToDB, generateRandomString, userExists, findUserByEmail } = require('./helpers/helpers');
// declaring variables
const PORT = 8080;


// Initializing app
const app = express();

// Setting configs and applying middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


// GET ROUTES:

// Home page
app.get('/', (req, res) => {
  res.send('Hello!');
});

// Displays a list of all shortURL and their associated longURL from the urlDatabase
app.get('/urls', (req, res) => {
  // extracting cookie and passing it in through templateVars for dynamic template depending on logged in state
  let userID = req.cookies['user_id'];
  let user = users[userID]
  let templateVars = { 
    urls: urlDatabase,
    user
  };
  res.render("urls_index", templateVars);
});

// Form to create a new shortURL and add it to database
app.get('/urls/new', (req, res) => {
  // extracting cookie and passing it in through templateVars for dynamic template depending on logged in state
  let userID = req.cookies['user_id'];
  let user = users[userID];
  let templateVars = {
    user
  };
  res.render("urls_new", templateVars);
});

// Shows page for individual shortURL
app.get('/urls/:shortURL', (req, res) => {
  // extracting cookie and passing it in through templateVars for dynamic template depending on logged in state
  let userID = req.cookies['user_id'];
  let user = users[userID]
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user
  };
  res.render("urls_show", templateVars);
});

// Redirects the user to the longURL associated to the given shortURL
app.get('/u/:shortURL', (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
})

// Displays the urlDatabase in javascript object notation (JSON)
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// Renders the html directly on the page
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n')
});

// Form for user to register as a new user
app.get('/register', (req, res) => {
  const templateVars = {user: null};
  res.render("register", templateVars);
});

// Form for user to login as existing user
app.get('/login', (req, res) => {
  const templateVars = {user: null};
  res.render("login", templateVars);
});


// POST ROUTES:

// Creating a new shortURL/longURL entry in the database and redirect to /urls
app.post('/urls', (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});

// Adds new user to users db
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

  // Generate UID and store new user in the db
  const userID = generateRandomString();
  addUserToDB(email, password, userID);
  
  // Set cookie to maintain logged in state
  res.cookie('user_id', userID);
  
  res.redirect('/urls');
});

// Deletes short url from db
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

// Edit urlDatabase to update the value of the longURL
app.post('/urls/:shortURL', (req, res) => {
  let newLongURL = req.body.new_long_URL;
  urlDatabase[req.params.shortURL] = newLongURL;
  res.redirect('/urls');
});

// Login user
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

  // User exists and password is a match, set cookie to maintain logged in state
  res.cookie('user_id', userObj.id);
  
  res.redirect('/urls');
});

// Logout user
app.post('/logout', (req, res) => {
  // Clear cookie to return to a logged out state
  res.clearCookie('user_id');
  
  res.redirect('/urls');
})

// Starts server on given port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});