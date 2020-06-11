// Custom middleware which ensures both email and password were provided by the user
const ensureCredentialsPresent = (req, res, next) => {
  const {email, password} = req.body;
  // If one or both are missing, user is shown an appropriate error message and encouraged to log in or register
  if (!email || !password) {
    res.status(400).render('invalid_credentials', { errorMsg:'Error: email and/or password field empty.', user: null});
    return;
  }
  next();
};

module.exports  = { ensureCredentialsPresent};