"server-only";
import {
  DadosPosGraduacaoLSClient,
  IndicadoresPosGraduacaoLSClient,
  DadosFormularioPosGraduacaoLSClient,
} from "@/protos/ppgls_grpc_pb";
import * as grpc from "@grpc/grpc-js";

const SERVER_PPGLS = process.env.SERVER_PPGLS!

export const stubIndicadoresPPGLS = new IndicadoresPosGraduacaoLSClient(
  SERVER_PPGLS,
  grpc.credentials.createInsecure(),
);

export const stubDadosPPGLS = new DadosPosGraduacaoLSClient(
  SERVER_PPGLS,
  grpc.credentials.createInsecure(),
);

export const stubFormularioPPGLS = new DadosFormularioPosGraduacaoLSClient(
  SERVER_PPGLS,
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
