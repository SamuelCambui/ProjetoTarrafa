"use server";
import {
  GetCursoParams,
  GetCursosParams,
  GetDisciplinasParams,
} from "../types";
import { stubDadosPPGLS, toApiResponse } from "../utils";
import { PPGLSRequest } from "@/protos/messages_pb";

export async function getCursos({ idIes }: GetCursosParams) {
  try {
    const gradRequest = new PPGLSRequest();

    gradRequest.setIdIes(idIes);

    const response = await new Promise((resolve, reject) => {
        stubDadosPPGLS.getCursos(gradRequest, (error, indicadores) => {
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


export async function getCursosPPGLSForm({ idIes }: GetCursosParams) {
  try {
    const gradRequest = new PPGLSRequest();

    gradRequest.setIdIes(idIes);

    const response = await new Promise((resolve, reject) => {
        stubDadosPPGLS.getCursosPPGLSForm(gradRequest, (error, indicadores) => {
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
    const gradRequest = new PPGLSRequest();
    gradRequest.setIdIes(idIes);
    gradRequest.setIdCurso(idCurso);
    const response = await new Promise((resolve, reject) => {
        stubDadosPPGLS.getCurso(gradRequest, (error, indicadores) => {
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
}: GetDisciplinasParams) {
  try {
    const gradRequest = new PPGLSRequest();
    gradRequest.setIdIes(idIes);
    gradRequest.setIdCurso(idCurso);

    const response = await new Promise((resolve, reject) => {
        stubDadosPPGLS.getDisciplinas(gradRequest, (error, indicadores) => {
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

}: GetDisciplinasParams) {
  try {
    const gradRequest = new PPGLSRequest();
    gradRequest.setIdIes(idIes);
    gradRequest.setIdDisc(idDisc);
    gradRequest.setIdCurso(idCurso);


    const response = await new Promise((resolve, reject) => {
        stubDadosPPGLS.getDisciplina(gradRequest, (error, indicadores) => {
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
