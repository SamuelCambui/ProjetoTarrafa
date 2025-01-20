import * as grpc from "@grpc/grpc-js";
import { UsuarioClient } from "@/protos/usuarios_grpc_pb";

export const stubUsuarios = new UsuarioClient(
  "localhost:50055",
  grpc.credentials.createInsecure()
);
