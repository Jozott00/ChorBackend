require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const path = require('path');

const webSocket = require('./controller/webSocket');
const errorController = require('./controller/error');
const Concert = require('./models/concert');
const Info = require('./models/info');
const Buyer = require('./models/buyer');
const Ticket = require('./models/ticket');
const Sector = require('./models/sector');
const Row = require('./models/row');
const Availability = require('./models/availability');

const app = express();
app.locals.moment = require('moment');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
app.use('/manage', adminRoutes);
app.use(userRoutes);

app.use(errorController.get404);

Concert.hasOne(Info);
Concert.hasMany(Buyer);
Buyer.hasMany(Ticket);
Concert.hasMany(Availability);
Concert.hasMany(Row);

sequelize
  .sync({
    // force: true
  })
  .then(result => {
    console.log('------------------');
    console.log('\x1b[36m%s\x1b[0m', 'Database syncronised');
    return Sector.findAll();
  })
  .then(sectors => {
    if (sectors.length == 0) {
      Sector.create({
        price: 35
      })
        .then(sec => {
          return Sector.create({
            price: 30
          });
        })
        .then(sec => {
          return Sector.create({
            price: 27
          });
        })
        .then(sec => {
          return Sector.create({
            price: 25
          });
        })
        .then(sec => {
          return Sector.create({
            price: 20
          });
        });
    }
  })
  .then(result => {
    // Port 8080 for Google App Engine
    app.set('port', process.env.PORT || 3000);
    const server = app.listen(app.get('port'), () => {
      console.log('\x1b[0m', 'Listen on Port ' + app.get('port'));
    });

    webSocket.run(server);
  })
  .catch(err => {
    console.log(err);
  });
