"use server";
import { GradDisciplinasRequest, GradRequest } from "@/protos/messages_pb";
import { stubIndicadores } from "../utils";
import { toApiResponse } from "@/lib/utils";
import {
  AbaDisciplinasParams,
  AbaEgressosParams,
  AbaIndicadoresCursoParams,
  AbaProfessoresParams,
  IndicadoresGlobaisParams,
  IndicadoresDisciplinaParams,
} from "../types";

export async function getAbaIndicadoresCurso({
  idCurso,
  idIes,
  anoFinal,
  anoInicial,
}: AbaIndicadoresCursoParams) {
  try {
    const gradRequest = new GradRequest();

    gradRequest.setId(idCurso);
    gradRequest.setIdIes(idIes);
    gradRequest.setAnoi(anoInicial);
    gradRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubIndicadores.getAbaIndicadoresCurso(
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
  idGrade,
}: AbaDisciplinasParams) {
  try {
    const gradRequest = new GradDisciplinasRequest();

    gradRequest.setIdDisc(idDisc);
    gradRequest.setIdCurso(idCurso);
    gradRequest.setIdGrade(idGrade);
    gradRequest.setIdIes(idIes);

    const response = await new Promise((resolve, reject) => {
      stubIndicadores.getAbaDisciplinas(gradRequest, (error, indicadores) => {
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
  idGrade,
  anoInicial,
  anoFinal,
}: IndicadoresDisciplinaParams) {
  try {
    const gradRequest = new GradDisciplinasRequest();

    gradRequest.setIdDisc(idDisc);
    gradRequest.setIdCurso(idCurso);
    gradRequest.setIdGrade(idGrade);
    gradRequest.setIdIes(idIes);
    gradRequest.setAnoi(anoInicial && Number(anoInicial));
    gradRequest.setAnof(anoFinal && Number(anoFinal));

    const response = await new Promise((resolve, reject) => {
      stubIndicadores.getIndicadoresDisciplina(
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

export async function getAbaEgressos({
  idCurso,
  idIes,
  anoInicial,
  anoFinal,
}: AbaEgressosParams) {
  try {
    const gradRequest = new GradRequest();

    gradRequest.setId(idCurso);
    gradRequest.setIdIes(idIes);
    gradRequest.setAnoi(anoInicial);
    gradRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubIndicadores.getAbaEgressos(gradRequest, (error, indicadores) => {
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
    const gradRequest = new GradRequest();

    gradRequest.setId(idCurso);
    gradRequest.setIdIes(idIes);
    gradRequest.setAnoi(anoInicial);
    gradRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubIndicadores.getAbaProfessores(gradRequest, (error, indicadores) => {
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
  anoFinal,
}: IndicadoresGlobaisParams) {
  try {
    const gradRequest = new GradRequest();

    gradRequest.setIdIes(idIes);
    gradRequest.setAnoi(anoInicial);
    gradRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubIndicadores.getIndicadoresGlobais(
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
