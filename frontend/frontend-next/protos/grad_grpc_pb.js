// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var messages_pb = require('./messages_pb.js');

function serialize_protos_GradDisciplinasRequest(arg) {
  if (!(arg instanceof messages_pb.GradDisciplinasRequest)) {
    throw new Error('Expected argument of type protos.GradDisciplinasRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_GradDisciplinasRequest(buffer_arg) {
  return messages_pb.GradDisciplinasRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_GradRequest(arg) {
  if (!(arg instanceof messages_pb.GradRequest)) {
    throw new Error('Expected argument of type protos.GradRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_GradRequest(buffer_arg) {
  return messages_pb.GradRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_GradResponse(arg) {
  if (!(arg instanceof messages_pb.GradResponse)) {
    throw new Error('Expected argument of type protos.GradResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_GradResponse(buffer_arg) {
  return messages_pb.GradResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var IndicadoresGraduacaoService = exports.IndicadoresGraduacaoService = {
  //  
// Retorna dados para compor os indicadores da aba curso.\n
// Parâmetros:
// id(string) - Código do curso.\n
// id_ies(str) - Código da Instituição.\n
// anoi(int) - Ano Inicial.\n
// anof(int) - Ano Final.\n
getAbaIndicadoresCurso: {
    path: '/protos.IndicadoresGraduacao/GetAbaIndicadoresCurso',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.GradRequest,
    responseType: messages_pb.GradResponse,
    requestSerialize: serialize_protos_GradRequest,
    requestDeserialize: deserialize_protos_GradRequest,
    responseSerialize: serialize_protos_GradResponse,
    responseDeserialize: deserialize_protos_GradResponse,
  },
  //  
// Retorna dados para compor os indicadores da aba de disciplinas.\n
// Parâmetros:
// id_disc(string) - Código da Disciplina.\n
// id_ies(string) - Código da Instituição.\n
// id_curso(string) - Código do Curso.\n
// id_grade(string) - Código da Grade Curricular.\n
// anoi(int) - Ano Inicial.\n
// anof(int) - Ano Final.\n
getAbaDisciplinas: {
    path: '/protos.IndicadoresGraduacao/GetAbaDisciplinas',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.GradDisciplinasRequest,
    responseType: messages_pb.GradResponse,
    requestSerialize: serialize_protos_GradDisciplinasRequest,
    requestDeserialize: deserialize_protos_GradDisciplinasRequest,
    responseSerialize: serialize_protos_GradResponse,
    responseDeserialize: deserialize_protos_GradResponse,
  },
  //  
// Retorna dados para compor os indicadores da aba de egressos.\n
// Parâmetros:
// id(string) - Código do curso.\n
// id_ies(str) - Código da Instituição.\n
// anoi(int) - Ano Inicial.\n
// anof(int) - Ano Final.\n
getAbaEgressos: {
    path: '/protos.IndicadoresGraduacao/GetAbaEgressos',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.GradRequest,
    responseType: messages_pb.GradResponse,
    requestSerialize: serialize_protos_GradRequest,
    requestDeserialize: deserialize_protos_GradRequest,
    responseSerialize: serialize_protos_GradResponse,
    responseDeserialize: deserialize_protos_GradResponse,
  },
  //  
// Retorna dados para compor os indicadores da aba de professores.\n
// Parâmetros:
// id(string) - Código do curso.\n
// id_ies(str) - Código da Instituição.\n
// anoi(int) - Ano Inicial.\n
// anof(int) - Ano Final.\n
getAbaProfessores: {
    path: '/protos.IndicadoresGraduacao/GetAbaProfessores',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.GradRequest,
    responseType: messages_pb.GradResponse,
    requestSerialize: serialize_protos_GradRequest,
    requestDeserialize: deserialize_protos_GradRequest,
    responseSerialize: serialize_protos_GradResponse,
    responseDeserialize: deserialize_protos_GradResponse,
  },
  //
// Retorna os indicadores da disciplina selecionada.\n
// Parâmetros:\n
// id_disc(string) - Código da Disciplina.\n
// id_ies(string) - Código da Instituição.\n
// id_curso(string) - Código do Curso.\n
// id_grade(string) - Código da Grade Curricular.\n
// anoi(int) - Ano Inicial.\n
// anof(int) - Ano Final.\n
getIndicadoresDisciplina: {
    path: '/protos.IndicadoresGraduacao/GetIndicadoresDisciplina',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.GradDisciplinasRequest,
    responseType: messages_pb.GradResponse,
    requestSerialize: serialize_protos_GradDisciplinasRequest,
    requestDeserialize: deserialize_protos_GradDisciplinasRequest,
    responseSerialize: serialize_protos_GradResponse,
    responseDeserialize: deserialize_protos_GradResponse,
  },
  //
// Retorna os indicadores globais de todos os cursos de graduação.\n
// Parâmetros:\n
// id_ies(str) - Código da Instituição.\n
// anoi(int) - Ano Inicial.\n
// anof(int) - Ano Final.\n
getIndicadoresGlobais: {
    path: '/protos.IndicadoresGraduacao/GetIndicadoresGlobais',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.GradRequest,
    responseType: messages_pb.GradResponse,
    requestSerialize: serialize_protos_GradRequest,
    requestDeserialize: deserialize_protos_GradRequest,
    responseSerialize: serialize_protos_GradResponse,
    responseDeserialize: deserialize_protos_GradResponse,
  },
};

exports.IndicadoresGraduacaoClient = grpc.makeGenericClientConstructor(IndicadoresGraduacaoService);
var DadosGraduacaoService = exports.DadosGraduacaoService = {
  // 
// Retorna todos os cursos cadastrados de uma instituição.
// Parâmetros:\n
// id_ies(string) - Código da Instituição.
//
getCursos: {
    path: '/protos.DadosGraduacao/GetCursos',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.GradRequest,
    responseType: messages_pb.GradResponse,
    requestSerialize: serialize_protos_GradRequest,
    requestDeserialize: deserialize_protos_GradRequest,
    responseSerialize: serialize_protos_GradResponse,
    responseDeserialize: deserialize_protos_GradResponse,
  },
  //  
// Retorna um curso em específico.\n
// Parâmetros:\n
// id(string) - Código do curso.\n
// id_ies(str) - Código da Instituição.\n
getCurso: {
    path: '/protos.DadosGraduacao/GetCurso',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.GradRequest,
    responseType: messages_pb.GradResponse,
    requestSerialize: serialize_protos_GradRequest,
    requestDeserialize: deserialize_protos_GradRequest,
    responseSerialize: serialize_protos_GradResponse,
    responseDeserialize: deserialize_protos_GradResponse,
  },
  //
// Retorna todas as diciplinas de uma grade curricular de um curso.\n
// Parâmetros:\n
// id_curso(string) - Código do curso.\n
// id_ies(str) - Código da Instituição.\n
// id_grade(str) - Código da Grade Curricular.\n
getDisciplinas: {
    path: '/protos.DadosGraduacao/GetDisciplinas',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.GradDisciplinasRequest,
    responseType: messages_pb.GradResponse,
    requestSerialize: serialize_protos_GradDisciplinasRequest,
    requestDeserialize: deserialize_protos_GradDisciplinasRequest,
    responseSerialize: serialize_protos_GradResponse,
    responseDeserialize: deserialize_protos_GradResponse,
  },
  //
// Retorna uma diciplina em específico.\n
// Parâmetros:\n
// id_disc(int) - Código da disciplina.\n
// id_ies(str) - Código da Instituição.\n
getDisciplina: {
    path: '/protos.DadosGraduacao/GetDisciplina',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.GradDisciplinasRequest,
    responseType: messages_pb.GradResponse,
    requestSerialize: serialize_protos_GradDisciplinasRequest,
    requestDeserialize: deserialize_protos_GradDisciplinasRequest,
    responseSerialize: serialize_protos_GradResponse,
    responseDeserialize: deserialize_protos_GradResponse,
  },
};

exports.DadosGraduacaoClient = grpc.makeGenericClientConstructor(DadosGraduacaoService);
