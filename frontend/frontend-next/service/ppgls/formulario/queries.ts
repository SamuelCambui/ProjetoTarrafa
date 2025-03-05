import {
  GetIndicadoresFormularioParams,
  InsertFormularioParams,
  DeleteFormularioParams
} from "../types";
import {
  GetIndicadoresFormulario,
  insertFormulario,
  deleteFormulario
} from "./service";

// Função para obter indicadores do formulário
export const getIndicadoresFormulario = async ({ nome_formulario, data_inicio }: GetIndicadoresFormularioParams) => {
  try {
    return await GetIndicadoresFormulario({ nome_formulario, data_inicio });
  } catch (error) {
    console.error("Erro ao obter indicadores do formulário:", error);
    throw error;
  }
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
