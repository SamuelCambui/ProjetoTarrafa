import {
  DadosPosGraduacaoLSClient,
  IndicadoresPosGraduacaoLSClient,
  DadosFormularioPosGraduacaoLSClient,
} from "@/protos/ppgls_grpc_pb.d";
import * as grpc from "@grpc/grpc-js";

export const stubIndicadoresPPGLS = new IndicadoresPosGraduacaoLSClient(
  "localhost:50054",
  grpc.credentials.createInsecure(),
);

export const stubDadosPPGLS = new DadosPosGraduacaoLSClient(
  "localhost:50054",
  grpc.credentials.createInsecure(),
);

export const stubFormularioPPGLS = new DadosFormularioPosGraduacaoLSClient(
  "localhost:50054",
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
