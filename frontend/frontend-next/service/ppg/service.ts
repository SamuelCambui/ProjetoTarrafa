"use server";
import { stubPPG, toApiResponse } from "@/app/api/ppg/utils";
import { PpgRequest } from "@/protos/messages_pb";

export async function getAbaIndicadoresPpg(
  id: string,
  idIes: string,
  anoInicial: number,
  anoFinal: number,
) {
  try {
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes(idIes);
    ppgRequest.setIdPpg(id);
    ppgRequest.setAnoi(anoInicial);
    ppgRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubPPG.getAbaIndicadoresCurso(
        ppgRequest,
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