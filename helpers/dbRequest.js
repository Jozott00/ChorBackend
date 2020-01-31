const Row = require('../models/row');
const Concert = require('../models/concert');

exports.getSeats = concertId => {
  return new Promise((resolve, reject) => {
    Row.findAll({ where: { concertId: concertId } })
      .then(seats => {
        resolve(seats);
      })
      .catch(err => {
        reject(err);
      });
  });
};
