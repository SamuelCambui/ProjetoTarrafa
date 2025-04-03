"use server";

import { stubUsuarios, toApiResponseUsers } from "@/app/api/ppg/utils";
import { User, UserCriacao } from "@/lib/ppg/definitions";
import {
  CriacaoUsuarioRequest,
  Empty,
  UsuarioDados,
  UsuarioRequest,
  UsuarioResponse,
} from "@/protos/messages_pb";

export async function obtemListaUsuarios(usuario: User): Promise<any> {
  try {
    const usuarioDados = new UsuarioDados();

    usuarioDados.setIdLattes(usuario.idLattes);
    usuarioDados.setEmail(usuario.email);
    usuarioDados.setIsSuperuser(usuario.isSuperuser);
    usuarioDados.setIsAdmin(usuario.isAdmin);
    usuarioDados.setIdIes(usuario.idIes);
    // usuarioDados.setIsActive(usuario.isActive);

    const userResponse = new UsuarioResponse();
    userResponse.setUsuario(usuarioDados);

    const response = await new Promise((resolve, reject) => {
      stubUsuarios.obtemListaUsuarios(userResponse, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          try {
            const dadosObj = data.toObject()["itemList"];
            resolve(toApiResponseUsers(dadosObj));
          } catch (parseError) {
            reject(new Error("Failed to parse response data."));
          }
        }
      });
    });

    return response;
  } catch (e) {
    console.error("Error fetching user list:", e);
    throw new Error("Failed to fetch user list.");
  }
}

export async function obtemUsuario(idlattes: string): Promise<any> {
  try {
    const usuarioRequest = new UsuarioRequest();
    usuarioRequest.setIdLattes(idlattes);

    const response = await new Promise((resolve, reject) => {
      stubUsuarios.obtemUsuario(usuarioRequest, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          try {
            const dadosObj = data.toObject()["itemList"];
            // resolve(toApiResponseUsers(dadosObj));
          } catch (parseError) {
            reject(new Error("Failed to parse response data."));
          }
        }
      });
    });

    return response;
  } catch (e) {
    console.error("Error fetching user list:", e);
    throw new Error("Failed to fetch user list.");
  }
}

export async function deletarUsuario(idLattes: string): Promise<any> {
  try {
    const usuarioRequest = new UsuarioRequest();
    usuarioRequest.setIdLattes(idLattes);

    const response = await new Promise((resolve, reject) => {
      stubUsuarios.deletarUsuario(usuarioRequest, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          try {
            const dadosObj = data.toObject()
            resolve(dadosObj)
          } catch (parseError) {
            reject(new Error("Failed to parse response data."));
          }
        }
      });
    });

    return response;
  } catch (e) {
    console.error("Error fetching user list:", e);
    throw new Error("Failed to fetch user list.");
  }
}

export async function alterarStatusUsuario(idLattes: string): Promise<any> {
  try {
    const usuarioRequest = new UsuarioRequest();
    usuarioRequest.setIdLattes(idLattes);

    const response = await new Promise((resolve, reject) => {
      stubUsuarios.alternarStatusUsuario(
        usuarioRequest,
        (error: any, data: any) => {
          if (error) {
            reject(error);
          } else {
            try {
              const dadosObj = data.toObject()
              resolve(dadosObj)
              } catch (parseError) {
              reject(new Error("Failed to parse response data."));
            }
          }
        }
      );
    });

    return response;
  } catch (e) {
    console.error("Error fetching user list:", e);
    throw new Error("Failed to fetch user list.");
  }
}


export async function criarUsuario(usuario: UserCriacao): Promise<any> {
  try {

    const criacaoUserReq = new CriacaoUsuarioRequest();
    const usuarioDadosCriacao = new UsuarioDados();

    usuarioDadosCriacao.setIdLattes(usuario.idLattes);
    usuarioDadosCriacao.setEmail(usuario.email);
    usuarioDadosCriacao.setNome(usuario.nome);
    usuarioDadosCriacao.setIsSuperuser(usuario.isSuperuser);
    usuarioDadosCriacao.setIsAdmin(usuario.isAdmin);
    usuarioDadosCriacao.setIsActive(usuario.isActive);
    usuarioDadosCriacao.setIdIes(usuario.idIes);

    criacaoUserReq.setUsuario(usuarioDadosCriacao);
    criacaoUserReq.setPassword(usuario.idLattes);

    // if (usuario.password) criacaoUserReq.setPassword(usuario.password);

    const response = await new Promise((resolve, reject) => {
      stubUsuarios.criarUsuario(criacaoUserReq, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          try {
            const dadosObj = data.toObject();
            resolve(dadosObj);
          } catch (parseError) {
            reject(new Error("Failed to parse response data."));
          }
        }
      });
    });

    return response;
  } catch (e) {
    console.error("Error creating user:", e);
    throw new Error("Falha ao criar o usuário.");
  }
}


export async function atualizarUsuario(usuario: UserCriacao, novaSenha?: string): Promise<any> {
  try {
    const criacaoUserReq = new CriacaoUsuarioRequest();
    const usuarioDadosCriacao = new UsuarioDados();

    usuarioDadosCriacao.setIdLattes(usuario.idLattes);
    usuarioDadosCriacao.setEmail(usuario.email);
    usuarioDadosCriacao.setNome(usuario.nome);
    usuarioDadosCriacao.setIsSuperuser(usuario.isSuperuser);
    usuarioDadosCriacao.setIsAdmin(usuario.isAdmin);
    usuarioDadosCriacao.setIsActive(usuario.isActive);
    usuarioDadosCriacao.setIdIes(usuario.idIes);

    criacaoUserReq.setUsuario(usuarioDadosCriacao);
    if (novaSenha) {
      criacaoUserReq.setPassword(novaSenha);
    }
      // criacaoUserReq.setPassword("");

    const response = await new Promise((resolve, reject) => {
      stubUsuarios.atualizarUsuario(criacaoUserReq, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          try {
            const dadosObj = data.toObject();
            resolve(dadosObj);
          } catch (parseError) {
            reject(new Error("Failed to parse response data."));
          }
        }
      });
    });

    return response;
  } catch (e) {
    console.error("Error fetching user list:", e);
    throw new Error("Failed to fetch user list.");
  }
}

export async function obtemListaUniversidades(): Promise<any> {
  try {

    const request = new Empty();
    
    const response = await new Promise((resolve, reject) => {
      stubUsuarios.obtemListaUniversidades(request, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          try {
            const dadosObj = data.toObject()["itemList"];
            resolve(dadosObj)
          } catch (parseError) {
            reject(new Error("Failed to parse response data."));
          }
        }
      });
    });

    return response;
  } catch (e) {
    console.error("Error creating user:", e);
    throw new Error("Falha ao criar o usuário.");
  }
}

