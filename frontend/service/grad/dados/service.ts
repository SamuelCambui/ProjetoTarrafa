"use server";
import {
  GetCursoParams,
  GetCursosParams,
  GetDisciplinasParams,
} from "../types";
import { stubDados } from "../utils";
import { toApiResponse } from "@/lib/utils";
import { GradRequest, GradDisciplinasRequest } from "@/protos/messages_pb";

export async function getCursos({ idIes }: GetCursosParams) {
  try {
    const gradRequest = new GradRequest();

    gradRequest.setIdIes(idIes);

    const response = await new Promise((resolve, reject) => {
      stubDados.getCursos(gradRequest, (error, indicadores) => {
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

export async function getCurso({ idCurso, idIes }: GetCursoParams) {
  try {
    const gradRequest = new GradRequest();
    gradRequest.setIdIes(idIes);

    gradRequest.setId(idCurso);
    const response = await new Promise((resolve, reject) => {
      stubDados.getCurso(gradRequest, (error, indicadores) => {
        if (error) {
          reject(error); // Rejeita a promise em caso de erro
        } else {
          const data = indicadores.toObject()["itemList"];

          resolve(toApiResponse(data)["dadosCurso"]); // Resolve a promise com os indicadores
        }
      });
    });

    return response;
  } catch (e) {
    console.error(e);
    new Error();
  }
}

export async function getDisciplinas({
  idCurso,
  idIes,
  idGrade,
}: GetDisciplinasParams) {
  try {
    const gradRequest = new GradDisciplinasRequest();
    gradRequest.setIdIes(idIes);
    gradRequest.setIdCurso(idCurso);
    gradRequest.setIdGrade(idGrade);

    const response = await new Promise((resolve, reject) => {
      stubDados.getDisciplinas(gradRequest, (error, indicadores) => {
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

export async function getDisciplina({
  idDisc,
  idCurso,
  idIes,
  idGrade,
}: GetDisciplinasParams) {
  try {
    const gradRequest = new GradDisciplinasRequest();
    gradRequest.setIdIes(idIes);
    gradRequest.setIdDisc(idDisc);
    gradRequest.setIdCurso(idCurso);
    gradRequest.setIdGrade(idGrade);

    const response = await new Promise((resolve, reject) => {
      stubDados.getDisciplina(gradRequest, (error, indicadores) => {
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
