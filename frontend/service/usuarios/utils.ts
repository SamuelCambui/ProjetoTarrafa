import * as grpc from "@grpc/grpc-js";
import { UsuarioClient } from "@/protos/usuarios_grpc_pb";

export const stubUsuarios = new UsuarioClient(
  process.env.SERVER_USUARIOS!,
  grpc.credentials.createInsecure()
);
