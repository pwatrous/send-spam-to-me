function () {
  var email = '%%EMAIL_ADDRESS%%';
  $('.emailAddress').val(email);
  $('#chk-38033, #chk-14917, #chk-36913, #chk-74296')
    .attr("checked", true);
  // submit the form
  allpass.newsletter.signup(jQuery('#nlPageWrapper'));
}