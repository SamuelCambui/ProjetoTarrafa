const limparCamposModal = () => {
  document.getElementById("editarAlert").innerHTML = "";
  document.getElementById("editarIdLattes").value = "";
  document.getElementById("editarFullName").value = "";
  document.getElementById("editarEmail").value = "";
  document.getElementById("editar-senha").value = "";
  document.getElementById("editar-senha").setAttribute("disabled", "");
  document.getElementById("checkbox-senha").checked = false;

  const superuserForm = document.getElementById("superuserForm");
  if (superuserForm && superuserForm.textContent.trim()) {
    const editarSelectPerfil = document.getElementById("editarSelectPerfil");
    if (editarSelectPerfil && editarSelectPerfil.options.length > 2) {
      editarSelectPerfil.options[2].selected = true;
    }
  }
  const editarIdIes = document.getElementById("editarIdIes");
  if (editarIdIes) {
    editarIdIes.value = "000";
  }
};

document
  .getElementById("editar")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const idLattes = document.getElementById("editarIdLattes").value;
    const nomeCompleto = document.getElementById("editarFullName").value;
    const email = document.getElementById("editarEmail").value;
    const senha = document.getElementById("editar-senha").value;

    let eSuperuser = false;
    let isAdmin = false;

    const perfilOpcao = document.getElementById("editar-tipo-perfil");
    if (perfilOpcao) {
      const perfil = perfilOpcao.value;
      const idIes = document.getElementById("editar-id-ies").value;

      switch (perfil) {
        case "Dono":
          eSuperuser = true;
          isAdmin = true;
          break;

        case "Administrador":
          eSuperuser = false;
          isAdmin = true;
          break;

        case "Usuário comum":
          eSuperuser = false;
          isAdmin = false;
          break;
      }

      const checkbox = document.getElementById("checkbox-senha");

      if (checkbox.checked && !senha) {
        alert("É necessário inserir uma senha não vazia");
        return;
      }

      if (idIes !== "000") {
        axios
          .post("/ppg/atualizar/usuario", {
            idlattes: idLattes,
            full_name: nomeCompleto,
            email: email,
            is_admin: isAdmin,
            change_password: senha,
            is_superuser: eSuperuser,
            id_ies: idIes,
          })
          .then((response) => {
            const linkPagina = response.data;
            window.location = linkPagina;
          })
          .catch((error) => {
            console.error("Create user error:", error);
          });
        return;
      }

      axios
        .post("/ppg/atualizar/usuario", {
          idlattes: idLattes,
          full_name: nomeCompleto,
          change_password: senha,
          email: email,
        })
        .then((response) => {
          const linkPagina = response.data;
          window.location = linkPagina;
        })
        .catch((error) => {
          console.error("Create user error:", error);
        });
    }
  });

document
  .getElementById("cadastrar")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const idLattes = document.getElementById("idLattes").value;
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;

    let isSuperUser = false;
    let isAdmin = false;

    const selectPerfil = document.getElementById("tipo-perfil");
    const idIesElement = document.getElementById("id-ies");

    const carregamento = document.getElementById("carregamento");
    carregamento.classList.remove("hidden");
    carregamento.classList.add("flex");
    esconderModal(backdropModalNovoUser, conteudoNovoUser);

    try {
      if (selectPerfil) {
        const perfil = selectPerfil.value;
        const idIes = idIesElement.options[idIesElement.selectedIndex].value;

        switch (perfil) {
          case "Dono":
            isSuperUser = true;
            isAdmin = true;
            break;
          case "Administrador":
            isSuperUser = false;
            isAdmin = true;
            break;
          case "Usuário comum":
            isSuperUser = false;
            isAdmin = false;
            break;
        }

        if (idIes !== "000") {
          const response = await axios.post("/ppg/cadastrar/usuario", {
            idlattes: idLattes,
            full_name: fullName,
            email: email,
            is_admin: isAdmin,
            is_superuser: isSuperUser,
            id_ies: idIes,
          });
          const pageLink = response.data;
          window.location = pageLink;
        }
      } else {
        const response = await axios.post("/ppg/cadastrar/usuario", {
          idlattes: idLattes,
          full_name: fullName,
          email: email,
        });
        const pageLink = response.data;
        window.location = pageLink;
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    } finally {
      carregamento.classList.remove("flex");
      carregamento.classList.add("hidden");
    }
  });

const obterUsuario = async (idLattes, is_superuser, is_admin) => {
  const carregamento = document.getElementById("carregamento");
  carregamento.classList.remove("hidden");
  carregamento.classList.add("flex");

  limparCamposModal();

  try {
    const response = await axios.get(`/ppg/user/${idLattes}`);
    const user = response.data;
    
    document.getElementById("editarIdLattes").value = user.idlattes;
    document.getElementById("editarFullName").value = user.full_name;
    document.getElementById("editarEmail").value = user.email;

    if (is_superuser) {
      const perfilSelecionado = document.getElementById("editar-id-ies");

      if (user.is_superuser) {
        perfilSelecionado.options[0].selected = true;
        perfilSelecionado.options[2].selected = true;
      }

      $("#editar-id-ies").val(user.id_ies).change();

      const checkbox = document.getElementById("checkbox-senha");
      const passwordInput = document.getElementById("editar-senha");
      const btnMostrarSenha = document.getElementById("mostrar-senha");

      passwordInput.disabled = false;
      checkbox.checked = true;

      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          passwordInput.disabled = false;
          passwordInput.classList.remove("bg-gray-100", "cursor-not-allowed");
        } else {
          passwordInput.disabled = true;
          passwordInput.value = "";
          passwordInput.classList.add("bg-gray-100", "cursor-not-allowed");
        }
        btnMostrarSenha.classList.toggle("hidden");
      });
    }

    mostrarModal(backdropModalEditarUser, conteudoEditarUser);
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    carregamento.classList.remove("flex");
    carregamento.classList.add("hidden");
  }
};

//Funções chamadas diretamente
document
  .getElementById("alterarSenha")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const idLattes = document.getElementById("alterarSenhaIdLattes").value;
    const fullName = document.getElementById("alterarSenhaFullName").value;
    const email = document.getElementById("alterarSenhaEmail").value;
    const password = document.getElementById("alterarSenhaPassword").value;

    if (email === "teste@unimontes.br") return;

    const carregamento = document.getElementById("carregamento");
    carregamento.classList.remove("hidden");
    carregamento.classList.add("flex");

    esconderModal(backdropModalEditarSenhaUser, conteudoEditarSenhaUser);

    try {
      const response = await axios.post("/ppg/atualizar/usuario", {
        idlattes: idLattes,
        full_name: fullName,
        change_password: password,
        email: email,
      });

      //Melhorar isso, ao invés de redirecionar, continuar na mesma página
      const pageLink = response.data;
      window.location = pageLink;
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      carregamento.classList.remove("flex");
      carregamento.classList.add("hidden");
    }
  });

const alterarSenha = async (idLattes, is_superuser, is_admin) => {
  const carregamento = document.getElementById("carregamento");
  carregamento.classList.remove("hidden");
  carregamento.classList.add("flex");

  try {
    const response = await axios.get(`/ppg/user/${idLattes}`);
    const user = response.data;

    document.getElementById("alterarSenhaIdLattes").value = user.idlattes;
    document.getElementById("alterarSenhaFullName").value = user.full_name;
    document.getElementById("alterarSenhaEmail").value = user.email;

    mostrarModal(backdropModalEditarSenhaUser, conteudoEditarSenhaUser);
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    carregamento.classList.remove("flex");
    carregamento.classList.add("hidden");
  }
};

const modificarStatus = async (idLattes) => {
  const carregamento = document.getElementById("carregamento");
  carregamento.classList.remove("hidden");
  carregamento.classList.add("flex");

  try {
    const response = await axios.get(`/ppg/user/inverte_status/${idLattes}`);
    const user = response.data;

    const lockElement = document.getElementById("lock" + idLattes);
    const ativoElement = document.getElementById("ativo" + idLattes);

    if (!user.is_active) {
      lockElement.setAttribute("class", "fas fa-user-slash");
      ativoElement.innerHTML = "Não";
      lockElement.setAttribute("title", "Ativar");
    } else {
      lockElement.setAttribute("class", "fas fa-user");
      ativoElement.innerHTML = "Sim";
      lockElement.setAttribute("title", "Desativar");
    }
  } catch (error) {
    console.error("Error setting user status:", error);
  } finally {
    carregamento.classList.remove("flex");
    carregamento.classList.add("hidden");
  }
};

const apagarUser = (idLattes, nome) => {
  sessionStorage.setItem("idLattes", idLattes);

  document.getElementById("msg-exclusao").innerHTML = `
      O usuário <span class="font-bold"> ${nome} </span> será excluído permanentemente do banco de dados. Deseja continuar com a operação?
  `;

  const btnExcluiUser = document.getElementById("btn-excluir-user");
  if (btnExcluiUser) {
    btnExcluiUser.addEventListener("click", async () => {
      const carregamento = document.getElementById("carregamento");
      carregamento.classList.remove("hidden");
      carregamento.classList.add("flex");

      try {
        // await axios.post(`/ppg/excluir/usuario/${idLattes}`);
        location.href = `/ppg/excluir/usuario/${idLattes}`;
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        carregamento.classList.remove("flex");
        carregamento.classList.add("hidden");
      }
    });
  }

  mostrarModal(backdropModalExcluirUser, conteudoModalExcluirUser);
};

//! Funções relacionadas aos modais e seus respectivos event handlers
const mostrarModal = (brackdropModal, conteudoModal) => {
  if (brackdropModal && conteudoModal) {
    conteudoModal.setAttribute("aria-hidden", "false");
    brackdropModal.setAttribute("aria-hidden", "false");

    conteudoModal.classList.remove("hidden");
    brackdropModal.classList.remove("hidden");
    brackdropModal.classList.add("opacity-100", "translate-y-0");
    conteudoModal.classList.add("opacity-100");

    brackdropModal.focus();
  }
};

const esconderModal = (brackdropModal, conteudoModal) => {
  if (brackdropModal && conteudoModal) {
    conteudoModal.setAttribute("aria-hidden", "true");
    brackdropModal.setAttribute("aria-hidden", "true");

    conteudoModal.classList.remove("opacity-100");
    conteudoModal.classList.add("opacity-0", "hidden");
    brackdropModal.classList.remove("opacity-100", "translate-y-0");
    brackdropModal.classList.add("opacity-0");

    setTimeout(() => {
      conteudoModal.classList.add("hidden");
      brackdropModal.classList.add("hidden");
    }, 300);
  }
};

//?Abrir modal novo user
const btnNovoUsuario = document.getElementById("btn-novo-usuario");
const cancelaNovoUser = document.getElementById("btn-cancela-novo-user");
const backdropModalNovoUser = document.getElementById("modal-novo-user");
const conteudoNovoUser = document.getElementById("conteudo-novo-user");

btnNovoUsuario.addEventListener("click", () => {
  mostrarModal(backdropModalNovoUser, conteudoNovoUser);
});
cancelaNovoUser.addEventListener("click", () => {
  esconderModal(backdropModalNovoUser, conteudoNovoUser);
});
backdropModalNovoUser.addEventListener("click", () => {
  esconderModal(backdropModalNovoUser, conteudoNovoUser);
});

//?Abrir modal editar user
const btnEditUser = document.getElementById("btn-edita-user");
const cancelaEditUser = document.getElementById("btn-cancela-edicao-user");
const backdropModalEditarUser = document.getElementById("modal-editar-user");
const conteudoEditarUser = document.getElementById("conteudo-editar-user");

// btnEditUser.addEventListener("click", () => {
//   mostrarModal(backdropModalEditarUser, conteudoEditarUser);
// });

cancelaEditUser.addEventListener("click", () => {
  esconderModal(backdropModalEditarUser, conteudoEditarUser);
});
backdropModalEditarUser.addEventListener("click", () => {
  esconderModal(backdropModalEditarUser, conteudoEditarUser);
});

//?Modal alterar senha
const cancelaEditSenhaUser = document.getElementById(
  "btn-cancela-edicao-senha-user",
);
const backdropModalEditarSenhaUser = document.getElementById(
  "modal-editar-senha-user",
);
const conteudoEditarSenhaUser = document.getElementById(
  "conteudo-editar-senha-user",
);

cancelaEditSenhaUser.addEventListener("click", () => {
  esconderModal(backdropModalEditarSenhaUser, conteudoEditarSenhaUser);
});
backdropModalEditarSenhaUser.addEventListener("click", () => {
  esconderModal(backdropModalEditarSenhaUser, conteudoEditarSenhaUser);
});

//?Modal para excluir user
const btnExcluiUser = document.getElementById("btn-excluir-user");
const cancelaExclusaoUser = document.getElementById(
  "btn-cancela-exclusao-user",
);
const backdropModalExcluirUser = document.getElementById("modal-exclui-user");
const conteudoModalExcluirUser = document.getElementById(
  "conteudo-exclui-user",
);

cancelaExclusaoUser.addEventListener("click", () => {
  esconderModal(backdropModalExcluirUser, conteudoModalExcluirUser);
});

backdropModalExcluirUser.addEventListener("click", () => {
  esconderModal(backdropModalExcluirUser, conteudoModalExcluirUser);
});

btnExcluiUser.addEventListener("click", () => {});
//Fim dos modais

document
  .getElementById("buscar-usuario")
  .addEventListener("keyup", function () {
    let valor = this.value.toLowerCase();
    let linhas = document.querySelectorAll("#tbody-users tr");

    linhas.forEach(function (linha) {
      let celulas = linha.querySelectorAll("td:nth-child(-n+3)");

      let linhaContemValor = false;

      celulas.forEach(function (cel) {
        if (cel.textContent.toLowerCase().indexOf(valor) > -1) {
          linhaContemValor = true;
        }
      });

      linha.style.display = linhaContemValor ? "" : "none";
    });
  });

const btnFecharMsg = document.getElementById("btn-fechar-msg");
const msgAlerta = document.getElementById("msg-alerta");

if (btnFecharMsg) {
  btnFecharMsg.addEventListener("click", () => {
    msgAlerta.remove();
  });
}
