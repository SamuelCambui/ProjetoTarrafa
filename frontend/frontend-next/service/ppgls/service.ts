"use server";
import { FormularioSerchPPGLSRequest, PPGLSRequest, FormularioIndicadoresRequest, FormularioPPGLSRequest} from "@/protos/messages_pb";
import { stubIndicadoresPPGLS,stubDadosPPGLS,stubFormularioPPGLS, toApiResponse } from "./utils";

export async function getAbaIndicadoresCurso(
  id: string,
  idIes: string,
  anoInicial: number,
  anoFinal: number,
) {
  try {
    const gradRequest = new PPGLSRequest();

    gradRequest.setIdCurso(id);
    gradRequest.setIdIes(idIes);
    gradRequest.setAnoi(anoInicial);
    gradRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubIndicadoresPPGLS.getAbaIndicadoresCurso(
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
    const gradRequest = new PPGLSRequest();

    gradRequest.setIdDisc(idDisc as string);
    gradRequest.setIdCurso(idCurso as string);
    gradRequest.setIdGrade(idGrade as string);
    gradRequest.setIdIes(idIes as string);
    gradRequest.setAnoi(anoInicial && Number(anoInicial));
    gradRequest.setAnof(anoFinal && Number(anoFinal));

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
    console.log(e);
    new Error();
  }
}

export async function getAbaRegressos(idCurso: string, idIes: string, anoInicial: number, anoFinal: number) {
  try {
    const request = new PPGLSRequest();
    request.setIdCurso(idCurso);
    request.setIdIes(idIes);
    request.setAnoi(anoInicial);
    request.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubIndicadoresPPGLS.getAbaRegressos(request, (error, result) => {
        if (error) reject(error);
        else resolve(toApiResponse(result.toObject()["itemList"]));
      });
    });

    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao obter dados de regressos.");
  }
}

