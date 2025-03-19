"use server";
import { stubPPG, toApiResponse } from "@/app/api/ppg/utils";
import { PpgRequest } from "@/protos/messages_pb";

export async function obterInfoPPG(idIes: string, idPpg: string) {
  try {
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes(idIes);
    ppgRequest.setIdPpg(idPpg);

    const response = await new Promise((resolve, reject) => {
      stubPPG.obtemInformacaoPPG(
        ppgRequest,
        (error: any, listaprogramas: any) => {
          debugger;
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
    new Error();
  }
}

export async function obterDadosIndicadores(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number
) {
  try {
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes(idIes);
    ppgRequest.setIdPpg(idPpg);
    ppgRequest.setAnoi(anoInicial);
    ppgRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubPPG.obtemIndicadores(
        ppgRequest,
        (error: any, listaprogramas: any) => {
          debugger;
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

export async function obterDadosDocentes(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number
) {
  try {
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes(idIes);
    ppgRequest.setIdPpg(idPpg);
    ppgRequest.setAnoi(anoInicial);
    ppgRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubPPG.obtemDocentes(ppgRequest, (error: any, listaprogramas: any) => {
        debugger;
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

export async function obterDadosProjetos(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number
) {
  try {
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes(idIes);
    ppgRequest.setIdPpg(idPpg);
    ppgRequest.setAnoi(anoInicial);
    ppgRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubPPG.obtemProjetos(ppgRequest, (error: any, listaprogramas: any) => {
        debugger;
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

export async function obterDadosBancas(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number
) {
  try {
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes(idIes);
    ppgRequest.setIdPpg(idPpg);
    ppgRequest.setAnoi(anoInicial);
    ppgRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubPPG.obtemBancas(ppgRequest, (error: any, data) => {
        debugger;
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

export async function obterDadosEgressos(
  idIes: string,
  idPpg: string,
  anoInicial: number,
  anoFinal: number
) {
  try {
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes(idIes);
    ppgRequest.setIdPpg(idPpg);
    ppgRequest.setAnoi(anoInicial);
    ppgRequest.setAnof(anoFinal);

    const response = await new Promise((resolve, reject) => {
      stubPPG.obtemEgressos(ppgRequest, (error: any, data) => {
        debugger;
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

