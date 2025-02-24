// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var messages_pb = require('./messages_pb.js');

function serialize_protos_FormularioIndicadoresRequest(arg) {
  if (!(arg instanceof messages_pb.FormularioIndicadoresRequest)) {
    throw new Error('Expected argument of type protos.FormularioIndicadoresRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_FormularioIndicadoresRequest(buffer_arg) {
  return messages_pb.FormularioIndicadoresRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_FormularioPPGLSRequest(arg) {
  if (!(arg instanceof messages_pb.FormularioPPGLSRequest)) {
    throw new Error('Expected argument of type protos.FormularioPPGLSRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_FormularioPPGLSRequest(buffer_arg) {
  return messages_pb.FormularioPPGLSRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_FormularioPPGLSResponse(arg) {
  if (!(arg instanceof messages_pb.FormularioPPGLSResponse)) {
    throw new Error('Expected argument of type protos.FormularioPPGLSResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_FormularioPPGLSResponse(buffer_arg) {
  return messages_pb.FormularioPPGLSResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_FormularioSerchPPGLSRequest(arg) {
  if (!(arg instanceof messages_pb.FormularioSerchPPGLSRequest)) {
    throw new Error('Expected argument of type protos.FormularioSerchPPGLSRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_FormularioSerchPPGLSRequest(buffer_arg) {
  return messages_pb.FormularioSerchPPGLSRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_PPGLSRequest(arg) {
  if (!(arg instanceof messages_pb.PPGLSRequest)) {
    throw new Error('Expected argument of type protos.PPGLSRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_PPGLSRequest(buffer_arg) {
  return messages_pb.PPGLSRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_protos_PPGLSResponse(arg) {
  if (!(arg instanceof messages_pb.PPGLSResponse)) {
    throw new Error('Expected argument of type protos.PPGLSResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_protos_PPGLSResponse(buffer_arg) {
  return messages_pb.PPGLSResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var IndicadoresPosGraduacaoLSService = exports.IndicadoresPosGraduacaoLSService = {
  //  
// Retorna dados para compor os indicadores da aba curso.\n
// Parâmetros:
// id(string) - Código do curso.\n
// anoi(int) - Ano Inicial.\n
// anof(int) - Ano Final.\n
getAbaIndicadoresCurso: {
    path: '/protos.IndicadoresPosGraduacaoLS/GetAbaIndicadoresCurso',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PPGLSRequest,
    responseType: messages_pb.PPGLSResponse,
    requestSerialize: serialize_protos_PPGLSRequest,
    requestDeserialize: deserialize_protos_PPGLSRequest,
    responseSerialize: serialize_protos_PPGLSResponse,
    responseDeserialize: deserialize_protos_PPGLSResponse,
  },
  //  
// Retorna dados para compor os indicadores da aba de disciplinas.\n
// Parâmetros:
// id_ies(string) - Código da Instituição. \
// id_disciplina(string) - Código do curso.\n
// id_curso(string) - Código do curso.\n
// anoi(int) - Ano Inicial.\n
// anof(int) - Ano Final.\n
getAbaDisciplinas: {
    path: '/protos.IndicadoresPosGraduacaoLS/GetAbaDisciplinas',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PPGLSRequest,
    responseType: messages_pb.PPGLSResponse,
    requestSerialize: serialize_protos_PPGLSRequest,
    requestDeserialize: deserialize_protos_PPGLSRequest,
    responseSerialize: serialize_protos_PPGLSResponse,
    responseDeserialize: deserialize_protos_PPGLSResponse,
  },
  //  
// Retorna dados para compor os indicadores da aba de regressos.\n
// Parâmetros:
// id_ies(string) - Código da Instituição. \
// id_disciplina(string) - Código do curso.\n
// id_curso(string) - Código do curso.\n
// anoi(int) - Ano Inicial.\n
// anof(int) - Ano Final.\n
getAbaRegressos: {
    path: '/protos.IndicadoresPosGraduacaoLS/GetAbaRegressos',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PPGLSRequest,
    responseType: messages_pb.PPGLSResponse,
    requestSerialize: serialize_protos_PPGLSRequest,
    requestDeserialize: deserialize_protos_PPGLSRequest,
    responseSerialize: serialize_protos_PPGLSResponse,
    responseDeserialize: deserialize_protos_PPGLSResponse,
  },
  //  
// Retorna dados para compor os indicadores da aba de professores.\n
// Parâmetros:
// id(string) - Código do curso.n
// anoi(int) - Ano Inicial.\n
// anof(int) - Ano Final.\n
getAbaProfessores: {
    path: '/protos.IndicadoresPosGraduacaoLS/GetAbaProfessores',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PPGLSRequest,
    responseType: messages_pb.PPGLSResponse,
    requestSerialize: serialize_protos_PPGLSRequest,
    requestDeserialize: deserialize_protos_PPGLSRequest,
    responseSerialize: serialize_protos_PPGLSResponse,
    responseDeserialize: deserialize_protos_PPGLSResponse,
  },
  //
// Retorna os indicadores da disciplina selecionada.\n
// Parâmetros:\n
// id(string) - Código do curso.\n
// anoi(int) - Ano Inicial.\n
// anof(int) - Ano Final.\n
getIndicadoresDisciplina: {
    path: '/protos.IndicadoresPosGraduacaoLS/GetIndicadoresDisciplina',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PPGLSRequest,
    responseType: messages_pb.PPGLSResponse,
    requestSerialize: serialize_protos_PPGLSRequest,
    requestDeserialize: deserialize_protos_PPGLSRequest,
    responseSerialize: serialize_protos_PPGLSResponse,
    responseDeserialize: deserialize_protos_PPGLSResponse,
  },
  getIndicadoresGlobais: {
    path: '/protos.IndicadoresPosGraduacaoLS/GetIndicadoresGlobais',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PPGLSRequest,
    responseType: messages_pb.PPGLSResponse,
    requestSerialize: serialize_protos_PPGLSRequest,
    requestDeserialize: deserialize_protos_PPGLSRequest,
    responseSerialize: serialize_protos_PPGLSResponse,
    responseDeserialize: deserialize_protos_PPGLSResponse,
  },
};

exports.IndicadoresPosGraduacaoLSClient = grpc.makeGenericClientConstructor(IndicadoresPosGraduacaoLSService);
var DadosFormularioPosGraduacaoLSService = exports.DadosFormularioPosGraduacaoLSService = {
  //
// Retorna os dados do formulário da pós-graduação latu sensu.
// Parâmetros:
// nome(string) - Nome do formulário.
// data_inicio(string) - Data de início.
getIndicadoresFormulario: {
    path: '/protos.DadosFormularioPosGraduacaoLS/GetIndicadoresFormulario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.FormularioIndicadoresRequest,
    responseType: messages_pb.FormularioPPGLSResponse,
    requestSerialize: serialize_protos_FormularioIndicadoresRequest,
    requestDeserialize: deserialize_protos_FormularioIndicadoresRequest,
    responseSerialize: serialize_protos_FormularioPPGLSResponse,
    responseDeserialize: deserialize_protos_FormularioPPGLSResponse,
  },
  //
// Retorna o dados de professor ou de coordenador da pós-graduação latu sensu.
// Parâmetros:
// cpf(str) - Código CPF do professor
// tipo(int) - Professor ou coordenador
searchRegistrosFormualario: {
    path: '/protos.DadosFormularioPosGraduacaoLS/SearchRegistrosFormualario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.FormularioSerchPPGLSRequest,
    responseType: messages_pb.FormularioPPGLSResponse,
    requestSerialize: serialize_protos_FormularioSerchPPGLSRequest,
    requestDeserialize: deserialize_protos_FormularioSerchPPGLSRequest,
    responseSerialize: serialize_protos_FormularioPPGLSResponse,
    responseDeserialize: deserialize_protos_FormularioPPGLSResponse,
  },
  //
// Insere um novo formulário da pós-graduação latu sensu.
// Parâmetros:
// nome(string) - Nome do formulário.
// data_inicio(string) - Data de início.
insertFormulario: {
    path: '/protos.DadosFormularioPosGraduacaoLS/InsertFormulario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.FormularioPPGLSRequest,
    responseType: messages_pb.FormularioPPGLSResponse,
    requestSerialize: serialize_protos_FormularioPPGLSRequest,
    requestDeserialize: deserialize_protos_FormularioPPGLSRequest,
    responseSerialize: serialize_protos_FormularioPPGLSResponse,
    responseDeserialize: deserialize_protos_FormularioPPGLSResponse,
  },
  //
// Atualiza os dados de um formulário existente.
// Parâmetros:
// id(int) - ID do formulário.
// nome(string) - Nome do formulário.
// data_inicio(string) - Data de início.
updateFormulario: {
    path: '/protos.DadosFormularioPosGraduacaoLS/UpdateFormulario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.FormularioPPGLSRequest,
    responseType: messages_pb.FormularioPPGLSResponse,
    requestSerialize: serialize_protos_FormularioPPGLSRequest,
    requestDeserialize: deserialize_protos_FormularioPPGLSRequest,
    responseSerialize: serialize_protos_FormularioPPGLSResponse,
    responseDeserialize: deserialize_protos_FormularioPPGLSResponse,
  },
  //
// Exclui um formulário da pós-graduação latu sensu.
// Parâmetros:
// id(int) - ID do formulário.
// data_inicio(string) - Data de início.
deleteFormulario: {
    path: '/protos.DadosFormularioPosGraduacaoLS/DeleteFormulario',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.FormularioIndicadoresRequest,
    responseType: messages_pb.FormularioPPGLSResponse,
    requestSerialize: serialize_protos_FormularioIndicadoresRequest,
    requestDeserialize: deserialize_protos_FormularioIndicadoresRequest,
    responseSerialize: serialize_protos_FormularioPPGLSResponse,
    responseDeserialize: deserialize_protos_FormularioPPGLSResponse,
  },
};

exports.DadosFormularioPosGraduacaoLSClient = grpc.makeGenericClientConstructor(DadosFormularioPosGraduacaoLSService);
var DadosPosGraduacaoLSService = exports.DadosPosGraduacaoLSService = {
  // Retorna todos os cursos cadastrados.
getCursos: {
    path: '/protos.DadosPosGraduacaoLS/GetCursos',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PPGLSRequest,
    responseType: messages_pb.PPGLSResponse,
    requestSerialize: serialize_protos_PPGLSRequest,
    requestDeserialize: deserialize_protos_PPGLSRequest,
    responseSerialize: serialize_protos_PPGLSResponse,
    responseDeserialize: deserialize_protos_PPGLSResponse,
  },
  //  
// Retorna um curso em específico.\n
// Parâmetros:\n
// id(string) - Código do curso.
getCurso: {
    path: '/protos.DadosPosGraduacaoLS/GetCurso',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PPGLSRequest,
    responseType: messages_pb.PPGLSResponse,
    requestSerialize: serialize_protos_PPGLSRequest,
    requestDeserialize: deserialize_protos_PPGLSRequest,
    responseSerialize: serialize_protos_PPGLSResponse,
    responseDeserialize: deserialize_protos_PPGLSResponse,
  },
  //
// Retorna todas as diciplinas de um curso.\n
// Parâmetros:\n
// id(string) - Código do curso.
getDisciplinas: {
    path: '/protos.DadosPosGraduacaoLS/GetDisciplinas',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PPGLSRequest,
    responseType: messages_pb.PPGLSResponse,
    requestSerialize: serialize_protos_PPGLSRequest,
    requestDeserialize: deserialize_protos_PPGLSRequest,
    responseSerialize: serialize_protos_PPGLSResponse,
    responseDeserialize: deserialize_protos_PPGLSResponse,
  },
  //
// Retorna uma diciplina em específico.\n
// Parâmetros:\n
// id(int) - Código da disciplina.\n
getDisciplina: {
    path: '/protos.DadosPosGraduacaoLS/GetDisciplina',
    requestStream: false,
    responseStream: false,
    requestType: messages_pb.PPGLSRequest,
    responseType: messages_pb.PPGLSResponse,
    requestSerialize: serialize_protos_PPGLSRequest,
    requestDeserialize: deserialize_protos_PPGLSRequest,
    responseSerialize: serialize_protos_PPGLSResponse,
    responseDeserialize: deserialize_protos_PPGLSResponse,
  },
};

exports.DadosPosGraduacaoLSClient = grpc.makeGenericClientConstructor(DadosPosGraduacaoLSService);
