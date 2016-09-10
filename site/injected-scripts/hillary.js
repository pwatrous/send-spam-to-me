function () {
  var email = '%%EMAIL_ADDRESS%%';
  var emailField = document.getElementById('id_172318303_email');
  emailField.value = email;
  var postalCode = document.getElementById('id_858076585_postalCode');
  postalCode.value = '01742';
  document.getElementsByClassName('button-action')[0].click();
}