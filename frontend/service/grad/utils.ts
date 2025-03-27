import {
  DadosGraduacaoClient,
  IndicadoresGraduacaoClient,
} from "@/protos/grad_grpc_pb";
import * as grpc from "@grpc/grpc-js";

export const stubIndicadores = new IndicadoresGraduacaoClient(
  process.env.SERVER_GRAD!,
  grpc.credentials.createInsecure(),
);

export const stubDados = new DadosGraduacaoClient(
  process.env.SERVER_GRAD!,
  grpc.credentials.createInsecure(),
);
