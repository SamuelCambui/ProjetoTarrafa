"use server";

import { stubHome, toApiResponse } from "@/app/api/ppg/utils";
import { HomeRequest } from "@/protos/messages_pb";
import { ServiceError } from "@grpc/grpc-js";

export async function obterProgramas(idIes: string): Promise<any> {
  try {
    const homeRequest = new HomeRequest();
    homeRequest.setIdIes(idIes);

    
    const response = await new Promise((resolve, reject) => {
      stubHome.obtemProgramas(
        homeRequest,
        (error: ServiceError | null, resposta: any) => {
          if (error) {
            reject(error);
          } else {
            const dadosObj: Object = resposta.toObject();
            resolve(toApiResponse([dadosObj]));
          }
        }
      );
    });

    return response;
  } catch (e) {
    console.error(e);
    throw new Error("Erro ao processar a solicitação em getProgramas");
  }
}

export async function obterRedeColaboracao(idIes: string, produto: string, fonte: string, aresta: string,   anoInicio: number, 
  anoFim: number): Promise<any> {
  try {
    const homeRequest = new HomeRequest();
    homeRequest.setIdIes(idIes);
    homeRequest.setProduto(produto);
    homeRequest.setFonte(fonte);
    homeRequest.setAresta(aresta);
    homeRequest.setAnoi(anoInicio)
    homeRequest.setAnof(anoFim)

    const response = await new Promise((resolve, reject) => {
      stubHome.obtemRedeColaboracao(
        homeRequest,
        (error: ServiceError | null, resultado: any) => {
          if (error) {
            reject(error);
          } else {
            const dadosObj: Object = resultado.toObject();
            resolve(toApiResponse([dadosObj]));
          }
        }
      );
    });

    return response;
  } catch (e) {
    console.error(e);
    throw new Error("Erro ao processar a solicitação em getRedeColaboracao");
  }
}

export async function obterRankingDocentes(idIes: string): Promise<any> {
  try {
    const homeRequest = new HomeRequest();
    homeRequest.setIdIes(idIes);

    const response = await new Promise((resolve, reject) => {
      stubHome.obtemRankingDocentes(
        homeRequest,
        (error: ServiceError | null, result: any) => {
          if (error) {
            reject(error);
          } else {
            const dadosObj : Object = result.toObject();
            resolve(toApiResponse([dadosObj]));
          }
        }
      );
    });

    return response;
  } catch (e) {
    console.error(e);
    throw new Error("Erro ao processar a solicitação em getRankingDocentes");
  }
}

export async function obterArtigosDocentes(
  idIes: string,
  ano: number
): Promise<any> {
  try {
    const homeRequest = new HomeRequest();
    homeRequest.setIdIes(idIes);
    homeRequest.setAnoi(ano);

    const response = await new Promise((resolve, reject) => {
      stubHome.obtemArtigosDocentes(
        homeRequest,
        (error: ServiceError | null, result: any) => {
          if (error) {
            reject(error);
          } else {
            const dadosObj = result.toObject();
            resolve(toApiResponse([dadosObj]));
          }
        }
      );
    });

    return response;
  } catch (e) {
    console.error(e);
    throw new Error("Erro ao processar a solicitação em getArtigosDocentes");
  }
}
