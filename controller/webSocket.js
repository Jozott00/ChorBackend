const socket = require('socket.io');

const request = require('../helpers/dbRequest');

exports.run = server => {
  //Socket setup
  const io = socket(server);

  //on socketconnection
  io.on('connection', socket => {
    console.log('Socket connected with', socket.id);
    socket.emit('msg', { msg: 'Socket connected' });

    //setup
    socket.on('setup', data => {
      let seats;
      request
        .getSeats(data.concertId)
        .then(_seats => {
          seats = _seats;
          return request.getSectors();
        })
        .then(sectors => {
          const seatName = {
            hl: 'Hauptschiff Links, Reihe',
            hr: 'Haupschiff Rechts, Reihe',
            sl: 'Seitenschiff Links, Reihe',
            sr: 'Seitenschiff Rechts, Reihe',
            hrs: 'Hauptschiff Rechts, Platz',
            hls: 'Hauptschiff Links, Platz',
            sls: 'Seitenschiff Links, Platz',
            srs: 'Seitenschiff Rechts, Platz',
            el: 'Empore Links, Platz',
            er: 'Empore Rechts, Platz',
            ll: 'Loge Links, Platz',
            lr: 'Loge Rechts, Platz'
          };
          socket.emit('setup', {
            seats: seats,
            sectors: sectors,
            seatName: seatName
          });
        })
        .catch(err => {
          console.log('err:', err);
        });
    });

    //getSeats abfrage
    socket.on('getSeats', data => {
      request
        .getSeats(data.concertId)
        .then(seats => {
          //return seats
          socket.emit('seats', seats);
        })
        .catch(err => {
          console.log('err:', err);
        });
    });
  });
};
