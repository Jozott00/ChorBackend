$(document).ready(function() {
  $('[data-toggle=visible]').hover(
    function() {
      const target = $(this).attr('data-target');
      $('#' + target).addClass('lite-visible');
    },
    function() {
      const target = $(this).attr('data-target');
      $('#' + target).removeClass('lite-visible');
    }
  );

  $('.toggle-item').click(function() {
    var clicks = $(this).data('clicks');
    if (clicks) {
      $(this).removeClass('visible');
    } else {
      $(this).addClass('visible');
    }
    $(this).data('clicks', !clicks);
  });
});

load = () => {
  console.log('hello');
  $('#load').addClass('active');
};
