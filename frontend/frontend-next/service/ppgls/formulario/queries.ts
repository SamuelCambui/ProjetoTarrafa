import { useFetcher } from "../hooks";
import {
  GetIndicadoresFormularioParams,
  SearchRegistrosFormularioParams,
  InsertFormularioParams,
  UpdateFormularioParams,
  DeleteFormularioParams
} from "../types";
import {
  GetIndicadoresFormulario,
  searchRegistrosFormulario,
  insertFormulario,
  updateFormulario,
  deleteFormulario
} from "./service";


export const useGetIndicadoresFormulario = ({ nome_formulario, data_inicio }: GetIndicadoresFormularioParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => GetIndicadoresFormulario({ nome_formulario, data_inicio }),
    depencencies: [nome_formulario, data_inicio],
  });

  return { data, isLoading, error };
};


export const useSearchRegistrosFormulario = ({ masp, tipo }: SearchRegistrosFormularioParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => searchRegistrosFormulario({ masp, tipo }),
    depencencies: [masp, tipo],
  });

  return { data, isLoading, error };
};

// Hook para inserir um novo formulário
export const useInsertFormulario = ({ item }: InsertFormularioParams): { 
  data: any | null; 
  isLoading: boolean; 
  error: any | null; 
} => {
  try {
    const { data, isLoading, error } = useFetcher({
      callback: () => insertFormulario({ item }),
      depencencies: [item],
    });

    if (error) {
      console.error("Erro ao inserir formulário:", error);
    }

    return { data, isLoading, error };

  } catch (err) {
    console.error("Erro inesperado em useInsertFormulario:", err);
    return { data: null, isLoading: false, error: err };
  }
};




export const useUpdateFormulario = ({ item }: UpdateFormularioParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => updateFormulario({ item }),
    depencencies: [item],
  });

  return { data, isLoading, error };
};


export const useDeleteFormulario = ({ nome_formulario, data_inicio }: DeleteFormularioParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: () => deleteFormulario({ nome_formulario, data_inicio}),
    depencencies: [nome_formulario, data_inicio],
  });

  return { data, isLoading, error };
};
