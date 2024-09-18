$('#cpf').mask('999.999.999-99');
$('#cep').mask('99999-999');
$('#contato').mask('(99)99999-9999');
$('#contatoMedico').mask('(99)99999-9999');
$('#contatoFamiliar').mask('(99)99999-9999');
$('#rg').mask('aa-99.999.999');

(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }

        form.classList.add('was-validated')
        }, false)
    })
})()

 function LimpaFormularioCep() {
    $("#logradouro").val("");
    $("#bairro").val("");
    $("#cidade").val("");
    $("#estado").val("");
}

// Quando o campo cep perde o foco.
$("#cep").blur(function() {
    var cep = $(this).val().replace(/\D/g, ''); // Nova variável "cep" somente com dígitos.

    // Verifica se campo cep possui valor informado.
    if (cep != ""){
        var validacep = /^[0-9]{8}$/; // Expressão regular para validar o CEP.

        //Valida o formato do CEP.
        if(validacep.test(cep)) {

            document.getElementById('logradouro').setAttribute('disabled', '');
            document.getElementById('bairro').setAttribute('disabled', '');
            document.getElementById('cidade').setAttribute('disabled', '');
            document.getElementById('estado').setAttribute('disabled', '');

            $("#logradouro").val("...");
            $("#bairro").val("...");
            $("#cidade").val("...");
            $("#estado").val("...");

            $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                if (!("erro" in dados)) {
                    $("#logradouro").val(dados.logradouro);
                    $("#bairro").val(dados.bairro);
                    $("#cidade").val(dados.localidade);
                    $("#estado").val(dados.uf);
                }
                else {
                    LimpaFormularioCep();
                    alert("CEP não encontrado.");
                }

                document.getElementById('logradouro').removeAttribute('disabled');
                document.getElementById('bairro').removeAttribute('disabled');
                document.getElementById('cidade').removeAttribute('disabled');
                document.getElementById('estado').removeAttribute('disabled');
            });
        }
        else {
            LimpaFormularioCep();
            alert("Formato de CEP inválido.");
        }
    }
    else {
        LimpaFormulárioCep();
    }
});

$('#genero').on('change', function(){
    const generoInput = document.getElementById('generoInput');

    if(document.getElementById('genero').value == 'Outro'){
        generoInput.removeAttribute('disabled');
        generoInput.setAttribute('required', '');
    }

    else{
        generoInput.value = '';
        generoInput.setAttribute('disabled', '');
        generoInput.removeAttribute('required');
    }
})

$('#etnia').on('change', function(){
    const etniaInput = document.getElementById('etniaInput');

    if(document.getElementById('etnia').value == 'Outro'){
        etniaInput.removeAttribute('disabled');
        etniaInput.setAttribute('required', '');
    }

    else{
        etniaInput.value = '';
        etniaInput.setAttribute('disabled', '');
        etniaInput.removeAttribute('required');
    }
})

$('#necessidadeEspecial').on('click', function(){
    const checkbox = document.getElementById('necessidadeEspecial');
    const input = document.getElementById('necessidadeEspecialInput');
    const contatoMedico = document.getElementById('contatoMedico');
    const contatoFamiliar = document.getElementById('contatoFamiliar');

    if(checkbox.checked){
        $('#collapseNecessidadeEspecial').collapse('show');

        input.setAttribute('required', '');
        contatoMedico.setAttribute('required', '');
        contatoFamiliar.setAttribute('required', '');
    }
    else{
        $('#collapseNecessidadeEspecial').collapse('hide');

        input.removeAttribute('required');
        contatoMedico.removeAttribute('required');
        contatoFamiliar.removeAttribute('required');

        input.value = '';
        contatoMedico.value = '';
        contatoFamiliar.value = '';
    }
})