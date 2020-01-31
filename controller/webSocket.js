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
      request
        .getSeats(data.concertId)
        .then(seats => {
          //return seats
          socket.emit('setup', seats);
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
