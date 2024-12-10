// package: protos
// file: ppg.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as ppg_pb from "./ppg_pb";
import * as messages_pb from "./messages_pb";

interface IIndicadoresService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    obtemIndicadores: IIndicadoresService_IObtemIndicadores;
}

interface IIndicadoresService_IObtemIndicadores extends grpc.MethodDefinition<messages_pb.PpgRequest, messages_pb.PpgResponse> {
    path: "/protos.Indicadores/ObtemIndicadores";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PpgRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PpgRequest>;
    responseSerialize: grpc.serialize<messages_pb.PpgResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PpgResponse>;
}

export const IndicadoresService: IIndicadoresService;

export interface IIndicadoresServer extends grpc.UntypedServiceImplementation {
    obtemIndicadores: grpc.handleUnaryCall<messages_pb.PpgRequest, messages_pb.PpgResponse>;
}

export interface IIndicadoresClient {
    obtemIndicadores(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemIndicadores(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemIndicadores(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
}

export class IndicadoresClient extends grpc.Client implements IIndicadoresClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public obtemIndicadores(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemIndicadores(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemIndicadores(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
}
