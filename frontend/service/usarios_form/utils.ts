import * as grpc from "@grpc/grpc-js";
import { UsuarioClient } from "@/protos/usuarios_grpc_pb";

// Criar o cliente gRPC
export const stubUsuarios = new UsuarioClient(
  "localhost:50055",
  grpc.credentials.createInsecure()
);

// Função para verificar a conexão com o servidor
export function verificarConexaoGRPC(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    stubUsuarios.waitForReady(Date.now() + 5000, (err) => {
      if (err) {
        console.error("❌ Erro ao conectar ao servidor gRPC:", err.message);
        reject(false);
      } else {
        console.log("✅ Conexão com o servidor gRPC estabelecida.");
        resolve(true);
      }
    });
  });
}

// Executa a verificação ao iniciar
verificarConexaoGRPC().catch(() => {
  console.error("⚠️ O cliente gRPC não conseguiu se conectar ao servidor.");
});
