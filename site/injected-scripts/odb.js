function () {
  var email = '%%EMAIL_ADDRESS%%';
  document.getElementById('control_EMAIL').value = email;
  document.getElementById('control_COLUMN1').value = 'Lorem';
  document.getElementById('control_COLUMN14').selectedIndex = 1;
  document.forms[0].submit();
}