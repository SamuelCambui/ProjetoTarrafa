import {
  GetIndicadoresFormularioParams,
  InsertFormularioParams,
  DeleteFormularioParams
} from "../types";
import {
  GetIndicadoresFormulario,
  insertFormulario,
  deleteFormulario,
  listarFormularios,

} from "./service";
import { useFetcher } from "../hooks";

// Função para obter indicadores do formulário
export const useGetIndicadoresFormulario = ({
  nome_formulario,
  data_preenchimento,
}: GetIndicadoresFormularioParams) => {
  const { data, isLoading, error } = useFetcher({
    callback: async () => {
      const response = await GetIndicadoresFormulario({ nome_formulario, data_preenchimento });

      console.log("Resposta crua da API:", response);

      if (!response || Object.keys(response).length === 0) {
        console.error("Erro: resposta vazia da API", response);
        return {}; // Retorna um objeto vazio para evitar erros
      }

      return response; // Retorna a resposta normalmente
    },
    depencencies: [nome_formulario, data_preenchimento],
  });

  console.log("Resposta final processada:", data);

  return { data, isLoading, error };
};

// Função para inserir um novo formulário
export const insertFormularioData = async ({ item }: InsertFormularioParams) => {
  try {
    return await insertFormulario({ item });
  } catch (error) {
    console.error("Erro ao inserir formulário:", error);
    alert(`Erro ao submeter o formulário: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    throw error;
  }
};

// Função para excluir um formulário
export const deleteFormularioData = async ({ nome_formulario, data_inicio }: DeleteFormularioParams) => {
  try {
    return await deleteFormulario({ nome_formulario, data_inicio });
  } catch (error) {
    console.error("Erro ao excluir formulário:", error);
    throw error;
  }
};

export const useListarFormularios = () => {
  console.log("Chamando listarFormularios...");
  const { data, isLoading, error } = useFetcher({
    callback: () => listarFormularios(),
    depencencies: [], // Sem dependências, executa uma vez
  });
  console.log("Resposta da API em useListarFormularios:", data);

  return { data, isLoading, error };
};
