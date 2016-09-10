function () {
  $(document).ready(function() {
    var email = '%%EMAIL_ADDRESS%%';
    $('.form-control').val(email);
    $('.btn-primary').click();
  });
}