// package: protos
// file: ppgls.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as ppgls_pb from "./ppgls_pb";
import * as messages_pb from "./messages_pb";

interface IIndicadoresPosGraduacaoLSService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getAbaIndicadoresCurso: IIndicadoresPosGraduacaoLSService_IGetAbaIndicadoresCurso;
    getAbaDisciplinas: IIndicadoresPosGraduacaoLSService_IGetAbaDisciplinas;
    getAbaRegressos: IIndicadoresPosGraduacaoLSService_IGetAbaRegressos;
    getAbaProfessores: IIndicadoresPosGraduacaoLSService_IGetAbaProfessores;
    getIndicadoresDisciplina: IIndicadoresPosGraduacaoLSService_IGetIndicadoresDisciplina;
    getIndicadoresGlobais: IIndicadoresPosGraduacaoLSService_IGetIndicadoresGlobais;
}

interface IIndicadoresPosGraduacaoLSService_IGetAbaIndicadoresCurso extends grpc.MethodDefinition<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse> {
    path: "/protos.IndicadoresPosGraduacaoLS/GetAbaIndicadoresCurso";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.PPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PPGLSResponse>;
}
interface IIndicadoresPosGraduacaoLSService_IGetAbaDisciplinas extends grpc.MethodDefinition<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse> {
    path: "/protos.IndicadoresPosGraduacaoLS/GetAbaDisciplinas";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.PPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PPGLSResponse>;
}
interface IIndicadoresPosGraduacaoLSService_IGetAbaRegressos extends grpc.MethodDefinition<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse> {
    path: "/protos.IndicadoresPosGraduacaoLS/GetAbaRegressos";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.PPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PPGLSResponse>;
}
interface IIndicadoresPosGraduacaoLSService_IGetAbaProfessores extends grpc.MethodDefinition<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse> {
    path: "/protos.IndicadoresPosGraduacaoLS/GetAbaProfessores";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.PPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PPGLSResponse>;
}
interface IIndicadoresPosGraduacaoLSService_IGetIndicadoresDisciplina extends grpc.MethodDefinition<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse> {
    path: "/protos.IndicadoresPosGraduacaoLS/GetIndicadoresDisciplina";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.PPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PPGLSResponse>;
}
interface IIndicadoresPosGraduacaoLSService_IGetIndicadoresGlobais extends grpc.MethodDefinition<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse> {
    path: "/protos.IndicadoresPosGraduacaoLS/GetIndicadoresGlobais";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.PPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PPGLSResponse>;
}

export const IndicadoresPosGraduacaoLSService: IIndicadoresPosGraduacaoLSService;

export interface IIndicadoresPosGraduacaoLSServer extends grpc.UntypedServiceImplementation {
    getAbaIndicadoresCurso: grpc.handleUnaryCall<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse>;
    getAbaDisciplinas: grpc.handleUnaryCall<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse>;
    getAbaRegressos: grpc.handleUnaryCall<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse>;
    getAbaProfessores: grpc.handleUnaryCall<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse>;
    getIndicadoresDisciplina: grpc.handleUnaryCall<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse>;
    getIndicadoresGlobais: grpc.handleUnaryCall<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse>;
}

export interface IIndicadoresPosGraduacaoLSClient {
    getAbaIndicadoresCurso(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getAbaIndicadoresCurso(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getAbaIndicadoresCurso(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getAbaDisciplinas(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getAbaDisciplinas(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getAbaDisciplinas(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getAbaRegressos(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getAbaRegressos(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getAbaRegressos(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getAbaProfessores(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getAbaProfessores(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getAbaProfessores(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresDisciplina(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresDisciplina(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresDisciplina(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresGlobais(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresGlobais(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresGlobais(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
}

export class IndicadoresPosGraduacaoLSClient extends grpc.Client implements IIndicadoresPosGraduacaoLSClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getAbaIndicadoresCurso(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getAbaIndicadoresCurso(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getAbaIndicadoresCurso(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getAbaDisciplinas(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getAbaDisciplinas(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getAbaDisciplinas(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getAbaRegressos(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getAbaRegressos(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getAbaRegressos(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getAbaProfessores(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getAbaProfessores(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getAbaProfessores(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresDisciplina(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresDisciplina(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresDisciplina(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresGlobais(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresGlobais(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresGlobais(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
}

interface IDadosFormularioPosGraduacaoLSService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getIndicadoresFormulario: IDadosFormularioPosGraduacaoLSService_IGetIndicadoresFormulario;
    searchRegistrosFormualario: IDadosFormularioPosGraduacaoLSService_ISearchRegistrosFormualario;
    insertFormulario: IDadosFormularioPosGraduacaoLSService_IInsertFormulario;
    updateFormulario: IDadosFormularioPosGraduacaoLSService_IUpdateFormulario;
    deleteFormulario: IDadosFormularioPosGraduacaoLSService_IDeleteFormulario;
}

interface IDadosFormularioPosGraduacaoLSService_IGetIndicadoresFormulario extends grpc.MethodDefinition<messages_pb.FormularioIndicadoresRequest, messages_pb.FormularioPPGLSResponse> {
    path: "/protos.DadosFormularioPosGraduacaoLS/GetIndicadoresFormulario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.FormularioIndicadoresRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.FormularioIndicadoresRequest>;
    responseSerialize: grpc.serialize<messages_pb.FormularioPPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.FormularioPPGLSResponse>;
}
interface IDadosFormularioPosGraduacaoLSService_ISearchRegistrosFormualario extends grpc.MethodDefinition<messages_pb.FormularioSerchPPGLSRequest, messages_pb.FormularioPPGLSResponse> {
    path: "/protos.DadosFormularioPosGraduacaoLS/SearchRegistrosFormualario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.FormularioSerchPPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.FormularioSerchPPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.FormularioPPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.FormularioPPGLSResponse>;
}
interface IDadosFormularioPosGraduacaoLSService_IInsertFormulario extends grpc.MethodDefinition<messages_pb.FormularioPPGLSRequest, messages_pb.FormularioPPGLSResponse> {
    path: "/protos.DadosFormularioPosGraduacaoLS/InsertFormulario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.FormularioPPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.FormularioPPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.FormularioPPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.FormularioPPGLSResponse>;
}
interface IDadosFormularioPosGraduacaoLSService_IUpdateFormulario extends grpc.MethodDefinition<messages_pb.FormularioPPGLSRequest, messages_pb.FormularioPPGLSResponse> {
    path: "/protos.DadosFormularioPosGraduacaoLS/UpdateFormulario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.FormularioPPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.FormularioPPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.FormularioPPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.FormularioPPGLSResponse>;
}
interface IDadosFormularioPosGraduacaoLSService_IDeleteFormulario extends grpc.MethodDefinition<messages_pb.FormularioIndicadoresRequest, messages_pb.FormularioPPGLSResponse> {
    path: "/protos.DadosFormularioPosGraduacaoLS/DeleteFormulario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.FormularioIndicadoresRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.FormularioIndicadoresRequest>;
    responseSerialize: grpc.serialize<messages_pb.FormularioPPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.FormularioPPGLSResponse>;
}

export const DadosFormularioPosGraduacaoLSService: IDadosFormularioPosGraduacaoLSService;

export interface IDadosFormularioPosGraduacaoLSServer extends grpc.UntypedServiceImplementation {
    getIndicadoresFormulario: grpc.handleUnaryCall<messages_pb.FormularioIndicadoresRequest, messages_pb.FormularioPPGLSResponse>;
    searchRegistrosFormualario: grpc.handleUnaryCall<messages_pb.FormularioSerchPPGLSRequest, messages_pb.FormularioPPGLSResponse>;
    insertFormulario: grpc.handleUnaryCall<messages_pb.FormularioPPGLSRequest, messages_pb.FormularioPPGLSResponse>;
    updateFormulario: grpc.handleUnaryCall<messages_pb.FormularioPPGLSRequest, messages_pb.FormularioPPGLSResponse>;
    deleteFormulario: grpc.handleUnaryCall<messages_pb.FormularioIndicadoresRequest, messages_pb.FormularioPPGLSResponse>;
}

export interface IDadosFormularioPosGraduacaoLSClient {
    getIndicadoresFormulario(request: messages_pb.FormularioIndicadoresRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresFormulario(request: messages_pb.FormularioIndicadoresRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    getIndicadoresFormulario(request: messages_pb.FormularioIndicadoresRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    searchRegistrosFormualario(request: messages_pb.FormularioSerchPPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    searchRegistrosFormualario(request: messages_pb.FormularioSerchPPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    searchRegistrosFormualario(request: messages_pb.FormularioSerchPPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    insertFormulario(request: messages_pb.FormularioPPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    insertFormulario(request: messages_pb.FormularioPPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    insertFormulario(request: messages_pb.FormularioPPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    updateFormulario(request: messages_pb.FormularioPPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    updateFormulario(request: messages_pb.FormularioPPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    updateFormulario(request: messages_pb.FormularioPPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    deleteFormulario(request: messages_pb.FormularioIndicadoresRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    deleteFormulario(request: messages_pb.FormularioIndicadoresRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    deleteFormulario(request: messages_pb.FormularioIndicadoresRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
}

export class DadosFormularioPosGraduacaoLSClient extends grpc.Client implements IDadosFormularioPosGraduacaoLSClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getIndicadoresFormulario(request: messages_pb.FormularioIndicadoresRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresFormulario(request: messages_pb.FormularioIndicadoresRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public getIndicadoresFormulario(request: messages_pb.FormularioIndicadoresRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public searchRegistrosFormualario(request: messages_pb.FormularioSerchPPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public searchRegistrosFormualario(request: messages_pb.FormularioSerchPPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public searchRegistrosFormualario(request: messages_pb.FormularioSerchPPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public insertFormulario(request: messages_pb.FormularioPPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public insertFormulario(request: messages_pb.FormularioPPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public insertFormulario(request: messages_pb.FormularioPPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public updateFormulario(request: messages_pb.FormularioPPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public updateFormulario(request: messages_pb.FormularioPPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public updateFormulario(request: messages_pb.FormularioPPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public deleteFormulario(request: messages_pb.FormularioIndicadoresRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public deleteFormulario(request: messages_pb.FormularioIndicadoresRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
    public deleteFormulario(request: messages_pb.FormularioIndicadoresRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.FormularioPPGLSResponse) => void): grpc.ClientUnaryCall;
}

interface IDadosPosGraduacaoLSService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getCursos: IDadosPosGraduacaoLSService_IGetCursos;
    getCurso: IDadosPosGraduacaoLSService_IGetCurso;
    getDisciplinas: IDadosPosGraduacaoLSService_IGetDisciplinas;
    getDisciplina: IDadosPosGraduacaoLSService_IGetDisciplina;
}

interface IDadosPosGraduacaoLSService_IGetCursos extends grpc.MethodDefinition<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse> {
    path: "/protos.DadosPosGraduacaoLS/GetCursos";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.PPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PPGLSResponse>;
}
interface IDadosPosGraduacaoLSService_IGetCurso extends grpc.MethodDefinition<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse> {
    path: "/protos.DadosPosGraduacaoLS/GetCurso";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.PPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PPGLSResponse>;
}
interface IDadosPosGraduacaoLSService_IGetDisciplinas extends grpc.MethodDefinition<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse> {
    path: "/protos.DadosPosGraduacaoLS/GetDisciplinas";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.PPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PPGLSResponse>;
}
interface IDadosPosGraduacaoLSService_IGetDisciplina extends grpc.MethodDefinition<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse> {
    path: "/protos.DadosPosGraduacaoLS/GetDisciplina";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.PPGLSRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.PPGLSRequest>;
    responseSerialize: grpc.serialize<messages_pb.PPGLSResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.PPGLSResponse>;
}

export const DadosPosGraduacaoLSService: IDadosPosGraduacaoLSService;

export interface IDadosPosGraduacaoLSServer extends grpc.UntypedServiceImplementation {
    getCursos: grpc.handleUnaryCall<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse>;
    getCurso: grpc.handleUnaryCall<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse>;
    getDisciplinas: grpc.handleUnaryCall<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse>;
    getDisciplina: grpc.handleUnaryCall<messages_pb.PPGLSRequest, messages_pb.PPGLSResponse>;
}

export interface IDadosPosGraduacaoLSClient {
    getCursos(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getCursos(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getCursos(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getCurso(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getCurso(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getCurso(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getDisciplinas(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getDisciplinas(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getDisciplinas(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getDisciplina(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getDisciplina(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    getDisciplina(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
}

export class DadosPosGraduacaoLSClient extends grpc.Client implements IDadosPosGraduacaoLSClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getCursos(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getCursos(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getCursos(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getCurso(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getCurso(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getCurso(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getDisciplinas(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getDisciplinas(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getDisciplinas(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getDisciplina(request: messages_pb.PPGLSRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getDisciplina(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
    public getDisciplina(request: messages_pb.PPGLSRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.PPGLSResponse) => void): grpc.ClientUnaryCall;
}
