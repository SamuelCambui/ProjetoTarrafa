import { PPGClient, HomeClient } from "@/protos/ppg_grpc_pb";
import * as grpc from "@grpc/grpc-js";

export const stubPPG = new PPGClient(
  "localhost:50052", //checar porta do grpc
  grpc.credentials.createInsecure(),
);

export const stubHome = new HomeClient(
  "localhost:50052", //checar porta do grpc
  grpc.credentials.createInsecure(),
);
