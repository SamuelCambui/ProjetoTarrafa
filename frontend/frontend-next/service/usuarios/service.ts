"use server";
import { LoginRequest, LoginResponse } from "@/protos/messages_pb";
import { stubUsuarios, verificarConexaoGRPC } from "./utils";

export async function autenticarUsuario(email: string, senha: string) {
  try {
    // Verifica a conexão com o servidor gRPC antes de prosseguir
    await verificarConexaoGRPC();

    const usuarioRequest = new LoginRequest();
    usuarioRequest.setUsername(email);
    usuarioRequest.setPassword(senha);

    const response = await new Promise<LoginResponse.AsObject>(
      (resolve, reject) => {
        stubUsuarios.login(usuarioRequest, (error, usuario) => {
          if (error) {
            console.error("Erro na comunicação gRPC:", error);
            reject(new Error("Falha na autenticação. Verifique seus dados."));
          } else {
            const usuarioObj = usuario?.toObject ? usuario.toObject() : null;
            if (!usuarioObj) {
              reject(new Error("Resposta inválida do servidor gRPC"));
            }
            resolve(usuarioObj);
          }
        });
      }
    );

    return JSON.parse(JSON.stringify(response)); // 🔹 Garante que é um objeto simples
  } catch (e) {
    console.error("🚨 Erro inesperado na autenticação:", e);
    return new Error("Erro ao tentar autenticar");
  }
}
