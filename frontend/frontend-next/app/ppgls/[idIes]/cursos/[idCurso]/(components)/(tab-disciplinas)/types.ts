import { GraficoProps, TabProps } from "../types";

export type Grade = { id_grade: string; semestre_letivo: string };

export type Disciplina = {
  cod_disc: string;
  nome: string;
  abreviacao: string;
  carga_horaria: number;
  departamento: string;
};

export type TabDisciplinasProps = TabProps & {
  serieFinal?: any;
};

type DataBoxplot = {
  [key: `boxplotNotasGradeSerie${number}`]: any; // Define as chaves dinamicamente
};

type DataReprovacoes = {
  [key: `aprovacoesReprovacoesSerie${number}`]: any; // Chaves dinâmicas
};

export type TabsBoxplotProps = GraficoProps & {
  data: DataBoxplot; // Define o tipo para o objeto `data`
  isLoading?: boolean;
  serieFinal?: number; 
};

export type TabsReprovacoesProps = Omit<TabsBoxplotProps, "data"> & {
  data: DataReprovacoes; 
  isLoading?: boolean;
  serieFinal?: number; // Ajuste o tipo para evitar `any`
}

export type SecaoIndicadoresDisciplina = {
  idCurso?: any;
  idIes?: any;
  disciplinas?: Disciplina[];
  idGrade?: any;
};

