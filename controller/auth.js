const bcrypt = require('bcryptjs');
const mail = require('../utils/mailService');

const { isToday, getSeatName } = require('../helpers/helper');

const { Concert, Buyer, User, Ticket } = require('../models/index');

exports.getSignin = (req, res, next) => {
  res.render('auth/signin');
};

exports.postSignin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Passwort oder Nutzername inkorrekt');
        return res.redirect('/signin');
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (!doMatch) {
          console.log('Passwort stimmt nicht überein');
          req.flash('error', 'Passwort oder Nutzername inkorrekt');
          return res.redirect('/signin');
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
          console.log(err);
          res.redirect('/manage');
        });
      });
    })
    .catch((err) => {
      console.log('err:', err);
    });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup');
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
      email: email,
    },
  })
    .then((user) => {
      if (user) {
        req.flash('error', 'Email wird bereits verwendet');
        req.session.save((err) => {
          return res.redirect('/signup');
        });
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          return User.create({
            email: email,
            password: hashedPassword,
            approvalCode: 0,
          });
        })
        .then((user) => {
          console.log('user created:', user.email);
          req.flash('success', 'Du wurdest erfolgreich registriert!');
          req.session.save((err) => {
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
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogout = (req, res, next) => {
  console.log('logout');
  req.session.destroy();
  res.redirect('/signin');
};

//App Stuff ONLY
//
const settedPassword = 'aiqpdf32dsadfu1nbcsolx01';
const getAppDataStructur = () => {
  return {
    status: null,
    data: {
      orderId: null,
      name: null,
      email: null,
      phone: null,
    },
    msg: null,
  };
};

exports.getQRcheck = (req, res, next) => {
  const orderId = req.query.oid;
  const password = req.query.pw;

  let data = getAppDataStructur();

  if (password != settedPassword) {
    data.status = 'noAccess';
    data.msg = 'Kein Zugriff auf die Datenbank!';
    return res.json(data);
  }

  Buyer.findAll({
    where: { orderId: orderId },
    include: [{ model: Concert }, { model: Ticket }],
  })
    .then((buyers) => {
      const buyer = buyers[0];
      const concert = buyer.concert;

      data = {
        status: null,
        data: {
          orderId: buyer.orderId,
          name: buyer.name.toUpperCase() + ' ' + buyer.firstname,
          email: buyer.email,
          phone: buyer.phone,
          concert: {
            name: concert.name,
            date: concert.date,
            time: concert.time,
          },
        },
        msg: null,
      };

      if (!isToday(buyer.concert.date)) {
        data.status = 'wrongConcert';
        data.msg = 'Heute ist nicht das Konzert für dieses Ticket!';
      } else if (!buyer.is_paid) {
        data.status = 'notPaid';
        data.msg = 'Das Ticket wurde noch nicht bezahlt!';
      } else if (buyer.scanned) {
        data.status = 'scanned';
        data.msg =
          'Das Ticket wurde bereits gescannt und ist nicht mehr gültig!';
      } else {
        data.data.tickets = [];

        buyer.tickets.forEach((ticket) => {
          data.data.tickets.push({
            name: getSeatName(ticket.rowName),
            quantiy: ticket.amount,
            price: ticket.price,
          });
        });

        data.status = 'ok';
        data.msg = 'Die Karte ist gültig';
      }

      res.json(data);
    })
    .catch((err) => {
      console.log(err);

      data.status = 'invalid';
      data.msg = 'Ticket nicht vorhanden!';
      res.json(data);
    });
};

exports.getQRchecked = (req, res, next) => {
  const orderId = req.query.oid;
  const password = req.query.pw;

  let data = getAppDataStructur();

  if (password != settedPassword) {
    data.status = 'noAccess';
    data.msg = 'Kein Zugriff auf die Datenbank!';
    return res.json(data);
  }

  Buyer.findAll({ where: { orderId: orderId } })
    .then((buyers) => {
      if (buyers[0] == null) {
        data.status = 'notExisting';
        data.msg = 'Ticket exestiert nicht!';
        return res.json(data);
      }
      const buyer = buyers[0];
      buyer.scanned = true;
      return buyer.save();
    })
    .then((buyer) => {
      data.status = 'ok';
      data.msg = 'Ticketstatus aktualisiert';
      return res.json(data);
    })
    .catch((err) => {
      console.error('err:', err);
      data.status = 'failure';
      data.msg = 'Es gab einen Datenbankfehler!';
      return res.json(data);
    });
};
