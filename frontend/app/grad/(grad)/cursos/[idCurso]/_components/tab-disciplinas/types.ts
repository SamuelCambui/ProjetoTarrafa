import { TabProps } from "../types";
import { GraficoProps } from "@/app/grad/_components/types";

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

export type TabsBoxplotProps = GraficoProps & {
  data?: any;
  serieFinal?: any;
};

export type SecaoIndicadoresDisciplina = {
  idCurso?: any;
  idIes?: any;
  disciplinas?: Disciplina[];
  idGrade?: any;
};
