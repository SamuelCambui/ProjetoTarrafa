import { PpgRequest } from "@/protos/messages_pb";
import { NextRequest, NextResponse } from "next/server";
import { stubPPG, toApiResponse } from "../../utils";

export async function GET(req: NextRequest) {
  try {
    const { idPpg, idIes, anoInicial, anoFinal, nota } = await req.json();
    
    const ppgRequest = new PpgRequest();

    ppgRequest.setIdIes(idIes);
    ppgRequest.setIdPpg(idPpg);
    ppgRequest.setAnoi(anoInicial);
    ppgRequest.setAnof(anoFinal);
    ppgRequest.setNota(nota);

    const response = await new Promise((resolve, reject) => {
      stubPPG.obtemIndicadores(
        ppgRequest, 
        (error, indicadores) => {
        if (error) {
          reject(error); // Rejeita a promise em caso de erro
        } else {
            const data = indicadores.toObject()["itemList"];
            resolve(toApiResponse(data));
        }
      });
    });
    return NextResponse.json(response);
} catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Erro ao processar requisição" });
  }
}
