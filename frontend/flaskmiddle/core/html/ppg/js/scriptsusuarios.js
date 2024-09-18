document.getElementById("editar").addEventListener("submit", function (e) {
  e.preventDefault();

  const idLattes = document.getElementById('editarIdLattes').value;
  const fullName = document.getElementById('editarFullName').value;
  const email = document.getElementById('editarEmail').value;
  const password = document.getElementById('password').value;

  let isSuperuser = false;
  let isAdmin = false;

  const perfilElement = document.getElementById('editarSelectPerfil');
  if (perfilElement) {
    const perfil = perfilElement.value;
    const idIes = document.getElementById('editarIdIes').value;

    switch (perfil) {
      case 'Dono':
        isSuperuser = true;
        isAdmin = true;
        break;

      case 'Administrador':
        isSuperuser = false;
        isAdmin = true;
        break;

      case 'Usuário comum':
        isSuperuser = false;
        isAdmin = false;
        break;
    }

    if (idIes !== '000') {
      axios.post('/ppg/atualizar/usuario', {
        idlattes: idLattes,
        full_name: fullName,
        email: email,
        is_admin: isAdmin,
        change_password: password,
        is_superuser: isSuperuser,
        id_ies: idIes
      })
        .then(response => {
          const page_link = response.data;
          window.location = page_link;
        })
        .catch(error => {
          console.error('Create user error:', error);
        });
    }
  } else {
    axios.post('/ppg/atualizar/usuario', {
      idlattes: idLattes,
      full_name: fullName,
      change_password: password,
      email: email,
    })
      .then(response => {
        const page_link = response.data;
        window.location = page_link;
      })
      .catch(error => {
        console.error('Create user error:', error);
      });
  }
});


document.getElementById("alterarSenha").addEventListener("submit", function (e) {
  e.preventDefault();

  const idLattes = document.getElementById('alterarSenhaIdLattes').value;
  const fullName = document.getElementById('alterarSenhaFullName').value;
  const email = document.getElementById('alterarSenhaEmail').value;
  const password = document.getElementById('alterarSenhaPassword').value;

  if (email === 'teste@unimontes.br')
    return;

  axios.post('/ppg/atualizar/usuario', {
    idlattes: idLattes,
    full_name: fullName,
    change_password: password,
    email: email,
  })
    .then(response => {
      const page_link = response.data;
      window.location = page_link;
    })
    .catch(error => {
      console.error('Create user error:', error);
    });
});


function modificarStatus(idLattes) {
  axios.get(`/ppg/user/inverte_status/${idLattes}`)
    .then(response => {
      const user = response.data;

      if (!user.is_active) {
        document.getElementById('lock' + idLattes).setAttribute("class", "fas fa-user-slash");
        document.getElementById('ativo' + idLattes).innerHTML = 'Não';
        document.getElementById('lock' + idLattes).setAttribute("title", "Ativar");
      }
      else {
        document.getElementById('lock' + idLattes).setAttribute("class", "fas fa-user");
        document.getElementById('ativo' + idLattes).innerHTML = 'Sim';
        document.getElementById('lock' + idLattes).setAttribute("title", "Desativar");
      }
    })
    .catch(error => {
      console.log("Set status user error:", error);
    })
}


function getUser(idLattes, is_superuser, is_admin) {
  axios.get(`/ppg/user/${idLattes}`)
    .then(response => {
      const user = response.data;

      document.getElementById('editarIdLattes').value = user.idlattes;
      document.getElementById('editarFullName').value = user.full_name;
      document.getElementById('editarEmail').value = user.email;

      if (is_superuser) {
        const selectPerfil = document.getElementById('editarSelectPerfil');

        if (user.is_superuser) {
          selectPerfil.options[0].selected = true;
        } else if (user.is_admin) {
          selectPerfil.options[1].selected = true;
        } else {
          selectPerfil.options[2].selected = true;
        }

        const idIes = document.getElementById('editarIdIes');
        idIes.value = user.id_ies;
        const event = new Event('change');
        idIes.dispatchEvent(event);
      }

      const modalOverlay = document.getElementById('modalEditarUsuario');
      const modalPanel = document.getElementById('modalPanelEditar');
      modalOverlay.classList.remove('hidden');
      modalPanel.classList.remove('hidden');
    })
    .catch(error => {
      console.error('Get user error:', error);
    });
}

function esconderModalEditaUser() {
  const modalOverlay = document.getElementById('modalEditarUsuario');
  const modalPanel = document.getElementById('modalPanelEditar');
  modalOverlay.classList.add('hidden');
  modalPanel.classList.add('hidden');
}

document.getElementById('btn-cancela-user').addEventListener('click', esconderModalEditaUser);

function togglePassword() {
  const passwordField = document.getElementById('alterarSenhaPassword');
  const checkbox = document.getElementById('checkboxPassword');
  passwordField.disabled = !checkbox.checked;
}

function alterarSenha(idLattes, is_superuser, is_admin) {
  axios.get(`/ppg/user/${idLattes}`)
    .then(response => {
      const user = response.data;

      document.getElementById('alterarSenhaIdLattes').value = user.idlattes;
      document.getElementById('alterarSenhaFullName').value = user.full_name;
      document.getElementById('alterarSenhaEmail').value = user.email;

      const modal = document.getElementById('modalPanel');
      const overlay = document.getElementById('modalAlterarSenha');

      overlay.classList.remove('hidden');
      modal.classList.remove('hidden');

      overlay.classList.add('opacity-100');
      modal.classList.add('opacity-100');
    })
    .catch(error => {
      console.error('Get user error:', error);
    });
}

document.getElementById('btn-cancela-alteracao').addEventListener('click', function () {
  const modal = document.getElementById('modalPanel');
  const overlay = document.getElementById('modalAlterarSenha');

  overlay.classList.add('opacity-0', 'hidden');
  modal.classList.add('opacity-0', 'hidden');

  overlay.addEventListener("click", () => {
    overlay.classList.add('opacity-0', 'hidden');
    modal.classList.add('opacity-0', 'hidden');  
  })

});

function mostrarSenhaId(id) {
  const passwordInput = document.getElementById(id);
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
}


function apagarUser(idLattes, nome) {
  const btExcluirUsuario = document.getElementById('bt-excluir-usuario');
  const modalConfirmacao = document.getElementById('modalConfirmacao');
  const modalContainerExluirUsuario = document.getElementById('modalContainerExluirUsuario');
  const btnCancelaExclusao = document.getElementById('btn-cancela-exclusao');

  sessionStorage.setItem('idLattes', idLattes);

  document.getElementById('msg-exclusao').innerHTML = `
      O usuário ${nome} será excluído permanentemente do banco de dados. Deseja continuar com a operação?
  `;

  btExcluirUsuario.removeEventListener('click', handleExcluirClick);
  btnCancelaExclusao.removeEventListener('click', esconderModal);

  function handleExcluirClick() {
    location.href = `/ppg/excluir/usuario/${idLattes}`;
  }

  function mostrarModal() {
    modalConfirmacao.classList.remove('hidden');
    modalConfirmacao.classList.add('opacity-100');
    modalContainerExluirUsuario.classList.remove('hidden');
    modalContainerExluirUsuario.classList.add('opacity-100', 'translate-y-0');
  }

  function esconderModal() {
    modalConfirmacao.classList.add('hidden');
    modalConfirmacao.classList.remove('opacity-100');
    modalContainerExluirUsuario.classList.add('hidden');
    modalContainerExluirUsuario.classList.remove('opacity-100', 'translate-y-0');
    modalContainerExluirUsuario.classList.add('translate-y-4');
  }

  btExcluirUsuario.addEventListener('click', handleExcluirClick);
  btnCancelaExclusao.addEventListener('click', esconderModal);

  mostrarModal();
}


$("#search-users").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#tbody-users tr").each(function () {
    var $row = $(this);
    var $cells = $row.find("td:lt(3)"); // Seleciona as 3 primeiras colunas (índices 0 a 2)

    var rowContainsValue = false;

    $cells.each(function () {
      if ($(this).text().toLowerCase().indexOf(value) > -1) {
        rowContainsValue = true;
        return false; // Saia do loop interno se um valor for encontrado
      }
    });

    $row.toggle(rowContainsValue);
  });
});

//FECHA MODAL
$('#modalEditarUsuario').on('hidden.bs.modal', function () {
  // Limpa inputs
  document.getElementById('editarAlert').innerHTML = '';
  document.getElementById('editarIdLattes').value = '';
  document.getElementById('editarFullName').value = '';
  document.getElementById('editarEmail').value = '';
  document.getElementById('password').value = '';
  document.getElementById('password').setAttribute('disabled', '');
  document.getElementById('checkboxPassword').checked = false;

  if (document.getElementById('superuserForm').textContent) {
    document.getElementById('editarSelectPerfil').options[2].selected = true;
    $('#editarIdIes').val('000').change();
    //document.getElementById('editarIdIes').value = '';
  }
});

// document.getElementById("checkboxPassword").addEventListener("submit", function() {
//   const password = document.getElementById('password');

//   if (document.getElementById('checkboxPassword').checked)
//     password.removeAttribute('disabled');
//   else {
//     password.value = '';
//     password.setAttribute('disabled', '');
//   }
// })

document.getElementById("cadastrar").addEventListener("submit", function (e) {
  e.preventDefault();

  const idLattes = document.getElementById('idLattes').value;
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;

  let isSuperUser = false;
  let isAdmin = false;

  const selectPerfil = document.getElementById('selectPerfil');
  const idIesElement = document.getElementById('idIes');

  if (selectPerfil) {
    const perfil = selectPerfil.value;
    const idIes = idIesElement.options[idIesElement.selectedIndex].value;

    switch (perfil) {
      case 'Dono':
        isSuperUser = true;
        isAdmin = true;
        break;

      case 'Administrador':
        isSuperUser = false;
        isAdmin = true;
        break;

      case 'Usuário comum':
        isSuperUser = false;
        isAdmin = false;
        break;
    }

    if (idIes !== '000') {
      axios.post('/ppg/cadastrar/usuario', {
        idlattes: idLattes,
        full_name: fullName,
        email: email,
        is_admin: isAdmin,
        is_superuser: isSuperUser,
        id_ies: idIes
      })
        .then(response => {
          const page_link = response.data;
          window.location = page_link;
        })
        .catch(error => {
          console.error('Create user error:', error);
        });
    }
  } else {
    axios.post('/ppg/cadastrar/usuario', {
      idlattes: idLattes,
      full_name: fullName,
      email: email
    })
      .then(response => {
        const page_link = response.data;
        window.location = page_link;
      })
      .catch(error => {
        console.error('Create user error:', error);
      });
  }
});


const backdropNovoUsuario = document.getElementById('modalNovoUsuario');
const modalContainerNovoUsuario = document.getElementById('modalContainerNovoUsuario');
const modalNovoUsuario = document.getElementById('modalPanelNovoUsuario');
const btnNovoUsuario = document.getElementById('novoUsuario');
const cancelaNovoUser = document.getElementById("cancelaNovoUser");

function mostrarModalNovoUser() {
  backdropNovoUsuario.classList.remove("hidden");
  modalContainerNovoUsuario.classList.remove("hidden");
  modalNovoUsuario.classList.remove("translate-y-4");
  modalNovoUsuario.classList.add("opacity-100", "translate-y-0");
}

function esconderModalNovoUser() {
  backdropNovoUsuario.classList.add("hidden");
  modalContainerNovoUsuario.classList.add("hidden");
  modalNovoUsuario.classList.remove("opacity-100", "translate-y-0");
  modalNovoUsuario.classList.add("opacity-0", "translate-y-4");
}

btnNovoUsuario.addEventListener("click", () => {
  mostrarModalNovoUser();
});

cancelaNovoUser.addEventListener("click", () => {
  esconderModalNovoUser();
});

backdropNovoUsuario.addEventListener("click", () => {
  esconderModalNovoUser();
});

function mostrarModalExcluirUser() {
  backdropNovoUsuario.classList.remove("hidden");
  modalContainerNovoUsuario.classList.remove("hidden");
  modalNovoUsuario.classList.remove("translate-y-4");
  modalNovoUsuario.classList.add("opacity-100", "translate-y-0");
}

function esconderModalNovoUser() {
  backdropNovoUsuario.classList.add("hidden");
  modalContainerNovoUsuario.classList.add("hidden");
  modalNovoUsuario.classList.remove("opacity-100", "translate-y-0");
  modalNovoUsuario.classList.add("opacity-0", "translate-y-4");
}

btnNovoUsuario.addEventListener("click", () => {
  mostrarModalNovoUser();
});

cancelaNovoUser.addEventListener("click", () => {
  esconderModalNovoUser();
});

backdropNovoUsuario.addEventListener("click", () => {
  esconderModalNovoUser();
});

const checkbox = document.getElementById('checkbox-password');
const passwordInput = document.getElementById('password');

passwordInput.disabled = false;
checkbox.checked = true;

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    passwordInput.disabled = false;
    passwordInput.classList.remove("bg-gray-100", "cursor-not-allowed");
  } else {
    passwordInput.disabled = true;
    passwordInput.classList.add("bg-gray-100", "cursor-not-allowed");
  }
});

const btnFecharMsg = document.getElementById("btn-fechar");
const msgAlerta = document.getElementById("msg-alerta");

if (btnFecharMsg) {
  btnFecharMsg.addEventListener("click", function () {
    msgAlerta.style.display = 'none';
  });
}