const { Op } = require('sequelize');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const help = require('../helpers/helper');
const mail = require('../utils/mailService');
const moment = require('moment');
const webSocket = require('./webSocket');
const uuid = require('uuid');
const { createTicketPdf } = require('../utils/pdfTicketCreator');

const Concert = require('../models/concert');
const Info = require('../models/info');
const Seat = require('../models/row');
const Buyer = require('../models/buyer');
const Sector = require('../models/sector');
const Ticket = require('../models/ticket');
const session = require('express-session');
const { mailSender } = require('../helpers/minimumApproval');

exports.getConcerts = (req, res, next) => {
  Concert.findAll({
    where: {
      sell_end: {
        [Op.gte]: new Date(),
      },
      sell_start: {
        [Op.lte]: new Date(),
      },
    },
    order: [['date', 'DESC']],
    include: [
      {
        model: Info,
      },
    ],
  })
    .then((concerts) => {
      res.render('user/concerts', {
        pageTitle: 'Konzerte',
        path: '/concerts',
        concerts: concerts,
      });
    })
    .catch((err) => {
      console.log('err:', err);
    });
};

exports.getConcert = (req, res, next) => {
  let con = null;

  Concert.findByPk(req.params.concertId, {
    include: [
      {
        model: Seat,
        include: [
          {
            model: Ticket,
          },
        ],
      },
    ],
  })
    .then((concert) => {
      con = concert;
      if (!(concert.sell_start <= new Date() && concert.sell_end >= new Date()))
        return res.redirect('/');

      con.rows.forEach((row) => {
        row.orders = row.tickets.length;
      });

      res.render('user/concert', {
        seats: con.rows,
        concert: con,
      });
    })
    .catch((err) => {
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
  let mailObj = {
    templateId: 1,
    concertName: 'Nicht gesetzt',
    concertDate: 'Nicht gesetzt',
    concertTime: 'Nicht gesetzt',
    concertLocation: 'Nicht gesetzt',
    tickets: [],
    orderId: 'Nicht gesetzt',
    firstname: 'Nicht gesetzt',
    lastname: 'Nicht gesetzt',
    email: 'Nicht gesetzt',
    phone: 'Nicht gesetzt',
    totalPrice: 0,
    viewInBrowser:
      req.protocol + '://' + req.get('host') + '/reservation-email/',
    paymentLink: req.protocol + '://' + req.get('host') + '/checkout/payment/',
  };

  try {
    if (!(lastname && firstname && email && phone)) {
      req.flash('error', 'Bitte geben sie alle Kontaktinformationen an!');
      return res.redirect('/concert/' + concertId);
    }

    mailObj.lastname = lastname;
    mailObj.firstname = firstname;
    mailObj.email = email;
    mailObj.phone = phone;

    if (!tickets) {
      req.flash(
        'error',
        'Leider wurde keine Ticketauswahl übermittelt. Bitte versuche es erneut'
      );
      return res.redirect('/concert/' + concertId);
    }

    Sector.findAll()
      .then((secs) => {
        sectors = secs;
        return Concert.findByPk(concertId, {
          include: [
            {
              model: Seat,
            },
            {
              model: Info,
            },
          ],
        });
      })
      .then((concert) => {
        const seats = concert.rows;
        let ticketStore = [];
        let ticketQuantiy = 0;

        //add concert to mail data
        mailObj.concertDate = moment(concert.date).format('DD.MM.YYYY');
        mailObj.concertLocation = concert.info.location;
        mailObj.concertName = concert.name;
        mailObj.concertTime = concert.info.time;

        if (!Array.isArray(tickets)) tickets = [tickets];

        tickets.forEach((ticket) => {
          ticket = JSON.parse(ticket);
          const seatDoc = seats.find((seat) => seat.generalId == ticket.seat);
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
            price: sectors.find((sector) => sector.id == seatDoc.sectorId)
              .price,
            amount: ticket.quantity,
            sector: seatDoc.sectorId,
            rowId: seatDoc.id,
            rowName: seatDoc.generalId,
          };

          ticketStore.push(storeOptions);
          ticketQuantiy += ticket.quantity;

          //add ticket to email data
          mailObj.tickets.push({
            name: help.getSeatName(seatDoc.generalId),
            quantity: ticket.quantity,
            price: storeOptions.price * ticket.quantity,
          });

          mailObj.totalPrice += ticket.quantity * storeOptions.price;
          // console.log('totalPrice:', mailObj.totalPrice);
        });

        concert
          .createBuyer({
            name: lastname,
            firstname: firstname,
            phone: phone,
            email: email,
          })
          .then(async (buyer) => {
            console.log(' buyer.orderI:', buyer.orderId);

            mailObj.orderId = buyer.orderId;

            for (i = 0; i < ticketStore.length; i++) {
              await buyer
                .createTicket(ticketStore[i])
                .then((ticket) => {
                  // console.log('ticket:', ticket);
                  const newSeat = seats.find((seat) => seat.id == ticket.rowId);
                  newSeat.orders += ticket.amount;
                  if (newSeat.max_seats - newSeat.orders <= 0)
                    newSeat.is_available = false;
                  return newSeat.save();
                })
                .then((newSeat) => {
                  // console.log('newSeat:', newSeat);
                })
                .catch((err) => {
                  console.log('err:', err);
                  req.flash(
                    'error',
                    'Bitte melden sie sich bei kanzlei@chor.kalvarienbergkirche.at'
                  );
                  return res.redirect('/concert/' + concertId);
                });
            }
            console.log('------------ done');

            concert.ordered += 1;
            concert.ticketsSold += ticketQuantiy;

            return concert.save();
          })
          .then((concert) => {
            mailObj.viewInBrowser =
              mailObj.viewInBrowser + '?oid=' + mailObj.orderId;
            mailObj.paymentLink =
              mailObj.paymentLink + '?oid=' + mailObj.orderId;
            //send order success mail to client
            return mail.send(
              'Reservierung war erfolgreich',
              (content = 'Ihre Reservierung ist angekommen'),
              email,
              'kanzlei@chor.kalvarienbergkirche.at',
              mailObj
            );
          })
          .then((result) => {
            res.send('<h2>Geschafft</h2>');
          })
          .catch((err) => {
            console.log('err:', err);
            req.flash(
              'error',
              'Leider ist etwas schiefgelaufen, bitte versuchen Sie es erneut!'
            );
            return res.redirect('/concert/' + concertId);
          });
      })
      .catch((err) => {
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

exports.getReservationEmail = (req, res, next) => {
  const orderId = req.query.oid;

  Buyer.findAll({
    where: { orderId: orderId },
    include: [
      {
        model: Concert,
        include: [{ model: Info }],
      },
      {
        model: Ticket,
      },
    ],
  })
    .then((buyers) => {
      const buyer = buyers[0];
      const concert = buyer.concert;
      let totalPrice = 0;

      buyer.tickets.forEach((ticket) => {
        ticket.name = help.getSeatName(ticket.rowName);
        ticket.quantity = ticket.amount;

        totalPrice += ticket.quantity * ticket.price;
      });

      res.render('mail/reservation', {
        orderId: buyer.orderId,
        tickets: buyer.tickets,
        totalPrice: totalPrice,
        concertName: concert.name,
        concertDate: moment(concert.date).format('DD.MM.YYYY'),
        concertLocation: concert.info.location,
        concertTime: concert.info.time,
        paymentLink:
          req.protocol +
          '://' +
          req.get('host') +
          '/checkout/payment/?oid=' +
          buyer.orderId,
      });
    })
    .catch((err) => {
      console.log('err:', err);

      req.flash(
        'error',
        'Die Reservierung ist nicht mehr Verfügbar. Möglicherweise wurde gelöscht.'
      );
      return res.redirect('/');
    });
};

exports.getPaymentForwarding = (req, res, next) => {
  const orderId = req.query.oid;
  console.log('orderId:', orderId);

  let concertId = '';

  Buyer.findAll({
    where: { orderId: orderId },
    include: [
      {
        model: Concert,
        include: [{ model: Info }],
      },
      {
        model: Ticket,
      },
    ],
  })
    .then((buyers) => {
      const buyer = buyers[0];

      if (buyer.is_paid) {
        req.flash(
          'success',
          'Sie haben bereits Ihre Tickets Bezahlt! Falls das nicht der Fall sein sollten, informieren Sie uns bitte unter kanzlei@kalvarienbergkirche.at'
        );
        res.redirect('/concert/' + buyer.concert.id);
      }
      const payValid = uuid.v4();
      buyer.pva = payValid;

      // console.log('buyer:', buyer);

      return buyer.save();
    })
    .then((buyer) => {
      // console.log('buyer2:', buyer);

      const concert = buyer.concert;
      const payValid = buyer.pva;

      let items = [];

      buyer.tickets.forEach((ticket) => {
        items.push({
          name: help.getSeatName(ticket.rowName),
          description:
            'Konzert Ticket für ' +
            concert.name +
            ' am ' +
            moment(concert.date).format('DD.MM.YYYY') +
            ' um ' +
            concert.info.time +
            ' in der ' +
            concert.info.location,
          amount: ticket.price * 100,
          currency: 'eur',
          quantity: ticket.amount,
        });
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items,
        success_url:
          req.protocol +
          '://' +
          req.get('host') +
          '/checkout/success/?pva=' +
          payValid,
        cancel_url:
          req.protocol +
          '://' +
          req.get('host') +
          '/checkout/cancel/?oid=' +
          orderId,
      });
    })
    .then((session) => {
      const sessionId = session.id;

      res.render('user/paymentForwarding', { sessionId: sessionId });
    })
    .catch((err) => {
      console.log('err:', err);

      req.flash(
        'error',
        'Etwas ist schiefgelaufen! Möglicherweise ist diese Reservierung nicht mehr verfügbar.'
      );
      return res.redirect('/concert/' + concertId);
    });
};

exports.getSuccess = (req, res, next) => {
  Buyer.findAll({
    where: { pva: req.query.pva },
    include: [
      {
        model: Concert,
        include: [
          {
            model: Info,
          },
        ],
      },
      {
        model: Ticket,
      },
    ],
  })
    .then((buyers) => {
      const buyer = buyers[0];

      if (buyer.is_paid) {
        return buyer;
        // req.flash('success', 'Sie haben bereits bezahlt!');
        // res.redirect('/');
      }

      buyer.is_paid = true;

      buyer.concert.sold += 1;
      buyer.concert.save();

      return buyer.save();
    })
    .then(async (buyer) => {
      const ticketObj = await createTicketPdf(buyer);

      const mailObj = {
        ticket: ticketObj.pdf,
        html: '<h1>Anhangstest</h1>',
      };

      await mail.send(
        'Anhangstest',
        mailObj.html,
        buyer.email,
        'kanzlei@kalvarienbergkirche.at',
        null,
        mailObj.ticket
      );

      console.log('ticket send!');

      res.send(ticketObj.html);
    })
    .catch((err) => {
      console.log('err:', err);
      req.flash(
        'error',
        'Sie haben zwar bezahlt, trotzdem ist etwas schiefgelaufen! Bitte kontaktieren Sie uns unter kanzlei@kalvarienbergkirche.at!'
      );
      // return res.redirect('/');
    });
};

exports.getCancel = (req, res, next) => {
  const orderId = req.query.oid;

  req.flash('error', 'Zahlung wurde abgebrochen!');
  res.redirect('/reservation-email/?oid=' + orderId);
};

exports.getPostTest = (req, res, next) => {
  console.log(req);
};
