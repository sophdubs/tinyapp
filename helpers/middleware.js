const setCurrentUser = () => {

};

const ensureCredentialsPresent = (req, res, next) => {
  const {email, password} = req.body;
  if (!email || !password) {
    res.status(400).render('invalid_credentials', { errorMsg:'Error: email and/or password field empty.', user: null});
    return;
  }
  next();
};

module.exports  = { setCurrentUser, ensureCredentialsPresent};