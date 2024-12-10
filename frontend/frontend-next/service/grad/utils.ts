import {
  DadosGraduacaoClient,
  IndicadoresGraduacaoClient,
} from "@/protos/grad_grpc_pb";
import * as grpc from "@grpc/grpc-js";

export const stubIndicadores = new IndicadoresGraduacaoClient(
  "localhost:50053",
  grpc.credentials.createInsecure(),
);

export const stubDados = new DadosGraduacaoClient(
  "localhost:50053",
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
