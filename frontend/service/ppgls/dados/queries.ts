import { useFetcher } from "../hooks";
import {
  GetCursoParams,
  GetCursosParams,
  GetDisciplinaParams,
  GetDisciplinasParams,
  
} from "../types";
import { getCurso, getCursos, getDisciplina, getDisciplinas, getCursosPPGLSForm } from "./service";

export const useGetCursos = ({ idIes }: GetCursosParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => getCursos({ idIes }),
    depencencies: [],
  });

  return { data, isLoading, error };
};

export const useGetCursosPPGLSForm = ({ idIes }: GetCursosParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => getCursosPPGLSForm({ idIes }),
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
  idIes,
}: GetDisciplinasParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => getDisciplinas({ idIes, idCurso}),
    depencencies: [],
  });

  return { data, isLoading, error };
};

export const useGetDisciplina = ({
  idCurso,
  idIes,
  idDisc,
}: GetDisciplinaParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => getDisciplina({ idIes, idCurso, idDisc }),
    depencencies: [idDisc],
  });

  return { data, isLoading, error };
};

