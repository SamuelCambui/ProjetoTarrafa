const formEsqueceuSenha = document.getElementById('form-esqueceu-senha');
const btnRecuperarSenha = formEsqueceuSenha.querySelector('#btn_recuperar_senha');
const inputEmail = formEsqueceuSenha.querySelector('#email');
const esqueceuSenhaContainer = formEsqueceuSenha.querySelector('#esqueceu-senha-resposta-container');
const respostaEsqueceuSenha = formEsqueceuSenha.querySelector('#esqueceu-senha-resposta');
const imgCarregamento = formEsqueceuSenha.querySelector('#img-carregamento');

formEsqueceuSenha.addEventListener("submit", (e) => {
  esqueceuSenhaContainer.classList.add("hidden");
  e.preventDefault();
  manipularEmail();
});

const manipularEmail = () => {
  const email = inputEmail.value;

  esqueceuSenhaContainer.classList.remove("bg-green-50", "bg-red-50", "border-green-800", "border-red-700");
  respostaEsqueceuSenha.classList.remove("text-green-800", "text-red-700");
  respostaEsqueceuSenha.textContent = "";

  btnRecuperarSenha.classList.toggle("hidden");
  imgCarregamento.classList.toggle("hidden");

  axios.get('/ppg/login/esqueceusenha/' + email)
    .then(() => {
      respostaEsqueceuSenha.textContent = "E-mail enviado! Não esqueça de checar sua caixa de spam";
      esqueceuSenhaContainer.classList.add("bg-green-50", "border-green-800");
      respostaEsqueceuSenha.classList.add("text-green-800");
    })
    .catch(() => {
      respostaEsqueceuSenha.textContent = "O e-mail não pôde ser enviado. Corrija seu e-mail e tente novamente";
      esqueceuSenhaContainer.classList.add("bg-red-50", "border-red-700");
      respostaEsqueceuSenha.classList.add("text-red-700");
    })
    .finally(() => {
      esqueceuSenhaContainer.classList.toggle("hidden");
      btnRecuperarSenha.classList.toggle("hidden");
      imgCarregamento.classList.toggle("hidden");
    });

  inputEmail.addEventListener("input", () => {
    esqueceuSenhaContainer.classList.add("hidden");
    respostaEsqueceuSenha.textContent = "";
  });
}
