const socket = require('socket.io');

const request = require('../helpers/dbRequest');

exports.run = server => {
  //Socket setup
  const io = socket(server);

  //on socketconnection
  io.on('connection', socket => {
    console.log('Connected with ', socket.id);
    socket.emit('msg', { msg: 'Socket connected' });

    //getSeats abfrage
    socket.on('getSeats', data => {
      console.log(data.concertId);
      request
        .getSeats(data.concertId)
        .then(seats => {
          console.log('seats:', seats[1]);
          //return seats
          socket.emit('seats', seats);
        })
        .catch(err => {
          console.log('err:', err);
        });
    });
  });
};
