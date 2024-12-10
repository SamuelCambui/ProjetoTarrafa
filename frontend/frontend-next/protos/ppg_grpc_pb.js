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


var IndicadoresService = exports.IndicadoresService = {
  obtemIndicadores: {
    path: '/protos.Indicadores/ObtemIndicadores',
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

exports.IndicadoresClient = grpc.makeGenericClientConstructor(IndicadoresService);
