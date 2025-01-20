import { HomeClient, PPGClient} from "@/protos/ppg_grpc_pb"
import * as grpc from "@grpc/grpc-js";

export const stubHome = new HomeClient(
  "localhost:50052",
  grpc.credentials.createInsecure(),
);

export const stubPPG = new PPGClient(
  "localhost:50052",
  grpc.credentials.createInsecure(),
);
