// package: protos
// file: usuarios.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as usuarios_pb from "./usuarios_pb";
import * as messages_pb from "./messages_pb";

interface IUsuarioService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    login: IUsuarioService_ILogin;
    logout: IUsuarioService_ILogout;
    obtemUsuario: IUsuarioService_IObtemUsuario;
    obtemListaUsuarios: IUsuarioService_IObtemListaUsuarios;
    deletarUsuario: IUsuarioService_IDeletarUsuario;
    alternarStatusUsuario: IUsuarioService_IAlternarStatusUsuario;
    atualizarUsuario: IUsuarioService_IAtualizarUsuario;
    criarUsuario: IUsuarioService_ICriarUsuario;
    obtemListaUniversidades: IUsuarioService_IObtemListaUniversidades;
}

interface IUsuarioService_ILogin extends grpc.MethodDefinition<messages_pb.LoginRequest, messages_pb.LoginResponse> {
    path: "/protos.Usuario/Login";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.LoginRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.LoginRequest>;
    responseSerialize: grpc.serialize<messages_pb.LoginResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.LoginResponse>;
}
interface IUsuarioService_ILogout extends grpc.MethodDefinition<messages_pb.LogoutRequest, messages_pb.LogoutResponse> {
    path: "/protos.Usuario/Logout";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.LogoutRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.LogoutRequest>;
    responseSerialize: grpc.serialize<messages_pb.LogoutResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.LogoutResponse>;
}
interface IUsuarioService_IObtemUsuario extends grpc.MethodDefinition<messages_pb.UsuarioRequest, messages_pb.UsuarioResponse> {
    path: "/protos.Usuario/ObtemUsuario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.UsuarioRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.UsuarioRequest>;
    responseSerialize: grpc.serialize<messages_pb.UsuarioResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.UsuarioResponse>;
}
interface IUsuarioService_IObtemListaUsuarios extends grpc.MethodDefinition<messages_pb.UsuarioResponse, messages_pb.ListaUsuariosResponse> {
    path: "/protos.Usuario/ObtemListaUsuarios";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.UsuarioResponse>;
    requestDeserialize: grpc.deserialize<messages_pb.UsuarioResponse>;
    responseSerialize: grpc.serialize<messages_pb.ListaUsuariosResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.ListaUsuariosResponse>;
}
interface IUsuarioService_IDeletarUsuario extends grpc.MethodDefinition<messages_pb.UsuarioRequest, messages_pb.AlteracaoUsuarioResponse> {
    path: "/protos.Usuario/DeletarUsuario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.UsuarioRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.UsuarioRequest>;
    responseSerialize: grpc.serialize<messages_pb.AlteracaoUsuarioResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.AlteracaoUsuarioResponse>;
}
interface IUsuarioService_IAlternarStatusUsuario extends grpc.MethodDefinition<messages_pb.UsuarioRequest, messages_pb.AlteracaoUsuarioResponse> {
    path: "/protos.Usuario/AlternarStatusUsuario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.UsuarioRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.UsuarioRequest>;
    responseSerialize: grpc.serialize<messages_pb.AlteracaoUsuarioResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.AlteracaoUsuarioResponse>;
}
interface IUsuarioService_IAtualizarUsuario extends grpc.MethodDefinition<messages_pb.CriacaoUsuarioRequest, messages_pb.AlteracaoUsuarioResponse> {
    path: "/protos.Usuario/AtualizarUsuario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.CriacaoUsuarioRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.CriacaoUsuarioRequest>;
    responseSerialize: grpc.serialize<messages_pb.AlteracaoUsuarioResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.AlteracaoUsuarioResponse>;
}
interface IUsuarioService_ICriarUsuario extends grpc.MethodDefinition<messages_pb.CriacaoUsuarioRequest, messages_pb.AlteracaoUsuarioResponse> {
    path: "/protos.Usuario/CriarUsuario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.CriacaoUsuarioRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.CriacaoUsuarioRequest>;
    responseSerialize: grpc.serialize<messages_pb.AlteracaoUsuarioResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.AlteracaoUsuarioResponse>;
}
interface IUsuarioService_IObtemListaUniversidades extends grpc.MethodDefinition<messages_pb.Empty, messages_pb.ListaUniversidadesResponse> {
    path: "/protos.Usuario/ObtemListaUniversidades";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.Empty>;
    requestDeserialize: grpc.deserialize<messages_pb.Empty>;
    responseSerialize: grpc.serialize<messages_pb.ListaUniversidadesResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.ListaUniversidadesResponse>;
}

export const UsuarioService: IUsuarioService;

export interface IUsuarioServer extends grpc.UntypedServiceImplementation {
    login: grpc.handleUnaryCall<messages_pb.LoginRequest, messages_pb.LoginResponse>;
    logout: grpc.handleUnaryCall<messages_pb.LogoutRequest, messages_pb.LogoutResponse>;
    obtemUsuario: grpc.handleUnaryCall<messages_pb.UsuarioRequest, messages_pb.UsuarioResponse>;
    obtemListaUsuarios: grpc.handleUnaryCall<messages_pb.UsuarioResponse, messages_pb.ListaUsuariosResponse>;
    deletarUsuario: grpc.handleUnaryCall<messages_pb.UsuarioRequest, messages_pb.AlteracaoUsuarioResponse>;
    alternarStatusUsuario: grpc.handleUnaryCall<messages_pb.UsuarioRequest, messages_pb.AlteracaoUsuarioResponse>;
    atualizarUsuario: grpc.handleUnaryCall<messages_pb.CriacaoUsuarioRequest, messages_pb.AlteracaoUsuarioResponse>;
    criarUsuario: grpc.handleUnaryCall<messages_pb.CriacaoUsuarioRequest, messages_pb.AlteracaoUsuarioResponse>;
    obtemListaUniversidades: grpc.handleUnaryCall<messages_pb.Empty, messages_pb.ListaUniversidadesResponse>;
}

export interface IUsuarioClient {
    login(request: messages_pb.LoginRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.LoginResponse) => void): grpc.ClientUnaryCall;
    login(request: messages_pb.LoginRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.LoginResponse) => void): grpc.ClientUnaryCall;
    login(request: messages_pb.LoginRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.LoginResponse) => void): grpc.ClientUnaryCall;
    logout(request: messages_pb.LogoutRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    logout(request: messages_pb.LogoutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    logout(request: messages_pb.LogoutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    obtemUsuario(request: messages_pb.UsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.UsuarioResponse) => void): grpc.ClientUnaryCall;
    obtemUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.UsuarioResponse) => void): grpc.ClientUnaryCall;
    obtemUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.UsuarioResponse) => void): grpc.ClientUnaryCall;
    obtemListaUsuarios(request: messages_pb.UsuarioResponse, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUsuariosResponse) => void): grpc.ClientUnaryCall;
    obtemListaUsuarios(request: messages_pb.UsuarioResponse, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUsuariosResponse) => void): grpc.ClientUnaryCall;
    obtemListaUsuarios(request: messages_pb.UsuarioResponse, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUsuariosResponse) => void): grpc.ClientUnaryCall;
    deletarUsuario(request: messages_pb.UsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    deletarUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    deletarUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    alternarStatusUsuario(request: messages_pb.UsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    alternarStatusUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    alternarStatusUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    atualizarUsuario(request: messages_pb.CriacaoUsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    atualizarUsuario(request: messages_pb.CriacaoUsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    atualizarUsuario(request: messages_pb.CriacaoUsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    criarUsuario(request: messages_pb.CriacaoUsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    criarUsuario(request: messages_pb.CriacaoUsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    criarUsuario(request: messages_pb.CriacaoUsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    obtemListaUniversidades(request: messages_pb.Empty, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUniversidadesResponse) => void): grpc.ClientUnaryCall;
    obtemListaUniversidades(request: messages_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUniversidadesResponse) => void): grpc.ClientUnaryCall;
    obtemListaUniversidades(request: messages_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUniversidadesResponse) => void): grpc.ClientUnaryCall;
}

export class UsuarioClient extends grpc.Client implements IUsuarioClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public login(request: messages_pb.LoginRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.LoginResponse) => void): grpc.ClientUnaryCall;
    public login(request: messages_pb.LoginRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.LoginResponse) => void): grpc.ClientUnaryCall;
    public login(request: messages_pb.LoginRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.LoginResponse) => void): grpc.ClientUnaryCall;
    public logout(request: messages_pb.LogoutRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    public logout(request: messages_pb.LogoutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    public logout(request: messages_pb.LogoutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    public obtemUsuario(request: messages_pb.UsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.UsuarioResponse) => void): grpc.ClientUnaryCall;
    public obtemUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.UsuarioResponse) => void): grpc.ClientUnaryCall;
    public obtemUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.UsuarioResponse) => void): grpc.ClientUnaryCall;
    public obtemListaUsuarios(request: messages_pb.UsuarioResponse, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUsuariosResponse) => void): grpc.ClientUnaryCall;
    public obtemListaUsuarios(request: messages_pb.UsuarioResponse, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUsuariosResponse) => void): grpc.ClientUnaryCall;
    public obtemListaUsuarios(request: messages_pb.UsuarioResponse, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUsuariosResponse) => void): grpc.ClientUnaryCall;
    public deletarUsuario(request: messages_pb.UsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public deletarUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public deletarUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public alternarStatusUsuario(request: messages_pb.UsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public alternarStatusUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public alternarStatusUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public atualizarUsuario(request: messages_pb.CriacaoUsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public atualizarUsuario(request: messages_pb.CriacaoUsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public atualizarUsuario(request: messages_pb.CriacaoUsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public criarUsuario(request: messages_pb.CriacaoUsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public criarUsuario(request: messages_pb.CriacaoUsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public criarUsuario(request: messages_pb.CriacaoUsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public obtemListaUniversidades(request: messages_pb.Empty, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUniversidadesResponse) => void): grpc.ClientUnaryCall;
    public obtemListaUniversidades(request: messages_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUniversidadesResponse) => void): grpc.ClientUnaryCall;
    public obtemListaUniversidades(request: messages_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUniversidadesResponse) => void): grpc.ClientUnaryCall;
}
