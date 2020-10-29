require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const csrf = require('csurf');
const bcrypt = require('bcryptjs');
const schedule = require('node-schedule');
const debug = require('debug');

const help = require('./helpers/helper');
const dbAction = require('./helpers/dbRequest');
const prototype = require('./helpers/prototype');

const webSocket = require('./controller/webSocket');
const errorController = require('./controller/error');
const Concert = require('./models/concert');
const Info = require('./models/info');
const Buyer = require('./models/buyer');
const Ticket = require('./models/ticket');
const Sector = require('./models/sector');
const Row = require('./models/row');
const Availability = require('./models/availability');
const User = require('./models/user');

const app = express();
const csrfProtection = csrf();

exports.app = app;

app.locals.moment = require('moment');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

var sessionStore = new SequelizeStore({
  db: sequelize,
});
app.use(
  session({
    secret: process.env.HASH_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
sessionStore.sync();
// app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  if (req.session.user) {
    res.locals.approval = req.session.user.approvalCode;
    res.locals.email = req.session.user.email;
  }
  res.locals.errorMsg = help.flashMsg(req, 'error');
  res.locals.successMsg = help.flashMsg(req, 'success');
  next();
});

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use(authRoutes);
app.use('/manage', adminRoutes);
app.use(userRoutes);

app.use(errorController.get404);

Concert.hasOne(Info);
Concert.hasMany(Buyer);
Buyer.hasMany(Ticket);
Buyer.belongsTo(Concert);
Concert.hasMany(Availability);
Concert.hasMany(Row);
Ticket.belongsTo(Row);
Row.hasMany(Ticket);
Sector.hasMany(Row);
Row.belongsTo(Sector);
Row.belongsTo(Concert);

Buyer.afterCreate(async (buyer, options) => {
  buyer.orderId = buyer.id + 4861;
  await buyer.save();
});

sequelize
  .sync({
    // force: true,
  })
  .then((result) => {
    console.log('------------------');
    console.log('\x1b[36m%s\x1b[0m', 'Database syncronised');
    return Sector.findAll();
  })
  .then((sectors) => {
    if (sectors.length == 0) {
      return Sector.create({
        price: 35,
      })
        .then((sec) => {
          return Sector.create({
            price: 30,
          });
        })
        .then((sec) => {
          return Sector.create({
            price: 27,
          });
        })
        .then((sec) => {
          return Sector.create({
            price: 25,
          });
        })
        .then((sec) => {
          return Sector.create({
            price: 20,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return User.findByPk(1);
  })
  .then((user) => {
    if (user) return user;
    return bcrypt.hash(process.env.ADMIN_PASS, 12).then((hashedPass) => {
      return User.create({
        id: 1,
        email: 'official@johannes-zottele.at',
        password: hashedPass,
        approvalCode: 15,
      });
    });
  })
  .then((result) => {
    // Port 8080 for Google App Engine
    app.set('port', process.env.PORT || 3000);
    const server = app.listen(app.get('port'), () => {
      console.log('\x1b[0m', 'Listen on Port ' + app.get('port'));
    });

    webSocket.run(server);

    const rule = new schedule.RecurrenceRule();
    rule.minute = 32;

    const j = schedule.scheduleJob(rule, async () => {
      console.log('Verfallene Ticketreservierungen löschen...', new Date());
      console.log('Deleted OrderIds: ', await dbAction.deleteExpiredOrders());
    });
  })
  .catch((err) => {
    console.log(err);
  });
