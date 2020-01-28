$(function() {
  $('#map').load('/img/seats.svg');
});

$(document).on('click', 'rect, path', function() {
  if (!$(this).hasClass('st22')) {
    var clicks = $(this).data('clicks');
    if (clicks) {
      $(this).removeClass('selected');
    } else {
      $(this).addClass('selected');
      $('.popup').addClass('active');
    }
    $(this).data('clicks', !clicks);
  }
});
