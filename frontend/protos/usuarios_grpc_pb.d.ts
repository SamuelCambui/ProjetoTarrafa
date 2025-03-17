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
    verificarSessao: IUsuarioService_IVerificarSessao;
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
interface IUsuarioService_IVerificarSessao extends grpc.MethodDefinition<messages_pb.VerificarSessaoRequest, messages_pb.VerificarSessaoResponse> {
    path: "/protos.Usuario/VerificarSessao";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.VerificarSessaoRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.VerificarSessaoRequest>;
    responseSerialize: grpc.serialize<messages_pb.VerificarSessaoResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.VerificarSessaoResponse>;
}

export const UsuarioService: IUsuarioService;

export interface IUsuarioServer extends grpc.UntypedServiceImplementation {
    login: grpc.handleUnaryCall<messages_pb.LoginRequest, messages_pb.LoginResponse>;
    logout: grpc.handleUnaryCall<messages_pb.LogoutRequest, messages_pb.LogoutResponse>;
    obtemUsuario: grpc.handleUnaryCall<messages_pb.UsuarioRequest, messages_pb.UsuarioResponse>;
    verificarSessao: grpc.handleUnaryCall<messages_pb.VerificarSessaoRequest, messages_pb.VerificarSessaoResponse>;
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
    verificarSessao(request: messages_pb.VerificarSessaoRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.VerificarSessaoResponse) => void): grpc.ClientUnaryCall;
    verificarSessao(request: messages_pb.VerificarSessaoRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.VerificarSessaoResponse) => void): grpc.ClientUnaryCall;
    verificarSessao(request: messages_pb.VerificarSessaoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.VerificarSessaoResponse) => void): grpc.ClientUnaryCall;
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
    public verificarSessao(request: messages_pb.VerificarSessaoRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.VerificarSessaoResponse) => void): grpc.ClientUnaryCall;
    public verificarSessao(request: messages_pb.VerificarSessaoRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.VerificarSessaoResponse) => void): grpc.ClientUnaryCall;
    public verificarSessao(request: messages_pb.VerificarSessaoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.VerificarSessaoResponse) => void): grpc.ClientUnaryCall;
}
