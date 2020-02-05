const bcrypt = require('bcryptjs');
const mail = require('../utils/mailService');

const help = require('../helpers/helper');

const User = require('../models/user');

exports.getSignin = (req, res, next) => {
  let errMsg = help.flashMsg(req, 'error');

  let succMsg = help.flashMsg(req, 'success');

  res.render('auth/signin', {
    errorMsg: errMsg,
    successMsg: succMsg
  });
};

exports.postSignin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        req.flash('error', 'Passwort oder Nutzername inkorrekt');
        return res.redirect('/signin');
      }
      bcrypt.compare(password, user.password).then(doMatch => {
        if (!doMatch) {
          console.log('Passwort stimmt nicht überein');
          req.flash('error', 'Passwort oder Nutzername inkorrekt');
          return res.redirect('/signin');
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
          console.log(err);
          res.redirect('/manage');
        });
      });
    })
    .catch(err => {
      console.log('err:', err);
    });
};

exports.getSignup = (req, res, next) => {
  let msg = help.flashMsg(req, 'error');

  res.render('auth/signup', {
    errorMsg: msg
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordconfirm;

  if (password != passwordConfirm) {
    req.flash('error', 'Passwörter stimmen nicht überein!');
    return res.redirect('/signup');
  }
  User.findOne({
    where: {
      email: email
    }
  })
    .then(user => {
      if (user) {
        req.flash('error', 'Email wird bereits verwendet');
        req.session.save(err => {
          return res.redirect('/signup');
        });
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          return User.create({
            email: email,
            password: hashedPassword,
            approvalCode: 0
          });
        })
        .then(user => {
          console.log('user created:', user.email);
          req.flash('success', 'Du wurdest erfolgreich registriert!');
          req.session.save(err => {
            res.redirect('/signin');
          });
          return mail.send(
            'Registrierung Erfolgreich',
            '<h1>Du wurdest erfolgreich registriert</h1>',
            user.email,
            'no-reply@chor.kalvarienbergkirche.at'
          );
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getLogout = (req, res, next) => {
  console.log('logout');
  req.session.destroy();
  res.redirect('/signin');
};
