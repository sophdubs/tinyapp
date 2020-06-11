// Importing node modules
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
// Importing databases
const { users } = require('./models/user_data');
const { urlDatabase } = require('./models/url_data');
// Importing helper functions
const { addUserToDB, generateRandomString, userExists, findUserByEmail, urlsForUser } = require('./helpers/helpers');
// declaring variables
const PORT = 8080;
const SALT = 10;


// Initializing app
const app = express();


// Setting configs and applying middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['f080ac7b-b838-4c5f-a1f4-b0a9fee10130', 'c3fb18be-448b-4f6e-a377-49373e9b7e1a']
}));


// GET ROUTES:

// Home page
app.get('/', (req, res) => {
  // Redirect to login if not logged in
  let userID = req.session.user_id;
  if (! userID) {
    res.redirect('/login');
    return;
  }
  // Redirect to urls if logged in
  res.redirect('/urls');
});

// Displays a list of all the shortURLs and the associated longURLs created by the current user
app.get('/urls', (req, res) => {
  // extracting cookie and passing it in through templateVars for dynamic template depending on logged in state
  let userID = req.session.user_id;
  // filtering the urls based on the current user so the user can only see their own urls
  const filteredURLs = urlsForUser(userID, urlDatabase);
  let user = users[userID];
  let templateVars = {
    urls: filteredURLs,
    user
  };
  res.render("urls_index", templateVars);
});

// Form to create a new shortURL and add it to database
app.get('/urls/new', (req, res) => {
  // extracting cookie and passing it in through templateVars for dynamic template depending on logged in state
  let userID = req.session.user_id;

  // If user is not logged in, they cannot create new urls are are redirected to login page
  if (!userID) {
    res.redirect('/login');
    return;
  }

  let user = users[userID];
  let templateVars = {
    user
  };
  res.render("urls_new", templateVars);
});

// Shows page for individual shortURL
app.get('/urls/:shortURL', (req, res) => {
  // extracting cookie and passing it in through templateVars for dynamic template depending on logged in state
  let userID = req.session.user_id;
  let shortURL = req.params.shortURL;
  // If record does not exist, return status code 400 and relevent HTML
  if (!urlDatabase[shortURL]) {
    res.status(400).render('no_record', {shortURL, user: users[userID]});
    return;
  }
  let isCreator = urlDatabase[shortURL].userID === userID;
  let user = users[userID];
  let templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user,
    isCreator
  };
  res.render("urls_show", templateVars);
});

// Redirects the user to the longURL associated to the given shortURL
app.get('/u/:shortURL', (req, res) => {
  let userID = req.session.user_id;
  let shortURL = req.params.shortURL;
  // If shortURL doesn't exist, return statuscode 400 and relevent html
  if (!urlDatabase[shortURL]) {
    res.status(400).render('no_record', {shortURL, user: users[userID]});
    return;
  }
  res.redirect(urlDatabase[shortURL].longURL);
});

// Displays the urlDatabase in javascript object notation (JSON)
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// Renders the html directly on the page
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

// Form for user to register as a new user
app.get('/register', (req, res) => {
  // If user is logged in, they are redirected to /urls
  let userID = req.session.user_id;
  if (userID) {
    res.redirect('/urls');
    return;
  }
  const templateVars = {user: userID};
  res.render("register", templateVars);
});

// Form for user to login as existing user
app.get('/login', (req, res) => {
  // If user is already logged in, they are redirected to /urls
  let userID = req.session.user_id;
  if (userID) {
    res.redirect('/urls');
    return;
  }
  const templateVars = {user: userID};
  res.render("login", templateVars);
});


// POST ROUTES:

// Creating a new shortURL/longURL entry in the database and redirect to /urls
app.post('/urls', (req, res) => {
  let randomString = generateRandomString();
  let currUser = req.session.user_id;
  urlDatabase[randomString] = {
    longURL: req.body.longURL,
    userID: currUser
  };
  res.redirect(`/urls/${randomString}`);
});

// Adds new user to users db
app.post('/register', (req, res) => {
  const {email, password} = req.body;
  // Use bcrypt to hash the password so as not to store it in plain text in our users db
  const hashedPassword = bcrypt.hashSync(password, SALT);

  // If email or password is empty string, send back response with 400 status code
  if (!email || !password) {
    res.status(400).render('invalid_credentials', { errorMsg:'Error: email and/or password field empty.', user: null});
    return;
  }

  // If user tries to register with an email already in the users DB, sent back response with 400 status code
  if (userExists(email, users)) {
    res.status(400).render('invalid_credentials', { errorMsg:`Error: ${email} is already registered`, user: null});
    return;
  }

  // Generate UID and store new user in the db
  const userID = generateRandomString();
  addUserToDB(email, hashedPassword, userID, users);
  
  // Set cookie to maintain logged in state
  req.session.user_id = userID;
  
  res.redirect('/urls');
});

// Deletes short url from db
app.post('/urls/:shortURL/delete', (req, res) => {
  let currUser = req.session.user_id;
  if (currUser !== urlDatabase[req.params.shortURL].userID) {
    res.status(400).send('Error: cannot delete another creator\'s URL');
    return;
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

// Edit urlDatabase to update the value of the longURL
app.post('/urls/:shortURL', (req, res) => {
  let currUser = req.session.user_id;
  if (currUser !== urlDatabase[req.params.shortURL].userID) {
    res.status(400).send('Error: cannot edit another creator\'s URL');
    return;
  }
  let newLongURL = req.body.new_long_URL;
  urlDatabase[req.params.shortURL].longURL = newLongURL;
  res.redirect('/urls');
});

// Login user
app.post('/login', (req, res) => {
  // extract information from request
  const {email, password} = req.body;

  // find user in users DB by email (if no user is found, user will be undefined)
  const userObj = findUserByEmail(email, users);

  // if no user with that email, return response with 403 status code
  if (!userObj) {
    res.status(400).render('invalid_credentials', { errorMsg:`Error: ${email} is not registered`, user: null});
    return;
  }

  // if user exists but password does not match, return response with 4-3 status code
  // (using bcrypt to compare passwords because stored password has been hashed)
  if (!bcrypt.compareSync(password, userObj.password)) {
    res.status(400).render('invalid_credentials', { errorMsg:'Error: invalid email/password combination', user: null});
    return;
  }

  // User exists and password is a match, set cookie to maintain logged in state
  req.session.user_id = userObj.id;
  
  res.redirect('/urls');
});

// Logout user
app.post('/logout', (req, res) => {
  // Clear cookie to return to a logged out state
  req.session.user_id = null;
  
  res.redirect('/urls');
});

// Starts server on given port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});