module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    req.flash('error', 'Du bist nicht eingeloggt!');
    return res.redirect('/signin');
  }
  next();
};
