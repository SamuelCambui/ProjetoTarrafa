// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var messages_pb = require('./messages_pb.js');

function serialize_protos_AlteracaoUsuarioResponse(arg) {
  if (!(arg instanceof messages_pb.AlteracaoUsuarioResponse)) {
    throw new Error('Expected argument of type protos.AlteracaoUsuarioResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_AlteracaoUsuarioResponse(buffer_arg) {
  return messages_pb.AlteracaoUsuarioResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_CriacaoUsuarioRequest(arg) {
  if (!(arg instanceof messages_pb.CriacaoUsuarioRequest)) {
    throw new Error('Expected argument of type protos.CriacaoUsuarioRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_CriacaoUsuarioRequest(buffer_arg) {
  return messages_pb.CriacaoUsuarioRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_Empty(arg) {
  if (!(arg instanceof messages_pb.Empty)) {
    throw new Error('Expected argument of type protos.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_Empty(buffer_arg) {
  return messages_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_ListaUniversidadesResponse(arg) {
  if (!(arg instanceof messages_pb.ListaUniversidadesResponse)) {
    throw new Error('Expected argument of type protos.ListaUniversidadesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_ListaUniversidadesResponse(buffer_arg) {
  return messages_pb.ListaUniversidadesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_ListaUsuariosResponse(arg) {
  if (!(arg instanceof messages_pb.ListaUsuariosResponse)) {
    throw new Error('Expected argument of type protos.ListaUsuariosResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_ListaUsuariosResponse(buffer_arg) {
  return messages_pb.ListaUsuariosResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_UsuarioDados(arg) {
  if (!(arg instanceof messages_pb.UsuarioDados)) {
    throw new Error('Expected argument of type protos.UsuarioDados');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_UsuarioDados(buffer_arg) {
  return messages_pb.UsuarioDados.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_UsuarioRequest(arg) {
  if (!(arg instanceof messages_pb.UsuarioRequest)) {
    throw new Error('Expected argument of type protos.UsuarioRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_UsuarioRequest(buffer_arg) {
  return messages_pb.UsuarioRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_UsuarioResponse(arg) {
  if (!(arg instanceof messages_pb.UsuarioResponse)) {
    throw new Error('Expected argument of type protos.UsuarioResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_UsuarioResponse(buffer_arg) {
  return messages_pb.UsuarioResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var UsuarioService = exports.UsuarioService = {
  // rpc Login (LoginRequest) returns (LoginResponse);
// rpc Logout (LogoutRequest) returns (LogoutResponse);
obtemUsuario: {
    path: '/protos.Usuario/ObtemUsuario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.UsuarioRequest,
    responseType: messages_pb.UsuarioDados,
    requestSerialize: serialize_protos_UsuarioRequest,
    requestDeserialize: deserialize_protos_UsuarioRequest,
    responseSerialize: serialize_protos_UsuarioDados,
    responseDeserialize: deserialize_protos_UsuarioDados,
  },
  // rpc VerificarSessao (VerificarSessaoRequest) returns (VerificarSessaoResponse);
obtemListaUsuarios: {
    path: '/protos.Usuario/ObtemListaUsuarios',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.UsuarioResponse,
    responseType: messages_pb.ListaUsuariosResponse,
    requestSerialize: serialize_protos_UsuarioResponse,
    requestDeserialize: deserialize_protos_UsuarioResponse,
    responseSerialize: serialize_protos_ListaUsuariosResponse,
    responseDeserialize: deserialize_protos_ListaUsuariosResponse,
  },
  atualizarUsuario: {
    path: '/protos.Usuario/AtualizarUsuario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.CriacaoUsuarioRequest,
    responseType: messages_pb.AlteracaoUsuarioResponse,
    requestSerialize: serialize_protos_CriacaoUsuarioRequest,
    requestDeserialize: deserialize_protos_CriacaoUsuarioRequest,
    responseSerialize: serialize_protos_AlteracaoUsuarioResponse,
    responseDeserialize: deserialize_protos_AlteracaoUsuarioResponse,
  },
  criarUsuario: {
    path: '/protos.Usuario/CriarUsuario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.CriacaoUsuarioRequest,
    responseType: messages_pb.AlteracaoUsuarioResponse,
    requestSerialize: serialize_protos_CriacaoUsuarioRequest,
    requestDeserialize: deserialize_protos_CriacaoUsuarioRequest,
    responseSerialize: serialize_protos_AlteracaoUsuarioResponse,
    responseDeserialize: deserialize_protos_AlteracaoUsuarioResponse,
  },
  deletarUsuario: {
    path: '/protos.Usuario/DeletarUsuario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.UsuarioRequest,
    responseType: messages_pb.AlteracaoUsuarioResponse,
    requestSerialize: serialize_protos_UsuarioRequest,
    requestDeserialize: deserialize_protos_UsuarioRequest,
    responseSerialize: serialize_protos_AlteracaoUsuarioResponse,
    responseDeserialize: deserialize_protos_AlteracaoUsuarioResponse,
  },
  alternarStatusUsuario: {
    path: '/protos.Usuario/AlternarStatusUsuario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.UsuarioRequest,
    responseType: messages_pb.AlteracaoUsuarioResponse,
    requestSerialize: serialize_protos_UsuarioRequest,
    requestDeserialize: deserialize_protos_UsuarioRequest,
    responseSerialize: serialize_protos_AlteracaoUsuarioResponse,
    responseDeserialize: deserialize_protos_AlteracaoUsuarioResponse,
  },
  obtemListaUniversidades: {
    path: '/protos.Usuario/ObtemListaUniversidades',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.Empty,
    responseType: messages_pb.ListaUniversidadesResponse,
    requestSerialize: serialize_protos_Empty,
    requestDeserialize: deserialize_protos_Empty,
    responseSerialize: serialize_protos_ListaUniversidadesResponse,
    responseDeserialize: deserialize_protos_ListaUniversidadesResponse,
  },
};

exports.UsuarioClient = grpc.makeGenericClientConstructor(UsuarioService);
