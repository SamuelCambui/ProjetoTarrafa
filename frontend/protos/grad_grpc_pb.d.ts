// package: protos
// file: grad.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as grad_pb from "./grad_pb";
import * as messages_pb from "./messages_pb";

interface IIndicadoresGraduacaoService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getAbaIndicadoresCurso: IIndicadoresGraduacaoService_IGetAbaIndicadoresCurso;
    getAbaDisciplinas: IIndicadoresGraduacaoService_IGetAbaDisciplinas;
    getAbaEgressos: IIndicadoresGraduacaoService_IGetAbaEgressos;
    getAbaProfessores: IIndicadoresGraduacaoService_IGetAbaProfessores;
    getIndicadoresDisciplina: IIndicadoresGraduacaoService_IGetIndicadoresDisciplina;
    getIndicadoresGlobais: IIndicadoresGraduacaoService_IGetIndicadoresGlobais;
}

interface IIndicadoresGraduacaoService_IGetAbaIndicadoresCurso extends grpc.MethodDefinition<messages_pb.GradRequest, messages_pb.GradResponse> {
    path: "/protos.IndicadoresGraduacao/GetAbaIndicadoresCurso";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.GradRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.GradRequest>;
    responseSerialize: grpc.serialize<messages_pb.GradResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.GradResponse>;
}
interface IIndicadoresGraduacaoService_IGetAbaDisciplinas extends grpc.MethodDefinition<messages_pb.GradDisciplinasRequest, messages_pb.GradResponse> {
    path: "/protos.IndicadoresGraduacao/GetAbaDisciplinas";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.GradDisciplinasRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.GradDisciplinasRequest>;
    responseSerialize: grpc.serialize<messages_pb.GradResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.GradResponse>;
}
interface IIndicadoresGraduacaoService_IGetAbaEgressos extends grpc.MethodDefinition<messages_pb.GradRequest, messages_pb.GradResponse> {
    path: "/protos.IndicadoresGraduacao/GetAbaEgressos";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.GradRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.GradRequest>;
    responseSerialize: grpc.serialize<messages_pb.GradResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.GradResponse>;
}
interface IIndicadoresGraduacaoService_IGetAbaProfessores extends grpc.MethodDefinition<messages_pb.GradRequest, messages_pb.GradResponse> {
    path: "/protos.IndicadoresGraduacao/GetAbaProfessores";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.GradRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.GradRequest>;
    responseSerialize: grpc.serialize<messages_pb.GradResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.GradResponse>;
}
interface IIndicadoresGraduacaoService_IGetIndicadoresDisciplina extends grpc.MethodDefinition<messages_pb.GradDisciplinasRequest, messages_pb.GradResponse> {
    path: "/protos.IndicadoresGraduacao/GetIndicadoresDisciplina";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.GradDisciplinasRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.GradDisciplinasRequest>;
    responseSerialize: grpc.serialize<messages_pb.GradResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.GradResponse>;
}
interface IIndicadoresGraduacaoService_IGetIndicadoresGlobais extends grpc.MethodDefinition<messages_pb.GradRequest, messages_pb.GradResponse> {
    path: "/protos.IndicadoresGraduacao/GetIndicadoresGlobais";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.GradRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.GradRequest>;
    responseSerialize: grpc.serialize<messages_pb.GradResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.GradResponse>;
}

export const IndicadoresGraduacaoService: IIndicadoresGraduacaoService;

export interface IIndicadoresGraduacaoServer extends grpc.UntypedServiceImplementation {
    getAbaIndicadoresCurso: grpc.handleUnaryCall<messages_pb.GradRequest, messages_pb.GradResponse>;
    getAbaDisciplinas: grpc.handleUnaryCall<messages_pb.GradDisciplinasRequest, messages_pb.GradResponse>;
    getAbaEgressos: grpc.handleUnaryCall<messages_pb.GradRequest, messages_pb.GradResponse>;
    getAbaProfessores: grpc.handleUnaryCall<messages_pb.GradRequest, messages_pb.GradResponse>;
    getIndicadoresDisciplina: grpc.handleUnaryCall<messages_pb.GradDisciplinasRequest, messages_pb.GradResponse>;
    getIndicadoresGlobais: grpc.handleUnaryCall<messages_pb.GradRequest, messages_pb.GradResponse>;
}

export interface IIndicadoresGraduacaoClient {
    getAbaIndicadoresCurso(request: messages_pb.GradRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getAbaIndicadoresCurso(request: messages_pb.GradRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getAbaIndicadoresCurso(request: messages_pb.GradRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getAbaDisciplinas(request: messages_pb.GradDisciplinasRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getAbaDisciplinas(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getAbaDisciplinas(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getAbaEgressos(request: messages_pb.GradRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getAbaEgressos(request: messages_pb.GradRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getAbaEgressos(request: messages_pb.GradRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getAbaProfessores(request: messages_pb.GradRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getAbaProfessores(request: messages_pb.GradRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getAbaProfessores(request: messages_pb.GradRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresDisciplina(request: messages_pb.GradDisciplinasRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresDisciplina(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresDisciplina(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresGlobais(request: messages_pb.GradRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresGlobais(request: messages_pb.GradRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresGlobais(request: messages_pb.GradRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
}

export class IndicadoresGraduacaoClient extends grpc.Client implements IIndicadoresGraduacaoClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getAbaIndicadoresCurso(request: messages_pb.GradRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getAbaIndicadoresCurso(request: messages_pb.GradRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getAbaIndicadoresCurso(request: messages_pb.GradRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getAbaDisciplinas(request: messages_pb.GradDisciplinasRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getAbaDisciplinas(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getAbaDisciplinas(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getAbaEgressos(request: messages_pb.GradRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getAbaEgressos(request: messages_pb.GradRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getAbaEgressos(request: messages_pb.GradRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getAbaProfessores(request: messages_pb.GradRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getAbaProfessores(request: messages_pb.GradRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getAbaProfessores(request: messages_pb.GradRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresDisciplina(request: messages_pb.GradDisciplinasRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresDisciplina(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresDisciplina(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresGlobais(request: messages_pb.GradRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresGlobais(request: messages_pb.GradRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresGlobais(request: messages_pb.GradRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
}

interface IDadosGraduacaoService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getCursos: IDadosGraduacaoService_IGetCursos;
    getCurso: IDadosGraduacaoService_IGetCurso;
    getDisciplinas: IDadosGraduacaoService_IGetDisciplinas;
    getDisciplina: IDadosGraduacaoService_IGetDisciplina;
}

interface IDadosGraduacaoService_IGetCursos extends grpc.MethodDefinition<messages_pb.GradRequest, messages_pb.GradResponse> {
    path: "/protos.DadosGraduacao/GetCursos";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.GradRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.GradRequest>;
    responseSerialize: grpc.serialize<messages_pb.GradResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.GradResponse>;
}
interface IDadosGraduacaoService_IGetCurso extends grpc.MethodDefinition<messages_pb.GradRequest, messages_pb.GradResponse> {
    path: "/protos.DadosGraduacao/GetCurso";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.GradRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.GradRequest>;
    responseSerialize: grpc.serialize<messages_pb.GradResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.GradResponse>;
}
interface IDadosGraduacaoService_IGetDisciplinas extends grpc.MethodDefinition<messages_pb.GradDisciplinasRequest, messages_pb.GradResponse> {
    path: "/protos.DadosGraduacao/GetDisciplinas";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.GradDisciplinasRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.GradDisciplinasRequest>;
    responseSerialize: grpc.serialize<messages_pb.GradResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.GradResponse>;
}
interface IDadosGraduacaoService_IGetDisciplina extends grpc.MethodDefinition<messages_pb.GradDisciplinasRequest, messages_pb.GradResponse> {
    path: "/protos.DadosGraduacao/GetDisciplina";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.GradDisciplinasRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.GradDisciplinasRequest>;
    responseSerialize: grpc.serialize<messages_pb.GradResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.GradResponse>;
}

export const DadosGraduacaoService: IDadosGraduacaoService;

export interface IDadosGraduacaoServer extends grpc.UntypedServiceImplementation {
    getCursos: grpc.handleUnaryCall<messages_pb.GradRequest, messages_pb.GradResponse>;
    getCurso: grpc.handleUnaryCall<messages_pb.GradRequest, messages_pb.GradResponse>;
    getDisciplinas: grpc.handleUnaryCall<messages_pb.GradDisciplinasRequest, messages_pb.GradResponse>;
    getDisciplina: grpc.handleUnaryCall<messages_pb.GradDisciplinasRequest, messages_pb.GradResponse>;
}

export interface IDadosGraduacaoClient {
    getCursos(request: messages_pb.GradRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getCursos(request: messages_pb.GradRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getCursos(request: messages_pb.GradRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getCurso(request: messages_pb.GradRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getCurso(request: messages_pb.GradRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getCurso(request: messages_pb.GradRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getDisciplinas(request: messages_pb.GradDisciplinasRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getDisciplinas(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getDisciplinas(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getDisciplina(request: messages_pb.GradDisciplinasRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getDisciplina(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    getDisciplina(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
}

export class DadosGraduacaoClient extends grpc.Client implements IDadosGraduacaoClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getCursos(request: messages_pb.GradRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getCursos(request: messages_pb.GradRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getCursos(request: messages_pb.GradRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getCurso(request: messages_pb.GradRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getCurso(request: messages_pb.GradRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getCurso(request: messages_pb.GradRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getDisciplinas(request: messages_pb.GradDisciplinasRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getDisciplinas(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getDisciplinas(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getDisciplina(request: messages_pb.GradDisciplinasRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getDisciplina(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
    public getDisciplina(request: messages_pb.GradDisciplinasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.GradResponse) => void): grpc.ClientUnaryCall;
}
