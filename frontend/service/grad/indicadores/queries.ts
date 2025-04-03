import {
  getAbaDisciplinas,
  getAbaEgressos,
  getAbaIndicadoresCurso,
  getAbaProfessores,
  getIndicadoresDisciplina,
  getIndicadoresGlobais,
} from "./service";
import { useFetcher } from "../hooks";
import {
  AbaDisciplinasParams,
  AbaEgressosParams,
  AbaIndicadoresCursoParams,
  AbaProfessoresParams,
  IndicadoresDisciplinaParams,
  IndicadoresDisciplinaResponse,
  IndicadoresGlobaisParams,
  IndicadoresGlobaisResponse,
} from "../types";

export const useAbaIndicadoresCurso = ({
  idCurso,
  idIes,
  anoInicial,
  anoFinal,
}: AbaIndicadoresCursoParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () =>
      getAbaIndicadoresCurso({ idCurso, idIes, anoInicial, anoFinal }),
    depencencies: [anoInicial, anoFinal],
  });

  return { data, isLoading, error };
};

export const useAbaDisciplinas = ({
  idCurso,
  idGrade,
  idIes,
}: AbaDisciplinasParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => getAbaDisciplinas({ idCurso, idIes, idGrade }),
    depencencies: [idGrade],
  });

  return { data, isLoading, error };
};

export const useAbaEgressos = ({
  idCurso,
  idIes,
  anoInicial,
  anoFinal,
}: AbaEgressosParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => getAbaEgressos({ idCurso, idIes, anoInicial, anoFinal }),
    depencencies: [anoInicial, anoFinal],
  });

  return { data, isLoading, error };
};

export const useAbaProfessores = ({
  idCurso,
  idIes,
  anoInicial,
  anoFinal,
}: AbaProfessoresParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => getAbaProfessores({ idCurso, idIes, anoInicial, anoFinal }),
    depencencies: [anoInicial, anoFinal],
  });

  return { data, isLoading, error };
};

export const useIndicadoresDisciplina = ({
  idDisc,
  idCurso,
  idGrade,
  idIes,
  anoInicial,
  anoFinal,
}: IndicadoresDisciplinaParams) => {
  const { data, isLoading, error } = useFetcher<IndicadoresDisciplinaResponse>({
    callback: () =>
      getIndicadoresDisciplina({
        idDisc,
        idCurso,
        idGrade,
        idIes,
        anoInicial,
        anoFinal,
      }),
    depencencies: [idDisc, anoInicial, anoFinal],
  });

  return { data, isLoading, error };
};

export const useIndicadoresGlobais = ({
  idIes,
  anoInicial,
  anoFinal,
}: IndicadoresGlobaisParams) => {
  const { data, error, isLoading } = useFetcher<IndicadoresGlobaisResponse>({
    callback: () =>
      getIndicadoresGlobais({
        idIes,
        anoInicial,
        anoFinal,
      }),
    depencencies: [anoInicial, anoFinal],
  });
  return { data, error, isLoading };
};
