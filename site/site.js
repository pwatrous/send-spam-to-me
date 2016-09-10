$(document).ready(function() {
  $('#email').keypress(function (e) {
    if (e.which == 13) {
      $('form#emailsubmit').submit();
      return false;
    }
  });
});

