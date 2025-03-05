// package: protos
// file: usuarios_form.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as usuarios_form_pb from "./usuarios_form_pb";
import * as messages_pb from "./messages_pb";

interface IUsuarioFormularioService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    loginForm: IUsuarioFormularioService_ILoginForm;
    logoutForm: IUsuarioFormularioService_ILogoutForm;
    obtemUsuarioForm: IUsuarioFormularioService_IObtemUsuarioForm;
    obtemListaUsuarios: IUsuarioFormularioService_IObtemListaUsuarios;
    deletarUsuario: IUsuarioFormularioService_IDeletarUsuario;
    alternarStatusUsuario: IUsuarioFormularioService_IAlternarStatusUsuario;
    atualizarUsuario: IUsuarioFormularioService_IAtualizarUsuario;
    criarUsuario: IUsuarioFormularioService_ICriarUsuario;
}

interface IUsuarioFormularioService_ILoginForm extends grpc.MethodDefinition<messages_pb.LoginRequest, messages_pb.LoginResponseFormulario> {
    path: "/protos.UsuarioFormulario/LoginForm";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.LoginRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.LoginRequest>;
    responseSerialize: grpc.serialize<messages_pb.LoginResponseFormulario>;
    responseDeserialize: grpc.deserialize<messages_pb.LoginResponseFormulario>;
}
interface IUsuarioFormularioService_ILogoutForm extends grpc.MethodDefinition<messages_pb.LogoutRequest, messages_pb.LogoutResponse> {
    path: "/protos.UsuarioFormulario/LogoutForm";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.LogoutRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.LogoutRequest>;
    responseSerialize: grpc.serialize<messages_pb.LogoutResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.LogoutResponse>;
}
interface IUsuarioFormularioService_IObtemUsuarioForm extends grpc.MethodDefinition<messages_pb.UsuarioRequest, messages_pb.UsuarioFormularioResponse> {
    path: "/protos.UsuarioFormulario/ObtemUsuarioForm";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.UsuarioRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.UsuarioRequest>;
    responseSerialize: grpc.serialize<messages_pb.UsuarioFormularioResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.UsuarioFormularioResponse>;
}
interface IUsuarioFormularioService_IObtemListaUsuarios extends grpc.MethodDefinition<messages_pb.UsuarioFormularioResponse, messages_pb.ListaUsuariosFormularioResponse> {
    path: "/protos.UsuarioFormulario/ObtemListaUsuarios";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.UsuarioFormularioResponse>;
    requestDeserialize: grpc.deserialize<messages_pb.UsuarioFormularioResponse>;
    responseSerialize: grpc.serialize<messages_pb.ListaUsuariosFormularioResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.ListaUsuariosFormularioResponse>;
}
interface IUsuarioFormularioService_IDeletarUsuario extends grpc.MethodDefinition<messages_pb.UsuarioRequest, messages_pb.AlteracaoUsuarioResponse> {
    path: "/protos.UsuarioFormulario/DeletarUsuario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.UsuarioRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.UsuarioRequest>;
    responseSerialize: grpc.serialize<messages_pb.AlteracaoUsuarioResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.AlteracaoUsuarioResponse>;
}
interface IUsuarioFormularioService_IAlternarStatusUsuario extends grpc.MethodDefinition<messages_pb.UsuarioRequest, messages_pb.AlteracaoUsuarioResponse> {
    path: "/protos.UsuarioFormulario/AlternarStatusUsuario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.UsuarioRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.UsuarioRequest>;
    responseSerialize: grpc.serialize<messages_pb.AlteracaoUsuarioResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.AlteracaoUsuarioResponse>;
}
interface IUsuarioFormularioService_IAtualizarUsuario extends grpc.MethodDefinition<messages_pb.CriacaoUsuarioFormularioRequest, messages_pb.AlteracaoUsuarioResponse> {
    path: "/protos.UsuarioFormulario/AtualizarUsuario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.CriacaoUsuarioFormularioRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.CriacaoUsuarioFormularioRequest>;
    responseSerialize: grpc.serialize<messages_pb.AlteracaoUsuarioResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.AlteracaoUsuarioResponse>;
}
interface IUsuarioFormularioService_ICriarUsuario extends grpc.MethodDefinition<messages_pb.CriacaoUsuarioFormularioRequest, messages_pb.AlteracaoUsuarioResponse> {
    path: "/protos.UsuarioFormulario/CriarUsuario";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messages_pb.CriacaoUsuarioFormularioRequest>;
    requestDeserialize: grpc.deserialize<messages_pb.CriacaoUsuarioFormularioRequest>;
    responseSerialize: grpc.serialize<messages_pb.AlteracaoUsuarioResponse>;
    responseDeserialize: grpc.deserialize<messages_pb.AlteracaoUsuarioResponse>;
}

export const UsuarioFormularioService: IUsuarioFormularioService;

export interface IUsuarioFormularioServer extends grpc.UntypedServiceImplementation {
    loginForm: grpc.handleUnaryCall<messages_pb.LoginRequest, messages_pb.LoginResponseFormulario>;
    logoutForm: grpc.handleUnaryCall<messages_pb.LogoutRequest, messages_pb.LogoutResponse>;
    obtemUsuarioForm: grpc.handleUnaryCall<messages_pb.UsuarioRequest, messages_pb.UsuarioFormularioResponse>;
    obtemListaUsuarios: grpc.handleUnaryCall<messages_pb.UsuarioFormularioResponse, messages_pb.ListaUsuariosFormularioResponse>;
    deletarUsuario: grpc.handleUnaryCall<messages_pb.UsuarioRequest, messages_pb.AlteracaoUsuarioResponse>;
    alternarStatusUsuario: grpc.handleUnaryCall<messages_pb.UsuarioRequest, messages_pb.AlteracaoUsuarioResponse>;
    atualizarUsuario: grpc.handleUnaryCall<messages_pb.CriacaoUsuarioFormularioRequest, messages_pb.AlteracaoUsuarioResponse>;
    criarUsuario: grpc.handleUnaryCall<messages_pb.CriacaoUsuarioFormularioRequest, messages_pb.AlteracaoUsuarioResponse>;
}

export interface IUsuarioFormularioClient {
    loginForm(request: messages_pb.LoginRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.LoginResponseFormulario) => void): grpc.ClientUnaryCall;
    loginForm(request: messages_pb.LoginRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.LoginResponseFormulario) => void): grpc.ClientUnaryCall;
    loginForm(request: messages_pb.LoginRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.LoginResponseFormulario) => void): grpc.ClientUnaryCall;
    logoutForm(request: messages_pb.LogoutRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    logoutForm(request: messages_pb.LogoutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    logoutForm(request: messages_pb.LogoutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    obtemUsuarioForm(request: messages_pb.UsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.UsuarioFormularioResponse) => void): grpc.ClientUnaryCall;
    obtemUsuarioForm(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.UsuarioFormularioResponse) => void): grpc.ClientUnaryCall;
    obtemUsuarioForm(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.UsuarioFormularioResponse) => void): grpc.ClientUnaryCall;
    obtemListaUsuarios(request: messages_pb.UsuarioFormularioResponse, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUsuariosFormularioResponse) => void): grpc.ClientUnaryCall;
    obtemListaUsuarios(request: messages_pb.UsuarioFormularioResponse, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUsuariosFormularioResponse) => void): grpc.ClientUnaryCall;
    obtemListaUsuarios(request: messages_pb.UsuarioFormularioResponse, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUsuariosFormularioResponse) => void): grpc.ClientUnaryCall;
    deletarUsuario(request: messages_pb.UsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    deletarUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    deletarUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    alternarStatusUsuario(request: messages_pb.UsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    alternarStatusUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    alternarStatusUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    atualizarUsuario(request: messages_pb.CriacaoUsuarioFormularioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    atualizarUsuario(request: messages_pb.CriacaoUsuarioFormularioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    atualizarUsuario(request: messages_pb.CriacaoUsuarioFormularioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    criarUsuario(request: messages_pb.CriacaoUsuarioFormularioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    criarUsuario(request: messages_pb.CriacaoUsuarioFormularioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    criarUsuario(request: messages_pb.CriacaoUsuarioFormularioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
}

export class UsuarioFormularioClient extends grpc.Client implements IUsuarioFormularioClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public loginForm(request: messages_pb.LoginRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.LoginResponseFormulario) => void): grpc.ClientUnaryCall;
    public loginForm(request: messages_pb.LoginRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.LoginResponseFormulario) => void): grpc.ClientUnaryCall;
    public loginForm(request: messages_pb.LoginRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.LoginResponseFormulario) => void): grpc.ClientUnaryCall;
    public logoutForm(request: messages_pb.LogoutRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    public logoutForm(request: messages_pb.LogoutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    public logoutForm(request: messages_pb.LogoutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.LogoutResponse) => void): grpc.ClientUnaryCall;
    public obtemUsuarioForm(request: messages_pb.UsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.UsuarioFormularioResponse) => void): grpc.ClientUnaryCall;
    public obtemUsuarioForm(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.UsuarioFormularioResponse) => void): grpc.ClientUnaryCall;
    public obtemUsuarioForm(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.UsuarioFormularioResponse) => void): grpc.ClientUnaryCall;
    public obtemListaUsuarios(request: messages_pb.UsuarioFormularioResponse, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUsuariosFormularioResponse) => void): grpc.ClientUnaryCall;
    public obtemListaUsuarios(request: messages_pb.UsuarioFormularioResponse, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUsuariosFormularioResponse) => void): grpc.ClientUnaryCall;
    public obtemListaUsuarios(request: messages_pb.UsuarioFormularioResponse, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.ListaUsuariosFormularioResponse) => void): grpc.ClientUnaryCall;
    public deletarUsuario(request: messages_pb.UsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public deletarUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public deletarUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public alternarStatusUsuario(request: messages_pb.UsuarioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public alternarStatusUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public alternarStatusUsuario(request: messages_pb.UsuarioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public atualizarUsuario(request: messages_pb.CriacaoUsuarioFormularioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public atualizarUsuario(request: messages_pb.CriacaoUsuarioFormularioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public atualizarUsuario(request: messages_pb.CriacaoUsuarioFormularioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public criarUsuario(request: messages_pb.CriacaoUsuarioFormularioRequest, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public criarUsuario(request: messages_pb.CriacaoUsuarioFormularioRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
    public criarUsuario(request: messages_pb.CriacaoUsuarioFormularioRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: messages_pb.AlteracaoUsuarioResponse) => void): grpc.ClientUnaryCall;
}
