"use server";
import {
  InsertFormularioParams,
  GetIndicadoresFormularioParams,
  DeleteFormularioParams,

} from "../types";
import { stubFormularioPPGLS, toApiResponse } from "../utils";
import { FormularioPPGLSRequest, FormularioIndicadoresRequest } from "@/protos/messages_pb";
import { FormularioPPGLSJson, Empty } from "@/protos/messages_pb";

export async function GetIndicadoresFormulario({
  nome_formulario, 
  data_preenchimento,
}: GetIndicadoresFormularioParams) {
  try {
    console.log("Função GetIndicadoresFormulario() foi chamada.");
    
    const request = new FormularioIndicadoresRequest();
    request.setNomeFormulario(nome_formulario);
    request.setDataPreenchimento(data_preenchimento);

    console.log("Enviando requisição para getIndicadoresFormulario...", request);

    const response = await new Promise((resolve, reject) => {
      stubFormularioPPGLS.getIndicadoresFormulario(request, (error, indicadores) => {
        console.log("Entrou no callback do gRPC...");

        if (error) {
          console.error("Erro na chamada gRPC:", error);
          reject(error);
        } else {
          console.log("Resposta bruta do gRPC:", indicadores);
          
          const data = indicadores.toObject();
          console.log("Resposta do gRPC após .toObject():", data);

          // Extraindo itemList
          const itemList = data?.itemList || [];
          let jsonData = {};

          if (itemList.length > 0) {
            try {
              jsonData = JSON.parse(itemList[0].json); // Convertendo JSON string para objeto
            } catch (e) {
              console.error("Erro ao converter JSON:", e);
            }
          }

          console.log("Dados convertidos do JSON:", jsonData);
          resolve(jsonData);
        }
      });
    });

    console.log("Resposta final da API:", response);
    return response;

  } catch (e) {
    console.error("Erro ao buscar indicadores do formulário:", e);
    throw new Error("Erro ao buscar indicadores do formulário.");
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

  export async function listarFormularios() {
    console.log("Função listarFormularios() foi chamada.");
    try {
        const request = new Empty(); // Requisição vazia
        console.log("Enviando requisição para listarFormularios...");

        const response = await new Promise((resolve, reject) => {
            stubFormularioPPGLS.listarFormularios(request, (error, response) => {
                console.log("Entrou no callback do gRPC...");

                if (error) {
                    console.error("Erro na chamada gRPC:", error);
                    reject(error);
                } else {
                    console.log("Resposta bruta do gRPC:", response);
                    const responseObject = response.toObject();
                    console.log("Resposta do gRPC após .toObject():", responseObject);

                    // Extraindo itemList
                    const itemList = responseObject?.itemList || [];
                    let jsonData = {};

                    if (itemList && itemList.length > 0) {
                        try {
                          jsonData = JSON.parse(itemList[0].json); // Convertendo JSON string para objeto
                        } catch (e) {
                            console.error("Erro ao converter JSON:", e);
                        }
                    }

                    console.log("Dados convertidos do JSON:", jsonData);
                    resolve(jsonData);
                }
            });
        });

        console.log("Resposta final da API:", response);
        return response;

    } catch (e) {
        console.error("Erro ao listar formulários:", e);
        throw new Error("Erro ao listar formulários.");
    }
  }


