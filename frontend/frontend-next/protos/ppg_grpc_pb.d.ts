// package: protos
// file: ppg.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as ppg_pb from "./ppg_pb";
import * as messages_pb from "./messages_pb";

interface IPPGService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    obtemInformacaoPPG: IPPGService_IObtemInformacaoPPG;
    obtemIndicadores: IPPGService_IObtemIndicadores;
    obtemBancas: IPPGService_IObtemBancas;
    obtemDocentes: IPPGService_IObtemDocentes;
    obtemEgressos: IPPGService_IObtemEgressos;
    obtemProjetos: IPPGService_IObtemProjetos;
}

interface IPPGService_IObtemInformacaoPPG extends grpc.MethodDefinition<messages_pb.PpgRequest, messages_pb.PpgResponse> {
    path: "/protos.PPG/ObtemInformacaoPPG";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PpgRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PpgRequest>;
    responseSerialize: grpc.serialize<messages_pb.PpgResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PpgResponse>;
}
interface IPPGService_IObtemIndicadores extends grpc.MethodDefinition<messages_pb.PpgRequest, messages_pb.PpgResponse> {
    path: "/protos.PPG/ObtemIndicadores";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PpgRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PpgRequest>;
    responseSerialize: grpc.serialize<messages_pb.PpgResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PpgResponse>;
}
interface IPPGService_IObtemBancas extends grpc.MethodDefinition<messages_pb.PpgRequest, messages_pb.PpgResponse> {
    path: "/protos.PPG/ObtemBancas";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PpgRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PpgRequest>;
    responseSerialize: grpc.serialize<messages_pb.PpgResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PpgResponse>;
}
interface IPPGService_IObtemDocentes extends grpc.MethodDefinition<messages_pb.PpgRequest, messages_pb.PpgResponse> {
    path: "/protos.PPG/ObtemDocentes";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PpgRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PpgRequest>;
    responseSerialize: grpc.serialize<messages_pb.PpgResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PpgResponse>;
}
interface IPPGService_IObtemEgressos extends grpc.MethodDefinition<messages_pb.PpgRequest, messages_pb.PpgResponse> {
    path: "/protos.PPG/ObtemEgressos";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PpgRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PpgRequest>;
    responseSerialize: grpc.serialize<messages_pb.PpgResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PpgResponse>;
}
interface IPPGService_IObtemProjetos extends grpc.MethodDefinition<messages_pb.PpgRequest, messages_pb.PpgResponse> {
    path: "/protos.PPG/ObtemProjetos";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PpgRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PpgRequest>;
    responseSerialize: grpc.serialize<messages_pb.PpgResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PpgResponse>;
}

export const PPGService: IPPGService;

export interface IPPGServer extends grpc.UntypedServiceImplementation {
    obtemInformacaoPPG: grpc.handleUnaryCall<messages_pb.PpgRequest, messages_pb.PpgResponse>;
    obtemIndicadores: grpc.handleUnaryCall<messages_pb.PpgRequest, messages_pb.PpgResponse>;
    obtemBancas: grpc.handleUnaryCall<messages_pb.PpgRequest, messages_pb.PpgResponse>;
    obtemDocentes: grpc.handleUnaryCall<messages_pb.PpgRequest, messages_pb.PpgResponse>;
    obtemEgressos: grpc.handleUnaryCall<messages_pb.PpgRequest, messages_pb.PpgResponse>;
    obtemProjetos: grpc.handleUnaryCall<messages_pb.PpgRequest, messages_pb.PpgResponse>;
}

export interface IPPGClient {
    obtemInformacaoPPG(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemInformacaoPPG(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemInformacaoPPG(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemIndicadores(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemIndicadores(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemIndicadores(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemBancas(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemBancas(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemBancas(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemDocentes(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemDocentes(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemDocentes(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemEgressos(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemEgressos(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemEgressos(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemProjetos(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemProjetos(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemProjetos(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
}

export class PPGClient extends grpc.Client implements IPPGClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public obtemInformacaoPPG(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemInformacaoPPG(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemInformacaoPPG(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemIndicadores(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemIndicadores(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemIndicadores(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemBancas(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemBancas(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemBancas(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemDocentes(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemDocentes(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemDocentes(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemEgressos(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemEgressos(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemEgressos(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemProjetos(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemProjetos(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemProjetos(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
}

interface IHomeService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    obtemHome: IHomeService_IObtemHome;
}

interface IHomeService_IObtemHome extends grpc.MethodDefinition<messages_pb.PpgRequest, messages_pb.PpgResponse> {
    path: "/protos.Home/ObtemHome";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PpgRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PpgRequest>;
    responseSerialize: grpc.serialize<messages_pb.PpgResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PpgResponse>;
}

export const HomeService: IHomeService;

export interface IHomeServer extends grpc.UntypedServiceImplementation {
    obtemHome: grpc.handleUnaryCall<messages_pb.PpgRequest, messages_pb.PpgResponse>;
}

export interface IHomeClient {
    obtemHome(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemHome(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    obtemHome(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
}

export class HomeClient extends grpc.Client implements IHomeClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public obtemHome(request: messages_pb.PpgRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemHome(request: messages_pb.PpgRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
    public obtemHome(request: messages_pb.PpgRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PpgResponse) => void): grpc.ClientUnaryCall;
}
