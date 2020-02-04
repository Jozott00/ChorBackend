const Row = require('../models/row');
const Concert = require('../models/concert');
const Sector = require('../models/sector');

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

exports.getSectors = () => {
  return new Promise((resolve, reject) => {
    Sector.findAll()
      .then(sectors => {
        resolve(sectors);
      })
      .catch(err => {
        reject(err);
      });
  });
};
