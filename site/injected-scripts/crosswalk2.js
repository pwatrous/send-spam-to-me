function () {
  var email = '%%EMAIL_ADDRESS%%';
  $('.emailAddress').val(email);
  $('#chk-14448, #chk-34355, #chk-45063, #chk-134798')
    .attr("checked", true);
  // submit the form
  allpass.newsletter.signup(jQuery('#nlPageWrapper'));
}