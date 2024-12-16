import {
  PPGClient,
  HomeClient,
} from "@/protos/ppg_grpc_pb";
import * as grpc from "@grpc/grpc-js";

export const stubPPG = new PPGClient(
  "localhost:50052", //checar porta do grpc
  grpc.credentials.createInsecure(),
);

export const stubHome = new HomeClient(
  "localhost:50052", //checar porta do grpc
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

