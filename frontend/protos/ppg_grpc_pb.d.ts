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
    obtemProgramas: IHomeService_IObtemProgramas;
    obtemRedeColaboracao: IHomeService_IObtemRedeColaboracao;
    obtemRankingDocentes: IHomeService_IObtemRankingDocentes;
    obtemArtigosDocentes: IHomeService_IObtemArtigosDocentes;
}

interface IHomeService_IObtemProgramas extends grpc.MethodDefinition<messages_pb.HomeRequest, messages_pb.HomeResponse> {
    path: "/protos.Home/ObtemProgramas";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.HomeRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.HomeRequest>;
    responseSerialize: grpc.serialize<messages_pb.HomeResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.HomeResponse>;
}
interface IHomeService_IObtemRedeColaboracao extends grpc.MethodDefinition<messages_pb.HomeRequest, messages_pb.HomeResponse> {
    path: "/protos.Home/ObtemRedeColaboracao";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.HomeRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.HomeRequest>;
    responseSerialize: grpc.serialize<messages_pb.HomeResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.HomeResponse>;
}
interface IHomeService_IObtemRankingDocentes extends grpc.MethodDefinition<messages_pb.HomeRequest, messages_pb.HomeResponse> {
    path: "/protos.Home/ObtemRankingDocentes";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.HomeRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.HomeRequest>;
    responseSerialize: grpc.serialize<messages_pb.HomeResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.HomeResponse>;
}
interface IHomeService_IObtemArtigosDocentes extends grpc.MethodDefinition<messages_pb.HomeRequest, messages_pb.HomeResponse> {
    path: "/protos.Home/ObtemArtigosDocentes";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.HomeRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.HomeRequest>;
    responseSerialize: grpc.serialize<messages_pb.HomeResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.HomeResponse>;
}

export const HomeService: IHomeService;

export interface IHomeServer extends grpc.UntypedServiceImplementation {
    obtemProgramas: grpc.handleUnaryCall<messages_pb.HomeRequest, messages_pb.HomeResponse>;
    obtemRedeColaboracao: grpc.handleUnaryCall<messages_pb.HomeRequest, messages_pb.HomeResponse>;
    obtemRankingDocentes: grpc.handleUnaryCall<messages_pb.HomeRequest, messages_pb.HomeResponse>;
    obtemArtigosDocentes: grpc.handleUnaryCall<messages_pb.HomeRequest, messages_pb.HomeResponse>;
}

export interface IHomeClient {
    obtemProgramas(request: messages_pb.HomeRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    obtemProgramas(request: messages_pb.HomeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    obtemProgramas(request: messages_pb.HomeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    obtemRedeColaboracao(request: messages_pb.HomeRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    obtemRedeColaboracao(request: messages_pb.HomeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    obtemRedeColaboracao(request: messages_pb.HomeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    obtemRankingDocentes(request: messages_pb.HomeRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    obtemRankingDocentes(request: messages_pb.HomeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    obtemRankingDocentes(request: messages_pb.HomeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    obtemArtigosDocentes(request: messages_pb.HomeRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    obtemArtigosDocentes(request: messages_pb.HomeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    obtemArtigosDocentes(request: messages_pb.HomeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
}

export class HomeClient extends grpc.Client implements IHomeClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public obtemProgramas(request: messages_pb.HomeRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    public obtemProgramas(request: messages_pb.HomeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    public obtemProgramas(request: messages_pb.HomeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    public obtemRedeColaboracao(request: messages_pb.HomeRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    public obtemRedeColaboracao(request: messages_pb.HomeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    public obtemRedeColaboracao(request: messages_pb.HomeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    public obtemRankingDocentes(request: messages_pb.HomeRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    public obtemRankingDocentes(request: messages_pb.HomeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    public obtemRankingDocentes(request: messages_pb.HomeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    public obtemArtigosDocentes(request: messages_pb.HomeRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    public obtemArtigosDocentes(request: messages_pb.HomeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
    public obtemArtigosDocentes(request: messages_pb.HomeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.HomeResponse) => void): grpc.ClientUnaryCall;
}
