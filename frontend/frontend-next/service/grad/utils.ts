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
