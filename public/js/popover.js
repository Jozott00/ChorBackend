//create popover
function popover() {
  const popover = $('#seatPopover');
  $('[data-toggle2="popover"]').hover(
    function() {
      const offset = $(this).offset();

      //hovereffect on seat
      $(this).animate(
        {
          opacity: '0.5'
        },
        200
      );

      //make popover visible on right position
      popover.css({ top: offset.top - 50, left: offset.left + 10 });
      $(this).attr('data-content', function(i, content) {
        popover.text(content);
      });
      popover.addClass('hoverActive');
    },
    //and reset it back
    function() {
      popover.removeClass('hoverActive');
      $(this).animate(
        {
          opacity: '1'
        },
        200
      );
    }
  );
}
