function SetStatus(idLattes) {
  const token = Cookies.get('token');

  axios.get(`/ppg/user/inverte_status/${idLattes}`)
    .then(response => {
      const user = response.data;
      console.log(user.full_name, user.is_active);

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

function GetUser(idLattes, is_superuser, is_admin) {
  axios.get(`/ppg/user/${idLattes}`)
    .then(response => {
      const user = response.data;


      document.getElementById('editarIdLattes').value = user.idlattes;
      document.getElementById('editarFullName').value = user.full_name;
      document.getElementById('editarEmail').value = user.email;

      if (is_superuser){
        if (user.is_superuser)
          document.getElementById('editarSelectPerfil').options[0].selected = true;
        else if (user.is_admin)
          document.getElementById('editarSelectPerfil').options[1].selected = true;
        else 
          document.getElementById('editarSelectPerfil').options[2].selected = true;
          
        $('#editarIdIes').val(user.id_ies).change();
      }
      
      $('#modalEditarUsuario').modal('show');
    })
    .catch(error => {
      console.error('Get user error:', error);
    });


}

function AlterarSenha(email) {
  document.getElementById('link-alterar-senha').setAttribute('href', `/ppg/alterarsenha/${email}`);
      
  $('#modalAlterarSenha').modal('show');
   
}

function DeleteUser(idLattes, nome) {
  sessionStorage.setItem('idLattes', idLattes);

  document.getElementById('msgExclusao').innerHTML = `
    O usuário <strong>${nome}</strong> será excluído permanentemente do banco de dados. Deseja continuar com a operação?
  `;

  $('#bt_excluir_usuario').attr('onclick', `location.href='/ppg/excluir/usuario/${idLattes}'`);

  $('#modalConfirmacao').modal('show');
}

$(document).ready(function () {
  $('#wrapper').show();

});

// Função de filtro aplicado apenas em Nome, ID Lattes, CPF ou E-mail
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

$('#novoUsuario').on('click', function (event) {
  event.preventDefault();

  $('#modalNovoUsuario').modal('show');
})

$('#modalNovoUsuario').on('hidden.bs.modal', function () {
  // Limpa inputs
  document.getElementById('cadastrarAlert').innerHTML = '';
  document.getElementById('idLattes').value = '';
  document.getElementById('fullName').value = '';
  document.getElementById('email').value = '';

  if (document.getElementById('superuserForm').textContent) {
    document.getElementById('selectPerfil').options[2].selected = true;
    $('#idIes').val('000').change();
    //document.getElementById('idIes').value = '';
  }
});

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

$('#checkboxPassword').on('click', function () {
  const password = document.getElementById('password');

  if (document.getElementById('checkboxPassword').checked)
    password.removeAttribute('disabled');
  else {
    password.value = '';
    password.setAttribute('disabled', '');
  }
})

$('#cadastrar').on("submit", function (event) {
  event.preventDefault();

  const idLattes = document.getElementById('idLattes').value;
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  // const idIes = document.getElementById('idIes').value;

  var is_superuser = false;
  var is_admin = false;

  if ($('#selectPerfil').length > 0) {
    const perfil = document.getElementById('selectPerfil').value;
    const idIes = $('#idIes').find(":selected").val();

    switch (perfil) {
      case 'Dono':
        is_superuser = true;
        is_admin = true;
        break;

      case 'Administrador':
        is_superuser = false;
        is_admin = true;
        break;

      case 'Usuário comum':
        is_superuser = false;
        is_admin = false;
        break;
    }

    if (idIes !== '000'){
      axios.post('/ppg/cadastrar/usuario', {
        idlattes: idLattes,
        full_name: fullName,
        email: email,
        is_admin: is_admin,
        is_superuser: is_superuser,
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
  }
  else {
    axios.post('/ppg/cadastrar/usuario', {
      idlattes: idLattes,
      full_name: fullName,
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


  // axios.get('/api/dados/users/me', {
  //   headers: {
  //     'accept': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   }
  // })
  //   .then(response => {
  //     const user = response.data;

  //     if (!(user.is_superuser === true)) {
  //       axios.post('/api/dados/users/', {
  //         idlattes: idLattes,
  //         full_name: fullName,
  //         email: email,
  //         id_ies: user.id_ies
  //       }, {
  //         headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${token}` }
  //       })
  //         .then(response => {
  //           const user = response.data;
  //           console.log(user);

  //           // Gera a tabela inserindo novo registro
  //           GenerateTable();
  //           // Limpa input de pesquisa para ilusão ao usuário
  //           document.getElementById('search-users').value = "";

  //           document.getElementById("cadastrarAlert").innerHTML = '<div class="alert alert-success alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>Usuário cadastrado com sucesso.</span></div>';
  //         })
  //         .catch(error => {
  //           console.error('Create user error:', error);

  //           document.getElementById("cadastrarAlert").innerHTML = `<div class="alert alert-danger alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>${error.response.data.detail}</span></div>`;
  //         });
  //     }
  //     else {
  //       const perfil = document.getElementById('selectPerfil').value;
  //       //const idIes = document.getElementById('idIes').value;
  //       const idIes = $('#idIes').find(":selected").val();

  //       switch (perfil) {
  //         case 'Dono':
  //           var is_superuser = true;
  //           var is_admin = true;
  //           break;

  //         case 'Administrador':
  //           var is_superuser = false;
  //           var is_admin = true;
  //           break;

  //         case 'Usuário comum':
  //           var is_superuser = false;
  //           var is_admin = false;
  //           break;
  //       }

        
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Create user error:', error);
  //   });
});

$('#editar').on('submit', function (event) {
  event.preventDefault();

  const idLattes = document.getElementById('editarIdLattes').value;
  const fullName = document.getElementById('editarFullName').value;
  const email = document.getElementById('editarEmail').value;
  const password = document.getElementById('password').value;

  var is_superuser = false;
  var is_admin = false;

  if ($('#editarSelectPerfil').length > 0) {
    const perfil = document.getElementById('editarSelectPerfil').value;
    const idIes = $('#editarIdIes').find(":selected").val();

    switch (perfil) {
      case 'Dono':
        is_superuser = true;
        is_admin = true;
        break;

      case 'Administrador':
        is_superuser = false;
        is_admin = true;
        break;

      case 'Usuário comum':
        is_superuser = false;
        is_admin = false;
        break;
    }

    if (idIes !== '000'){
      axios.post('/ppg/atualizar/usuario', {
        idlattes: idLattes,
        full_name: fullName,
        email: email,
        is_admin: is_admin,
        change_password: password,
        is_superuser: is_superuser,
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
  }
  else {
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


  $('#alterarSenha').on('submit', function (event) {
    event.preventDefault();
  
    const idLattes = document.getElementById('alterarSenhaIdLattes').value;
    const fullName = document.getElementById('alterarSenhaFullName').value;
    const email = document.getElementById('alterarSenhaEmail').value;
    const password = document.getElementById('alterarSenhaPassword').value;

    if(email === 'teste@unimontes.br')
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



  // axios.get('/api/dados/users/me', {
  //   headers: {
  //     'accept': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   }
  // })
  //   .then(response => {
  //     const user = response.data;

  //     if (!(user.is_superuser === true)) {
  //       axios.post('/api/dados/users/update_user/', {
  //         idlattes: idLattes,
  //         full_name: fullName,
  //         email: email,
  //         change_password: password,
  //         id_ies: user.id_ies
  //       }, {
  //         headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${token}` }
  //       })
  //         .then(response => {
  //           const user = response.data;
  //           console.log(user);

  //           // Gera a tabela atualizando registro
  //           GenerateTable();
  //           // Limpa input de pesquisa para ilusão ao usuário
  //           document.getElementById('search-users').value = "";

  //           document.getElementById("editarAlert").innerHTML = '<div class="alert alert-success alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>Usuário editado com sucesso.</span></div>';
  //         })
  //         .catch(error => {
  //           console.error('Update user error:', error);

  //           document.getElementById("editarAlert").innerHTML = `<div class="alert alert-danger alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>${error.response.data.detail}</span></div>`;
  //         });
  //     }
  //     else {
  //       const perfil = document.getElementById('editarSelectPerfil').value;
  //       //const idIes = document.getElementById('editarIdIes').value;
  //       const idIes = $('#editarIdIes').find(":selected").val();

  //       switch (perfil) {
  //         case 'Dono':
  //           var is_superuser = true;
  //           var is_admin = true;
  //           break;

  //         case 'Administrador':
  //           var is_superuser = false;
  //           var is_admin = true;
  //           break;

  //         case 'Usuário comum':
  //           var is_superuser = false;
  //           var is_admin = false;
  //           break;
  //       }

  //       if(idIes !== '000'){

  //         axios.post('/api/dados/users/update_user/', {
  //           idlattes: idLattes,
  //           full_name: fullName,
  //           email: email,
  //           change_password: password,
  //           is_admin: is_admin,
  //           is_superuser: is_superuser,
  //           id_ies: idIes
  //         }, {
  //           headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${token}` }
  //         })
  //           .then(response => {
  //             const user = response.data;
  //             console.log(user);

  //             // Gera a tabela atualizando registro
  //             GenerateTable();
  //             // Limpa input de pesquisa para ilusão ao usuário
  //             document.getElementById('search-users').value = "";

  //             document.getElementById("editarAlert").innerHTML = '<div class="alert alert-success alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>Usuário editado com sucesso.</span></div>';
  //           })
  //           .catch(error => {
  //             console.error('Update user error:', error);

  //             document.getElementById("editarAlert").innerHTML = `<div class="alert alert-danger alert-dismissible" role="alert"><button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><span>${error.response.data.detail}</span></div>`;
  //           });
  //       }
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Update user error:', error);
  //   });
