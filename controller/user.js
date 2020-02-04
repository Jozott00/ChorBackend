const { Op } = require('sequelize');
const Concert = require('../models/concert');
const Info = require('../models/info');
const Seat = require('../models/row');

exports.getConcerts = (req, res, next) => {
  Concert.findAll({
    where: {
      sell_end: {
        [Op.gte]: new Date()
      },
      sell_start: {
        [Op.lte]: new Date()
      }
    },
    order: [['date', 'DESC']],
    include: [
      {
        model: Info
      }
    ]
  })
    .then(concerts => {
      console.log(concerts[0].info.location);

      res.render('user/concerts', {
        pageTitle: 'Konzerte',
        path: '/concerts',
        concerts: concerts
      });
    })
    .catch(err => {
      console.log('err:', err);
    });
};

exports.getConcert = (req, res, next) => {
  Concert.findByPk(req.params.concertId, {
    include: [
      {
        model: Seat
      }
    ]
  })
    .then(concert => {
      if (!(concert.sell_start <= new Date() && concert.sell_end >= new Date()))
        return res.redirect('/');
      res.render('user/concert', {
        seats: concert.rows,
        concert: concert
      });
    })
    .catch(err => {
      console.log(err);
    });
};
