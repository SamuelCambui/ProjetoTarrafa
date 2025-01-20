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

function serialize_protos_ListaUsuariosResponse(arg) {
  if (!(arg instanceof messages_pb.ListaUsuariosResponse)) {
    throw new Error('Expected argument of type protos.ListaUsuariosResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_ListaUsuariosResponse(buffer_arg) {
  return messages_pb.ListaUsuariosResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_LoginRequest(arg) {
  if (!(arg instanceof messages_pb.LoginRequest)) {
    throw new Error('Expected argument of type protos.LoginRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_LoginRequest(buffer_arg) {
  return messages_pb.LoginRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_LoginResponse(arg) {
  if (!(arg instanceof messages_pb.LoginResponse)) {
    throw new Error('Expected argument of type protos.LoginResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_LoginResponse(buffer_arg) {
  return messages_pb.LoginResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_LogoutRequest(arg) {
  if (!(arg instanceof messages_pb.LogoutRequest)) {
    throw new Error('Expected argument of type protos.LogoutRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_LogoutRequest(buffer_arg) {
  return messages_pb.LogoutRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_LogoutResponse(arg) {
  if (!(arg instanceof messages_pb.LogoutResponse)) {
    throw new Error('Expected argument of type protos.LogoutResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_LogoutResponse(buffer_arg) {
  return messages_pb.LogoutResponse.deserializeBinary(new Uint8Array(buffer_arg));
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
  login: {
    path: '/protos.Usuario/Login',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.LoginRequest,
    responseType: messages_pb.LoginResponse,
    requestSerialize: serialize_protos_LoginRequest,
    requestDeserialize: deserialize_protos_LoginRequest,
    responseSerialize: serialize_protos_LoginResponse,
    responseDeserialize: deserialize_protos_LoginResponse,
  },
  logout: {
    path: '/protos.Usuario/Logout',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.LogoutRequest,
    responseType: messages_pb.LogoutResponse,
    requestSerialize: serialize_protos_LogoutRequest,
    requestDeserialize: deserialize_protos_LogoutRequest,
    responseSerialize: serialize_protos_LogoutResponse,
    responseDeserialize: deserialize_protos_LogoutResponse,
  },
  obtemUsuario: {
    path: '/protos.Usuario/ObtemUsuario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.UsuarioRequest,
    responseType: messages_pb.UsuarioResponse,
    requestSerialize: serialize_protos_UsuarioRequest,
    requestDeserialize: deserialize_protos_UsuarioRequest,
    responseSerialize: serialize_protos_UsuarioResponse,
    responseDeserialize: deserialize_protos_UsuarioResponse,
  },
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
};

exports.UsuarioClient = grpc.makeGenericClientConstructor(UsuarioService);
