"use server";
import { GradDisciplinasRequest, GradRequest } from "@/protos/messages_pb";
import { stubIndicadores, toApiResponse } from "./utils";

export async function getAbaIndicadoresCurso(
  id: string,
  idIes: string,
  anoInicial: number,
  anoFinal: number,
) {
  try {
    const gradRequest = new GradRequest();

    gradRequest.setId(id);
    gradRequest.setIdIes(idIes);
    gradRequest.setAnoi(anoInicial);
    gradRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubIndicadores.getAbaIndicadoresCurso(
        gradRequest,
        (error, indicadores) => {
          debugger;
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
    console.log(e);
    new Error();
  }
}

interface IndicadoresDisciplinasRequest {
  idDisc: any;
  idCurso: any;
  idGrade: any;
  idIes: any;
  anoInicial: any;
  anoFinal: any;
}

export async function getAbaDisciplinas({
  idDisc,
  idCurso,
  idIes,
  idGrade,
  anoInicial,
  anoFinal,
}: IndicadoresDisciplinasRequest) {
  try {
    const gradRequest = new GradDisciplinasRequest();

    gradRequest.setIdDisc(idDisc as string);
    gradRequest.setIdCurso(idCurso as string);
    gradRequest.setIdGrade(idGrade as string);
    gradRequest.setIdIes(idIes as string);
    gradRequest.setAnoi(anoInicial && Number(anoInicial));
    gradRequest.setAnof(anoFinal && Number(anoFinal));

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
    console.log(e);
    new Error();
  }
}
