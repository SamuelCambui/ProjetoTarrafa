// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var messages_pb = require('./messages_pb.js');

function serialize_protos_PpgRequest(arg) {
  if (!(arg instanceof messages_pb.PpgRequest)) {
    throw new Error('Expected argument of type protos.PpgRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_PpgRequest(buffer_arg) {
  return messages_pb.PpgRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_PpgResponse(arg) {
  if (!(arg instanceof messages_pb.PpgResponse)) {
    throw new Error('Expected argument of type protos.PpgResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_PpgResponse(buffer_arg) {
  return messages_pb.PpgResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


//
// Serviço PPG
// Este serviço oferece uma API para interagir com os dados de PPG.
// Ele permite obter indicadores, bancas, docentes, egressos,
// informações gerais, projetos e tarefas relacionadas ao PPG.
var PPGService = exports.PPGService = {
  // Retorna os indicadores do PPG.
obtemInformacaoPPG: {
    path: '/protos.PPG/ObtemInformacaoPPG',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PpgRequest,
    responseType: messages_pb.PpgResponse,
    requestSerialize: serialize_protos_PpgRequest,
    requestDeserialize: deserialize_protos_PpgRequest,
    responseSerialize: serialize_protos_PpgResponse,
    responseDeserialize: deserialize_protos_PpgResponse,
  },
  // Retorna os indicadores de desempenho do PPG.
obtemIndicadores: {
    path: '/protos.PPG/ObtemIndicadores',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PpgRequest,
    responseType: messages_pb.PpgResponse,
    requestSerialize: serialize_protos_PpgRequest,
    requestDeserialize: deserialize_protos_PpgRequest,
    responseSerialize: serialize_protos_PpgResponse,
    responseDeserialize: deserialize_protos_PpgResponse,
  },
  // Retorna as informações sobre as bancas do PPG.
obtemBancas: {
    path: '/protos.PPG/ObtemBancas',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PpgRequest,
    responseType: messages_pb.PpgResponse,
    requestSerialize: serialize_protos_PpgRequest,
    requestDeserialize: deserialize_protos_PpgRequest,
    responseSerialize: serialize_protos_PpgResponse,
    responseDeserialize: deserialize_protos_PpgResponse,
  },
  // Retorna os dados sobre os docentes do PPG.
obtemDocentes: {
    path: '/protos.PPG/ObtemDocentes',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PpgRequest,
    responseType: messages_pb.PpgResponse,
    requestSerialize: serialize_protos_PpgRequest,
    requestDeserialize: deserialize_protos_PpgRequest,
    responseSerialize: serialize_protos_PpgResponse,
    responseDeserialize: deserialize_protos_PpgResponse,
  },
  // Retorna informações sobre os egressos do PPG.
obtemEgressos: {
    path: '/protos.PPG/ObtemEgressos',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PpgRequest,
    responseType: messages_pb.PpgResponse,
    requestSerialize: serialize_protos_PpgRequest,
    requestDeserialize: deserialize_protos_PpgRequest,
    responseSerialize: serialize_protos_PpgResponse,
    responseDeserialize: deserialize_protos_PpgResponse,
  },
  // Retorna informações sobre projetos do PPG.
obtemProjetos: {
    path: '/protos.PPG/ObtemProjetos',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PpgRequest,
    responseType: messages_pb.PpgResponse,
    requestSerialize: serialize_protos_PpgRequest,
    requestDeserialize: deserialize_protos_PpgRequest,
    responseSerialize: serialize_protos_PpgResponse,
    responseDeserialize: deserialize_protos_PpgResponse,
  },
};

exports.PPGClient = grpc.makeGenericClientConstructor(PPGService);
//
// Serviço Home
// Este serviço fornece a interface para obter as informações
// gerais da página inicial da aplicação.
//
var HomeService = exports.HomeService = {
  // Retorna as informações gerais para exibição na home.
obtemHome: {
    path: '/protos.Home/ObtemHome',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PpgRequest,
    responseType: messages_pb.PpgResponse,
    requestSerialize: serialize_protos_PpgRequest,
    requestDeserialize: deserialize_protos_PpgRequest,
    responseSerialize: serialize_protos_PpgResponse,
    responseDeserialize: deserialize_protos_PpgResponse,
  },
};

exports.HomeClient = grpc.makeGenericClientConstructor(HomeService);
