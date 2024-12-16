$("#esqueceu-senha").on("click", function(e){
  document.getElementById('forgot-password-validation').innerHTML = "";
  document.getElementById('forgot-password-invalidation').innerHTML = "";
});

$('#forgotPasswordForm').on('submit', function (event){
  event.preventDefault();

  const email = document.getElementById('email').value;

  $('#divBtId').hide();
  $('#divImgId').show();

  axios.get('/ppg/login/esqueceusenha/' + email)
    .then(response => {
      console.log(response.data.msg);

      document.getElementById('forgot-password-invalidation').innerHTML = "";
      document.getElementById("forgot-password-validation").innerHTML = "<p style='color:red; font-size:14px'>E-mail enviado!<br><br><strong>Não esqueça de checar sua caixa de spam</strong>.</p>";
      $('#divImgId').hide();
    })
    .catch(error => {
      console.error('Search error:', error);
      
      document.getElementById('forgot-password-validation').innerHTML = "";
      document.getElementById("forgot-password-invalidation").innerHTML = `<p>${error.response.data.detail}</p>`;
      $('#divImgId').hide();
    });
});