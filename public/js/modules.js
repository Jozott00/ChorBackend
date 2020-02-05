//Manage Alerts
let alertCount = 0;
const addAlert = (msg, isTransition) => {
  let temp = alertCount;
  $('#alertBox').append(
    `<div class="alert alert-danger alert-dismissible fade show" id="${'alert' +
      temp}"><button class="close" data-dismiss="alert">×</button>${msg}</div>`
  );

  if (isTransition) {
    setTimeout(() => {
      $('#alert' + temp).alert('close');
      console.log('should be closed');
    }, 3000);
  }
};

//SETUP DATA FOR POPOVER
const updateSeats = seats => {
  seats.forEach(seat => {
    const s = $('#' + seat.generalId);

    //set seat data
    s.attr('data-content', seat.orders + '/' + seat.max_seats);

    //set modal target to seats
    if (seat.max_seats > 1) {
      // s.attr('data-target', '#seatOrder');
    }

    //only setup popover and modal if available  --> works also to update the seat data
    if (seat.is_available) {
      // s.attr('data-toggle', 'modal');
      s.attr('data-toggle2', 'popover');

      //removes deactivation if new seat data changes the state
      if (s.hasClass('deactivated')) s.removeClass('deactivated');

      //if seat not available
    } else {
      // s.attr('data-toggle', 'none');
      s.attr('data-toggle2', 'none');
      if (!s.hasClass('deactivated')) s.addClass('deactivated');
      removeTicketById(seat.generalId);
    }
  });
};

//Update Ticket Cost on quantity change
const updatePrice = selectedObj => {
  console.log('selectedObj:', selectedObj);
  const quantity = JSON.parse(selectedObj.value).quantity;
  selectedObj = $('#' + selectedObj.getAttribute('id'));
  const priceElement = selectedObj.siblings('.price');
  console.log('priceElement:', priceElement);
  const price = parseInt(priceElement.attr('data-singlePrice')) * quantity;

  priceElement.attr('data-price', price);
  priceElement.text('€ ' + price + ' ,-');

  updateSum();
};

//update total price of all tickets in order
const updateSum = () => {
  let newSum = 0;

  $('.price').each(function(i) {
    const pElement = $(this);
    const price = parseInt(pElement.attr('data-price'));
    if (Number.isInteger(price)) newSum += price;
    else
      addAlert(
        'Bei der Preiserrechnung ist ein Fehler aufgetreten, bitte laden Sie die Seite neu',
        false
      );
  });

  $('#totalPrice').text('€ ' + newSum + ' ,-');
};

//addes ticket to order list
const addTicket = (seatData, seatAv) => {
  const seatPrice = sectors.find(s => s.id == seatData.sectorId).price;
  const ticketList = $('#ticketList');

  let selectOptions = '';

  console.log(seatData.generalId);

  //is more than 1 seat available? -> select options available and set ticket data in value
  if (seatAv > 1) {
    selectOptions += `<select class="col-1" id="${'select_' +
      seatData.generalId}" onChange="updatePrice(this)" name="tickets" style="width: 10px">`;
    for (i = 1; i <= seatAv; i++) {
      const jsonObj = JSON.stringify({
        seat: seatData.generalId,
        quantity: i
      });
      console.log('jsonObj:', jsonObj);
      selectOptions += `<option value='${jsonObj}'>${i}</option>`;
    }
    selectOptions += ' </select>';
  } else {
    const jsonObj = JSON.stringify({
      seat: seatData.generalId,
      quantity: 1
    });
    selectOptions = `<p class="col-1"> 1 </p><input type="hidden" name="tickets" value='${jsonObj}'>`;
  }

  //add ticket to list
  ticketList.append(
    `<div class="ticket row mb-3" id="${'ticket_' + seatData.generalId}">
              ${selectOptions}
              <p class="col-1">×</p>
              <p class="col-7">${seatName[seatData.generalId.split('-')[0]] +
                ' ' +
                seatData.generalId.split('-')[1].toUpperCase()}</p>
              <p class="price col-2" data-singlePrice="${seatPrice}" data-price="${seatPrice}" > € 
                ${seatPrice} ,-</p>
              <img class="deleteBtn" id="deleteBtn_${
                seatData.generalId
              }" src="/img/deleteIcon.png" onclick="removeTicketById(this.getAttribute('id').split('_')[1])" style="width: 30px" alt="Löschen"></div>`
  );

  updateSum();
};

//removes ticket from orderlist
const removeTicketById = seatId => {
  $('#ticket_' + seatId).remove();
  updateSum();
  removeSeatSelection(seatId);
};

//removes seat selection from map and sets clicks to false
const removeSeatSelection = seatId => {
  const seat = $('#' + seatId);
  seat.removeClass('selected');
  const clicks = seat.data('clicks');
  console.log(clicks);
  if (clicks) seat.data('clicks', !clicks);
};
