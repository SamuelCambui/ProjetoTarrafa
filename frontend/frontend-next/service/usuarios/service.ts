"use server";
import { LoginRequest, LoginResponse } from "@/protos/messages_pb";
import { stubUsuarios } from "./utils";

export async function autenticarUsuario(email: string, senha: string) {
  try {
    const usuarioRequest = new LoginRequest();
    usuarioRequest.setUsername(email);
    usuarioRequest.setPassword(senha);

    const response = await new Promise<LoginResponse.AsObject>(
      (resolve, reject) => {
        stubUsuarios.login(usuarioRequest, (error, usuario) => {
          if (error) {
            reject(error); // Rejeita a promise em caso de erro
          } else {
            const data = usuario.toObject();

            resolve(data); // Resolve a promise com os indicadores
          }
        });
      }
    );
    return response;
  } catch (e) {
    console.error(e);
    return new Error();
  }
}
