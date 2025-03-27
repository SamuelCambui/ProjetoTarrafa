import {
  PPGClient,
  HomeClient,
} from "@/protos/ppg_grpc_pb";
import { UsuarioClient } from "@/protos/usuarios_grpc_pb";
import * as grpc from "@grpc/grpc-js";
export const stubPPG = new PPGClient(
  process.env.SERVER_PPG!,
  grpc.credentials.createInsecure(),
);

export const stubHome = new HomeClient(
  process.env.SERVER_PPG!,
  grpc.credentials.createInsecure(),
);

export const stubUsuarios = new UsuarioClient(
  process.env.SERVER_USUARIOS!,
  grpc.credentials.createInsecure(),
);

export interface ApiResponse {
  [key: string]: any;
}

export const toApiResponse = (data: any): ApiResponse => {
  let response: ApiResponse = {};
  
  for (let i = 0; i < data.length; i++) {
    try {
      response[data[i].nome ?? ""] = JSON.parse(data[i].json);
    } catch {
      response[data[i].nome ?? ""] = JSON.parse("{}");
    }
  }
  return response;
};

export const toApiResponseUsers = (data: any): any[] => {
  let response: any[] = [];
  for (let i = 0; i < data.length; i++) {
    const usuario = data[i].usuario;
    if (usuario) {
      response.push(usuario); // Directly push the user object to the array
    }
  }
  return response;
};