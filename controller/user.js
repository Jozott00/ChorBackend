const { Op } = require('sequelize');
const help = require('../helpers/helper');

const Concert = require('../models/concert');
const Info = require('../models/info');
const Seat = require('../models/row');
const Buyer = require('../models/buyer');
const Sector = require('../models/sector');

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
      const errMsg = help.flashMsg(req, 'error');

      res.render('user/concerts', {
        pageTitle: 'Konzerte',
        path: '/concerts',
        concerts: concerts,
        errorMsg: errMsg
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

      const errMsg = help.flashMsg(req, 'error');

      console.log(errMsg);

      res.render('user/concert', {
        seats: concert.rows,
        concert: concert,
        errorMsg: errMsg
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  const concertId = req.params.concertId;
  let tickets = req.body.tickets;
  let lastname = req.body.lastname;
  let firstname = req.body.firstname;
  let email = req.body.email;
  let phone = req.body.tel;

  let sectors;

  try {
    if (!(lastname && firstname && email && phone)) {
      req.flash('error', 'Bitte geben sie alle Kontaktinformationen an!');
      return res.redirect('/concert/' + concertId);
    }

    if (!tickets) {
      req.flash(
        'error',
        'Leider wurde keine Ticketauswahl übermittelt. Bitte versuche es erneut'
      );
      return res.redirect('/concert/' + concertId);
    }

    Sector.findAll()
      .then(secs => {
        sectors = secs;
        return Concert.findByPk(concertId, {
          include: [
            {
              model: Seat
            }
          ]
        });
      })
      .then(concert => {
        const seats = concert.rows;
        if (!Array.isArray(tickets)) tickets = [tickets];
        console.log('tickets:', tickets);

        let ticketStore = [];

        tickets.forEach(ticket => {
          ticket = JSON.parse(ticket);
          const seatDoc = seats.find(seat => seat.generalId == ticket.seat);
          // console.log('seatDoc:', seatDoc);

          //If no seat was find with this ID
          if (!seatDoc) {
            console.log('ERROR: TicketId falsch');
            req.flash(
              'error',
              'Mindestens einer der beantragte Sitzplätze ist nicht vorhanden!'
            );
            return res.redirect('/concert/' + concertId);
          }

          //If seat isnt available or has not enough space left
          if (
            !(
              seatDoc.max_seats - seatDoc.orders >= ticket.quantity &&
              seatDoc.is_available
            )
          ) {
            console.log(
              `ERROR: Ticket ${ticket.seat} ist nicht mehr verfügbar.`
            );
            req.flash(
              'error',
              'Ein von Ihnen ausgesuchter Platz ist nicht verfügbar. Bitte versuchen Sie es erneut'
            );
            return res.redirect('/concert/' + concertId);
          }

          const storeOptions = {
            price:
              sectors.find(sector => sector.id == seatDoc.sectorId).price *
              ticket.quantity,
            amount: ticket.quantity,
            sector: seatDoc.sectorId,
            rowId: seatDoc.id,
            rowName: seatDoc.generalId
          };
          ticketStore.push(storeOptions);
        });
        Buyer.create({
          name: lastname,
          firstname: firstname,
          phone: phone,
          email: email
        })
          .then(async buyer => {
            ticketStore.forEach(ticket => {
              buyer
                .createTicket(ticket)
                .then(ticket => {
                  // console.log('ticket:', ticket);
                  const newSeat = seats.find(seat => seat.id == ticket.rowId);
                  newSeat.orders += ticket.amount;
                  if (newSeat.max_seats - newSeat.orders <= 0)
                    newSeat.is_available = false;
                  return newSeat.save();
                })
                .then(newSeat => [
                  //console.log('newSeat:', newSeat)
                ])
                .catch(err => {
                  console.log('err:', err);
                  req.flash(
                    'error',
                    'Bitte melden sie sich bei kanzlei@chor.kalvarienbergkirche.at'
                  );
                  return res.redirect('/concert/' + concertId);
                });
            });

            res.send('<h2>Geschafft</h2>');
          })
          .catch(err => {
            console.log('err:', err);
            req.flash(
              'error',
              'Leider ist etwas schiefgelaufen, bitte versuchen Sie es erneut!'
            );
            return res.redirect('/concert/' + concertId);
          });
      })
      .catch(err => {
        console.log('err:', err);
        req.flash(
          'error',
          'Leider ist etwas schiefgelaufen, bitte versuchen Sie es erneut!'
        );
        return res.redirect('/concert/' + concertId);
      });
  } catch (error) {
    console.log('err:', err);
    req.flash(
      'error',
      'Leider ist etwas schiefgelaufen, bitte versuchen Sie es erneut!'
    );
    return res.redirect('/concert/' + concertId);
  }
};
