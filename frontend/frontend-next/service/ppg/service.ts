"use server";
import { stubHome, stubPPG, toApiResponse } from "@/app/api/ppg/utils";
import { HomeRequest } from "@/protos/messages_pb";
import { PpgRequest } from "@/protos/messages_pb";

export async function getDadosHome(idIes: string) {
  try {
    const homeRequest = new HomeRequest();

    homeRequest.setIdIes(idIes);

    const response = await new Promise((resolve, reject) => {
      stubHome.obtemProgramas(homeRequest, (error: any, listaprogramas: any) => {
        if (error) {
          reject(error);
        } else {
          const dadosObj = listaprogramas.toObject()["json"];
          resolve(toApiResponse(dadosObj));
          console.log("PRONTO")
        }
      });
    });

    return response;
  } catch (e) {
    console.log(e);
    new Error();
  }
}

export async function getDadosIndicadores(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
  nota: string
) {
  try {
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes("3727");
    ppgRequest.setIdPpg("32014015004P7");
    ppgRequest.setAnoi(2017);
    ppgRequest.setAnof(2024);
    ppgRequest.setNota("6");

    const response = await new Promise((resolve, reject) => {
      stubPPG.obtemIndicadores(
        ppgRequest,
        (error: any, listaprogramas: any) => {
          // debugger;
          if (error) {
            reject(error);
          } else {
            const dadosObj = listaprogramas.toObject()["itemList"];
            resolve(toApiResponse(dadosObj));
          }
        }
      );
    });

    return response;
  } catch (e) {
    console.log(e);
    new Error();
  }
}

export async function getDadosDocentes(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
  nota: string
) {
  try {
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes("3727");
    ppgRequest.setIdPpg("32014015004P7");
    ppgRequest.setAnoi(2017);
    ppgRequest.setAnof(2024);
    ppgRequest.setNota("6");

    const response = await new Promise((resolve, reject) => {
      stubPPG.obtemDocentes(ppgRequest, (error: any, listaprogramas: any) => {
        // debugger;
        if (error) {
          reject(error);
        } else {
          const dadosObj = listaprogramas.toObject()["itemList"];
          resolve(toApiResponse(dadosObj));
        }
      });
    });

    return response;
  } catch (e) {
    console.log(e);
    new Error();
  }
}

export async function getDadosProjetos(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
  nota: string
) {
  try {
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes("3727");
    ppgRequest.setIdPpg("32014015004P7");
    ppgRequest.setAnoi(2017);
    ppgRequest.setAnof(2024);
    ppgRequest.setNota("6");

    const response = await new Promise((resolve, reject) => {
      stubPPG.obtemProjetos(ppgRequest, (error: any, listaprogramas: any) => {
        if (error) {
          reject(error);
        } else {
          const dadosObj = listaprogramas.toObject()["itemList"];
          resolve(toApiResponse(dadosObj));
        }
      });
    });

    return response;
  } catch (e) {
    console.log(e);
    new Error();
  }
}

export async function getDadosBancas(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
  nota: string
) {
  try {
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes("3727");
    ppgRequest.setIdPpg("32014015004P7");
    ppgRequest.setAnoi(2017);
    ppgRequest.setAnof(2024);
    ppgRequest.setNota("6");

    const response = await new Promise((resolve, reject) => {
      stubPPG.obtemBancas(ppgRequest, (error: any, data) => {
        // debugger;
        if (error) {
          reject(error);
        } else {
          const dadosObj = data.toObject()["itemList"];
          resolve(toApiResponse(dadosObj));
        }
      });
    });

    return response;
  } catch (e) {
    console.log(e);
    new Error();
  }
}

export async function getDadosEgressos(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number,
  nota: string
) {
  try {
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes("3727");
    ppgRequest.setIdPpg("32014015004P7");
    ppgRequest.setAnoi(2017);
    ppgRequest.setAnof(2024);
    ppgRequest.setNota("6");

    const response = await new Promise((resolve, reject) => {
      stubPPG.obtemEgressos(ppgRequest, (error: any, data) => {
        // debugger;
        if (error) {
          reject(error);
        } else {
          const dadosObj = data.toObject()["itemList"];
          resolve(toApiResponse(dadosObj));
        }
      });
    });

    return response;
  } catch (e) {
    console.log(e);
    new Error();
  }
}