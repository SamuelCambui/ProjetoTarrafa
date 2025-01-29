"use server";
import {
  UpdateFormularioParams,
  InsertFormularioParams,
  GetIndicadoresFormularioParams,
  DeleteFormularioParams,
  SearchRegistrosFormularioParams,

} from "../types";
import { stubFormularioPPGLS, toApiResponse } from "../utils";
import { FormularioSerchPPGLSRequest, FormularioPPGLSRequest, FormularioIndicadoresRequest } from "@/protos/messages_pb";
import { FormularioPPGLSJson } from "@/protos/messages_pb";

export async function GetIndicadoresFormulario({
    nome_formulario, 
    data_inicio,
}: GetIndicadoresFormularioParams) {
  try {
    const request = new FormularioIndicadoresRequest();
    request.setNomeFormulario(nome_formulario);
    request.setDataInicio(data_inicio)

    const response = await new Promise((resolve, reject) => {
      stubFormularioPPGLS.getIndicadoresFormulario(request, (error, indicadores) => {
        if (error) {
          reject(error);
        } else {
          const data = indicadores.toObject();
          resolve(toApiResponse(data));
        }
      });
    });

    return response;
  } catch (e) {
    console.error(e);
    throw new Error("Erro ao buscar indicadores do formulário.");
  }
}

export async function searchRegistrosFormulario({ 
    masp, 
    tipo 
}: SearchRegistrosFormularioParams) {
  try {
    const request = new FormularioSerchPPGLSRequest();
    request.setMasp(masp);
    request.setTipo(tipo);

    const response = await new Promise((resolve, reject) => {
        stubFormularioPPGLS.searchRegistrosFormualario(request, (error, registros) => {
        if (error) {
          reject(error);
        } else {
          const data = registros.toObject();
          resolve(toApiResponse(data));
        }
      });
    });

    return response;
  } catch (e) {
    console.error(e);
    throw new Error("Erro ao buscar registros do formulário.");
  }
}

export async function insertFormulario({ item }: InsertFormularioParams) {
    try {
      const request = new FormularioPPGLSRequest();
  
      // Adicionando o item à lista de items no request
      const formularioJson = new FormularioPPGLSJson();
      formularioJson.setNome(item.nome);
      formularioJson.setJson(JSON.stringify(item.json));
  
      request.addItem(formularioJson); // Adiciona o item à lista
  
      const response = await new Promise((resolve, reject) => {
        stubFormularioPPGLS.insertFormulario(request, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(toApiResponse(response.toObject()));
          }
        });
      });
  
      return response;
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao inserir formulário.");
    }
  }

  export async function updateFormulario({ item }: UpdateFormularioParams) {
    try {
      const request = new FormularioPPGLSRequest();
  
      // Adicionando o item à lista de items no request
      const formularioJson = new FormularioPPGLSJson();
      formularioJson.setNome(item.nome);
      formularioJson.setJson(JSON.stringify(item.json));
  
      request.addItem(formularioJson); // Adiciona o item à lista
  
      const response = await new Promise((resolve, reject) => {
        stubFormularioPPGLS.updateFormulario(request, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(toApiResponse(response.toObject()));
          }
        });
      });
  
      return response;
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao atualizar formulário.");
    }
  }

  export async function deleteFormulario({
    nome_formulario,
    data_inicio,
  }: DeleteFormularioParams) {
    try {
      const request = new FormularioIndicadoresRequest();
      request.setNomeFormulario(nome_formulario);
      request.setDataInicio(data_inicio);
  
      const response = await new Promise((resolve, reject) => {
        stubFormularioPPGLS.deleteFormulario(request, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(toApiResponse(response.toObject()));
          }
        });
      });
  
      return response;
    } catch (e) {
      console.error(e);
      throw new Error("Erro ao excluir formulário.");
    }
  }

