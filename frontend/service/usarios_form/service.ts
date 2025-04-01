"use server";
import type { UserForm } from "@/types/user_form"

export async function verificarSessao(refreshToken: string) {
  try {
    const response = await fetch("http://localhost:8003/verificar_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    }).then<{ access_token: string | undefined; erro: boolean }>(
      async (res) => await res.json()
    );

    return response;
  } catch (e) {
    console.error(e);
    return { erro: true, access_token: undefined };
  }
}


export async function criarUsuario(usuario: UserForm) {
  try {
    const body: any = {
      idlattes: usuario.idlattes,
      name: usuario.name,
      email: usuario.email,
      password: usuario.idlattes,
      is_active: usuario.is_active,
      is_coordenador: usuario.is_coordenador,
      is_admin: usuario.is_admin,
      curso: usuario.curso ?? null,
    };

    // Adiciona cpf no body apenas se existir
    if (usuario.cpf) {
      body.cpf = usuario.cpf;
    }

    const response = await fetch("http://localhost:8003/usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then<{ status: string; mensagem: string }>(async (res) => await res.json());

    return response;
  } catch (e) {
    console.error(e);
    return { status: "erro", mensagem: "Erro ao criar usuário" };
  }
}

export async function obtemListaUsuarios(is_admin: boolean): Promise<any> {
  try {
    const response = await fetch(`http://localhost:8003/usuarios?is_admin=${is_admin}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then<[]>((res) => res.json());

    return response;
  } catch (e) {
    console.error("Erro ao obter a lista de usuários:", e);
    throw new Error("Falha ao buscar a lista de usuários.");
  }
}

export async function useObterUsuario(idlattes: string) {
  try {
    const response = await fetch(`http://localhost:8003/usuario/${idlattes}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then<{ status: string; mensagem: string; usuario?: UserForm }>(async (res) => await res.json());

    if (response.status === "erro" || !response.usuario) {
      return { status: "erro", mensagem: "Usuário não encontrado" };
    }

    return response;
  } catch (e) {
    console.error(e);
    return { status: "erro", mensagem: "Erro ao obter usuário" };
  }
}

export async function atualizarUsuario(usuario: UserForm, novaSenha?: string) {
  try {
    // Criamos um objeto JSON com os dados do usuário
    const body: Record<string, any> = {
      idlattes: usuario.idlattes,
      name: usuario.name,
      email: usuario.email,
      is_active: usuario.is_active,
      is_coordenador: usuario.is_coordenador,
      is_admin: usuario.is_admin,
      curso: usuario.curso,
    };

    if (usuario.cpf) {
      body.cpf = usuario.cpf;
    }

    // Se novaSenha foi informada, adicionamos ao body
    if (novaSenha && novaSenha.trim() !== "") {
      body.password = novaSenha;
    }

    const response = await fetch(`http://localhost:8003/usuario/${usuario.idlattes}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // Apenas inclui password se novaSenha for passada
    }).then<{ status: string; mensagem: string }>(async (res) => await res.json());

    return response;
  } catch (e) {
    console.error(e);
    return { status: "erro", mensagem: "Erro ao atualizar usuário" };
  }
}


export async function deletarUsuario(idlattes: string) {
  try {
    const response = await fetch(`http://localhost:8003/usuario/${idlattes}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then<{ status: string; mensagem: string }>(async (res) => await res.json());

    return response;
  } catch (e) {
    console.error(e);
    return { status: "erro", mensagem: "Erro ao deletar usuário" };
  }
}


export async function alternarStatusUsuario(idlattes: string) {
  try {
    const response = await fetch(`http://localhost:8003/usuario/${idlattes}/alternar-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    }).then<{ status: string; mensagem: string }>(async (res) => await res.json());

    return response;
  } catch (e) {
    console.error(e);
    return { status: "erro", mensagem: "Erro ao alternar status do usuário" };
  }
}


export async function obterStatusFormulario(is_coordenador: boolean, ano?: number) {
  try {
    // Monta a URL com os parâmetros necessários
    const url = new URL("http://localhost:8003/status_formulario");
    url.searchParams.append("is_coordenador", String(is_coordenador));
    if (ano) {
      url.searchParams.append("ano", String(ano));
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then<[]>((res) => res.json());

    return response;
  } catch (e) {
    console.error("Erro ao obter status de preenchimento de formulário:", e);
    throw new Error("Falha ao obter status de preenchimento de formulário.");
  }
}
