

import { useFetcher } from "../hooks";
import {
  GetCursoParams,
  GetCursosParams,
  GetDisciplinaParams,
  GetDisciplinasParams,
} from "../types";
import { getCurso, getCursos, getDisciplina, getDisciplinas } from "./service";

export const useGetCursos = ({ idIes }: GetCursosParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => getCursos({ idIes }),
    depencencies: [],
  });

  return { data, isLoading, error };
};

export const useGetCurso = ({ idCurso, idIes }: GetCursoParams) => {
  const { data, isLoading, error } = useFetcher<{
    id: string;
    id_ies: string;
    nome: string;
    grau: number;
    freq_min_aprovacao: number;
    nota_min_aprovacao: number;
    serie_inicial: number;
    serie_final: number;
  }>({
    callback: () => getCurso({ idIes, idCurso }),
    depencencies: [],
  });

  return { data, isLoading, error };
};

export const useGetDisciplinas = ({
  idCurso,
  idGrade,
  idIes,
}: GetDisciplinasParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => getDisciplinas({ idIes, idCurso, idGrade }),
    depencencies: [idGrade],
  });

  return { data, isLoading, error };
};

export const useGetDisciplina = ({
  idCurso,
  idGrade,
  idIes,
  idDisc,
}: GetDisciplinaParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => getDisciplina({ idIes, idCurso, idGrade, idDisc }),
    depencencies: [idDisc, idGrade],
  });

  return { data, isLoading, error };
};
