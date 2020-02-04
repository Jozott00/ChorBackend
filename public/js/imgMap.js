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
  socket.on('setup', setupData => {
    sectors = setupData.sectors;
    seatName = setupData.seatName;

    //load church map
    $('#map').load('/img/seats.svg', function() {
      seatsData = setupData.seats;
      updateSeats(setupData.seats);
      popover();
    });
  });

  //ON SEATSELECTION
  $(document).on('click', 'rect, path', function() {
    const seat = $(this);
    const seatData = seatsData.find(s => s.generalId == seat.attr('id'));
    const seatAv = seatData.max_seats - seatData.orders;

    // if seat is valid
    if (!seat.hasClass('st22') && !seat.hasClass('deactivated')) {
      var clicks = seat.data('clicks');

      //if already selected -> unselect
      if (clicks) {
        seat.removeClass('selected');

        //set target for modal, if seat has more than 1 capacity
        if (seatData.max_seats > 1) {
          seat.attr('data-target', '#seatOrder');
        }

        //remove ticket from order list
        removeTicketById(seatData.generalId);

        socket.emit('getSeats', { concertId: concertId });

        //if not selected -> select
      } else {
        if (seatAv > 0) {
          seat.addClass('selected');
          //delete modal target, so modal doesnt appears on unselect
          seat.attr('data-target', '#none');

          //Add Ticket to UI
          addTicket(seatData, seatAv);
        } else {
          addAlert('Dieser Sitzplatz ist leider nicht mehr verügbar', true);
        }
      }
      if (!seatAv < 1) seat.data('clicks', !clicks);
    }
  });
});
