$(document).ready(function() {
  //seats Auswertung
  const socket = io.connect();
  const concertId = parseInt(window.location.href.split('/').pop());

  $('#map').load('/img/seats.svg');

  socket.emit('getSeats', {
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

    seats.forEach(seat => {
      const s = $('#' + seat.generalId);
      console.log('s:', s);
      if (seat.is_available) {
        if (s.hasClass('deactivated')) s.removeClass('deactivated');
      } else {
        if (!s.hasClass('deactivated')) s.addClass('deactivated');
      }
    });
  });

  //on click
  $(document).on('click', 'rect, path', function() {
    if (!$(this).hasClass('st22')) {
      var clicks = $(this).data('clicks');
      if (clicks) {
        $(this).removeClass('selected');
      } else {
        $(this).addClass('selected');
        console.log('clicked');
        socket.emit('chat', {
          value: 'hello'
        });
      }
      $(this).data('clicks', !clicks);
    }
  });
});
