"use server";
import { PPGLSRequest } from "@/protos/messages_pb";
import { stubIndicadoresPPGLS, toApiResponse } from "../utils";
import {
  AbaDisciplinasParams,
  AbaEgressosParams,
  AbaIndicadoresCursoParams,
  AbaProfessoresParams,
  IndicadoresGlobaisParams ,
  IndicadoresDisciplinaParams,
} from "../types";

export async function getAbaIndicadoresCurso({
  idCurso,
  idIes,
  anoFinal,
  anoInicial,
}: AbaIndicadoresCursoParams) {
  try {
    const gradRequest = new PPGLSRequest();
    gradRequest.setIdCurso(idCurso);
    gradRequest.setIdIes(idIes);
    gradRequest.setAnoi(anoInicial);
    gradRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubIndicadoresPPGLS.getAbaIndicadoresCurso(
        gradRequest,
        (error, indicadores) => {
          if (error) {
            reject(error); // Rejeita a promise em caso de erro
          } else {
            const data = indicadores.toObject()["itemList"];

            resolve(toApiResponse(data)); // Resolve a promise com os indicadores
          }
        },
      );
    });

    return response;
  } catch (e) {
    console.error(e);
    new Error();
  }
}

export async function getAbaDisciplinas({
  idDisc,
  idCurso,
  idIes,
}: AbaDisciplinasParams) {
  try {
    const gradRequest = new PPGLSRequest();

    gradRequest.setIdDisc(idDisc);
    gradRequest.setIdCurso(idCurso);
    gradRequest.setIdIes(idIes);

    const response = await new Promise((resolve, reject) => {
      stubIndicadoresPPGLS.getAbaDisciplinas(gradRequest, (error, indicadores) => {
        if (error) {
          reject(error); // Rejeita a promise em caso de erro
        } else {
          const data = indicadores.toObject()["itemList"];

          resolve(toApiResponse(data)); // Resolve a promise com os indicadores
        }
      });
    });

    return response;
  } catch (e) {
    console.error(e);
    new Error();
  }
}

export async function getIndicadoresDisciplina({
  idDisc,
  idCurso,
  idIes,
  anoInicial,
  anoFinal,
}: IndicadoresDisciplinaParams) {
  try {
    const gradRequest = new PPGLSRequest();

    gradRequest.setIdDisc(idDisc);
    gradRequest.setIdCurso(idCurso);
    gradRequest.setIdIes(idIes);
    gradRequest.setAnoi(anoInicial && Number(anoInicial));
    gradRequest.setAnof(anoFinal && Number(anoFinal));

    const response = await new Promise((resolve, reject) => {
      stubIndicadoresPPGLS.getIndicadoresDisciplina(
        gradRequest,
        (error, indicadores) => {
          if (error) {
            reject(error); // Rejeita a promise em caso de erro
          } else {
            const data = indicadores.toObject()["itemList"];

            resolve(toApiResponse(data)); // Resolve a promise com os indicadores
          }
        },
      );
    });

    return response;
  } catch (e) {
    console.error(e);
    new Error();
  }
}

export async function getAbaRegressos({
  idCurso,
  idIes,
  anoInicial,
  anoFinal,
}: AbaEgressosParams) {
  try {
    const gradRequest = new PPGLSRequest();

    gradRequest.setIdCurso(idCurso);
    gradRequest.setIdIes(idIes);
    gradRequest.setAnoi(anoInicial);
    gradRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubIndicadoresPPGLS.getAbaRegressos(gradRequest, (error, indicadores) => {
        if (error) {
          reject(error); // Rejeita a promise em caso de erro
        } else {
          const data = indicadores.toObject()["itemList"];

          resolve(toApiResponse(data)); // Resolve a promise com os indicadores
        }
      });
    });

    return response;
  } catch (e) {
    console.error(e);
    new Error();
  }
}

export async function getAbaProfessores({
  idCurso,
  idIes,
  anoInicial,
  anoFinal,
}: AbaProfessoresParams) {
  try {
    const gradRequest = new PPGLSRequest();

    gradRequest.setIdCurso(idCurso);
    gradRequest.setIdIes(idIes);
    gradRequest.setAnoi(anoInicial);
    gradRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubIndicadoresPPGLS.getAbaProfessores(gradRequest, (error, indicadores) => {
        if (error) {
          reject(error); // Rejeita a promise em caso de erro
        } else {
          const data = indicadores.toObject()["itemList"];

          resolve(toApiResponse(data)); // Resolve a promise com os indicadores
        }
      });
    });

    return response;
  } catch (e) {
    console.error(e);
    new Error();
  }
}

export async function getIndicadoresGlobais({
  idIes,
  anoInicial,
  anoFinal
}: IndicadoresGlobaisParams){
  try {
    const gradRequest = new PPGLSRequest();

    gradRequest.setIdIes(idIes);
    gradRequest.setAnoi(anoInicial);
    gradRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubIndicadoresPPGLS.getIndicadoresGlobais(gradRequest, (error, indicadores) => {
        if (error) {
          reject(error); // Rejeita a promise em caso de erro
        } else {
          const data = indicadores.toObject()["itemList"];

          resolve(toApiResponse(data)); // Resolve a promise com os indicadores
        }
      });
    });

    return response;
  } catch (e) {
    console.error(e);
    new Error();
  }
}
