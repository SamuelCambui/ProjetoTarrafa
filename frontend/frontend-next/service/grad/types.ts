export type AbaDisciplinasParams = {
  idDisc?: any;
  idCurso: any;
  idGrade?: any;
  idIes: any;
  anoInicial?: any;
  anoFinal?: any;
};

export type IndicadoresDisciplinaParams = AbaDisciplinasParams & {
  idDisc: any;
  anoInicial: any;
  anoFinal: any;
};

export type AbaIndicadoresCursoParams = {
  idCurso: any;
  idIes: any;
  anoInicial: any;
  anoFinal: any;
};

export type AbaEgressosParams = AbaIndicadoresCursoParams;

export type AbaProfessoresParams = AbaIndicadoresCursoParams;

export type GetCursoParams = {
  idIes: any;
  idCurso: any;
};

export type GetCursosParams = {
  idIes: any;
};

export type IndicadoresGlobaisParams = {
  idIes: any;
  anoInicial: any;
  anoFinal: any;
};

export type GetDisciplinasParams = AbaDisciplinasParams;

export type GetDisciplinaParams = AbaDisciplinasParams;

export type IndicadoresDisciplinaResponse = {
  graficoQuantidadeAlunosDisciplina?: Array<any>;
  aprovacoesReprovacoesDisciplina?: Array<any>;
  boxplotNotasDisciplina?: Array<any>;
  histogramaNotasDisciplina?: Array<any>;
  graficoProvaFinal?: Array<any>;
  boxplotProvaFinalDisciplina?: Array<any>;
  evasaoDisciplina?: Array<any>;
  boxplotEvasao?: Array<any>;
  boxplotDesempenhoCotistas?: Array<any>;
  histogramaDesempenhoCotistas?: Array<any>;
  boxplotDesempenhoProfessor?: Array<any>;
};

export type IndicadoresGlobaisResponse = {
  municipios?: Array<any>;
  graficoSexoAlunos?: Array<any>;
  graficoEgressos?: Array<any>;
  boxplotIdade?: Array<any>;
  taxaMatriculas?: Array<any>;
  graficoEgressosCota?: Array<any>;
  taxaMatriculasCota?: Array<any>;
};
