const Concert = require('../models/concert');

exports.getConcert = (req, res, next) => {
  let concert;
  let seats;
  Concert.findByPk(req.params.concertId)
    .then(con => {
      concert = con;
      return con.getRows();
    })
    .then(rows => {
      seats = rows;
      res.render('user/concert', {
        seats: seats,
        concert: concert
      });
    })
    .catch(err => {
      console.log(err);
    });
};
