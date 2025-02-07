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
    evasaoDisciplina?: Array<any>;
    boxplotEvasao?: Array<any>;
    boxplotDesempenhoCotistas?: Array<any>;
    histogramaDesempenhoCotistas?: Array<any>;
    boxplotDesempenhoProfessor?: Array<any>;
  };

  export type IndicadoresGlobaisResponse = {
    municipios?: Array<any>;
    graficoSexoAlunos?: Array<any>;
    boxplotIdade?: Array<any>;
    taxaMatriculas?: Array<any>;
    taxaMatriculasCota?: Array<any>;
  };

  export type Coordenador = {
    coordenador_masp: number;
    coordenador_nome: string;
    carga_horaria: number;
  };
  
  export type ResidenciaEspecializacao = {
    id: number;
    nome: string;
    data_inicio: string; 
    data_termino: string; 
    vagas_ofertadas: number;
    vagas_preenchidas: number;
    categoria_profissional: string;
    centro: string;
    r1: number; 
    r2: number; 
    r3: number; 
    especialista: number;
  };
  
  export type Professor = {
    id: number;
    nome: string;
    vinculo: string;
    titulacao: string;
    carga_horaria_jornada_extendida: number;
    carga_horaria_projeto_extencao: number;
    carga_horaria_projeto_pesquisa: number;
    carga_horaria_total: number;
  };
  
  export type JsonFormulario = {
    data_preenchimento: string;
    coordenador: Coordenador;
    residencia_especializacao: ResidenciaEspecializacao;
    professores: Professor[];
  };
  
  export type UpdateFormularioItem = {
    nome: string;
    json: JsonFormulario; 
  };
  
  export type FormularioParams  = {
    item: UpdateFormularioItem;
  };
  
  export type UpdateFormularioParams = FormularioParams;
  export type InsertFormularioParams = FormularioParams;

  export type GetIndicadoresFormularioParams = {
    nome_formulario: any;
    data_inicio: any;
  }

  export type DeleteFormularioParams = {
    nome_formulario: any;
    data_inicio: any;
  }

  export type SearchRegistrosFormularioParams = {
    masp: any;
    tipo: any;
  }