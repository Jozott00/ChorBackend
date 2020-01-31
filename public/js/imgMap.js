$(document).ready(function() {
  // //load church map
  // $('#map').load('/img/seats.svg');

  // ------- SOCKET COMMUNICATION ------
  const socket = io.connect();
  const concertId = parseInt(window.location.href.split('/').pop());

  socket.emit('setup', {
    concertId: concertId
  });

  //standard messages
  socket.on('msg', data => {
    console.log('Message:', data.msg);
  });

  //errors
  socket.on('err', data => {
    console.log('Error: ', data.msg);
  });

  //got seats
  socket.on('seats', seats => {
    console.log('seats:', seats);
    updateSeats(seats);
  });

  //first communication
  socket.on('setup', seats => {
    //load church map
    $('#map').load('/img/seats.svg', function() {
      updateSeats(seats);
      popover();
    });
  });

  //SETUP DATA FOR POPOVER
  function updateSeats(seats) {
    seats.forEach(seat => {
      const s = $('#' + seat.generalId);

      //set seat data
      s.attr('data-content', seat.orders + '/' + seat.max_seats);

      //only popover if available
      if (seat.is_available) {
        s.attr('data-toggle', 'popover');
        if (s.hasClass('deactivated')) s.removeClass('deactivated');
      } else {
        s.attr('data-toggle', 'none');
        if (!s.hasClass('deactivated')) s.addClass('deactivated');
      }
    });
  }

  //ON SEATSELECTION
  $(document).on('click', 'rect, path', function() {
    if (!$(this).hasClass('st22')) {
      var clicks = $(this).data('clicks');
      if (clicks) {
        $(this).removeClass('selected');
      } else {
        $(this).addClass('selected');
        socket.emit('chat', {
          value: 'hello'
        });
      }
      $(this).data('clicks', !clicks);
    }
  });
});
