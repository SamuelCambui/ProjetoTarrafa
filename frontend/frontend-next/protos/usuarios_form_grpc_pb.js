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

function serialize_protos_CriacaoUsuarioFormularioRequest(arg) {
  if (!(arg instanceof messages_pb.CriacaoUsuarioFormularioRequest)) {
    throw new Error('Expected argument of type protos.CriacaoUsuarioFormularioRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_CriacaoUsuarioFormularioRequest(buffer_arg) {
  return messages_pb.CriacaoUsuarioFormularioRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_ListaUsuariosFormularioResponse(arg) {
  if (!(arg instanceof messages_pb.ListaUsuariosFormularioResponse)) {
    throw new Error('Expected argument of type protos.ListaUsuariosFormularioResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_ListaUsuariosFormularioResponse(buffer_arg) {
  return messages_pb.ListaUsuariosFormularioResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_protos_LoginResponseFormulario(arg) {
  if (!(arg instanceof messages_pb.LoginResponseFormulario)) {
    throw new Error('Expected argument of type protos.LoginResponseFormulario');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_LoginResponseFormulario(buffer_arg) {
  return messages_pb.LoginResponseFormulario.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_protos_UsuarioFormularioResponse(arg) {
  if (!(arg instanceof messages_pb.UsuarioFormularioResponse)) {
    throw new Error('Expected argument of type protos.UsuarioFormularioResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_UsuarioFormularioResponse(buffer_arg) {
  return messages_pb.UsuarioFormularioResponse.deserializeBinary(new Uint8Array(buffer_arg));
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


var UsuarioFormularioService = exports.UsuarioFormularioService = {
  loginForm: {
    path: '/protos.UsuarioFormulario/LoginForm',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.LoginRequest,
    responseType: messages_pb.LoginResponseFormulario,
    requestSerialize: serialize_protos_LoginRequest,
    requestDeserialize: deserialize_protos_LoginRequest,
    responseSerialize: serialize_protos_LoginResponseFormulario,
    responseDeserialize: deserialize_protos_LoginResponseFormulario,
  },
  logoutForm: {
    path: '/protos.UsuarioFormulario/LogoutForm',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.LogoutRequest,
    responseType: messages_pb.LogoutResponse,
    requestSerialize: serialize_protos_LogoutRequest,
    requestDeserialize: deserialize_protos_LogoutRequest,
    responseSerialize: serialize_protos_LogoutResponse,
    responseDeserialize: deserialize_protos_LogoutResponse,
  },
  obtemUsuarioForm: {
    path: '/protos.UsuarioFormulario/ObtemUsuarioForm',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.UsuarioRequest,
    responseType: messages_pb.UsuarioFormularioResponse,
    requestSerialize: serialize_protos_UsuarioRequest,
    requestDeserialize: deserialize_protos_UsuarioRequest,
    responseSerialize: serialize_protos_UsuarioFormularioResponse,
    responseDeserialize: deserialize_protos_UsuarioFormularioResponse,
  },
  obtemListaUsuarios: {
    path: '/protos.UsuarioFormulario/ObtemListaUsuarios',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.UsuarioFormularioResponse,
    responseType: messages_pb.ListaUsuariosFormularioResponse,
    requestSerialize: serialize_protos_UsuarioFormularioResponse,
    requestDeserialize: deserialize_protos_UsuarioFormularioResponse,
    responseSerialize: serialize_protos_ListaUsuariosFormularioResponse,
    responseDeserialize: deserialize_protos_ListaUsuariosFormularioResponse,
  },
  deletarUsuario: {
    path: '/protos.UsuarioFormulario/DeletarUsuario',
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
    path: '/protos.UsuarioFormulario/AlternarStatusUsuario',
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
    path: '/protos.UsuarioFormulario/AtualizarUsuario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.CriacaoUsuarioFormularioRequest,
    responseType: messages_pb.AlteracaoUsuarioResponse,
    requestSerialize: serialize_protos_CriacaoUsuarioFormularioRequest,
    requestDeserialize: deserialize_protos_CriacaoUsuarioFormularioRequest,
    responseSerialize: serialize_protos_AlteracaoUsuarioResponse,
    responseDeserialize: deserialize_protos_AlteracaoUsuarioResponse,
  },
  criarUsuario: {
    path: '/protos.UsuarioFormulario/CriarUsuario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.CriacaoUsuarioFormularioRequest,
    responseType: messages_pb.AlteracaoUsuarioResponse,
    requestSerialize: serialize_protos_CriacaoUsuarioFormularioRequest,
    requestDeserialize: deserialize_protos_CriacaoUsuarioFormularioRequest,
    responseSerialize: serialize_protos_AlteracaoUsuarioResponse,
    responseDeserialize: deserialize_protos_AlteracaoUsuarioResponse,
  },
};

exports.UsuarioFormularioClient = grpc.makeGenericClientConstructor(UsuarioFormularioService);
