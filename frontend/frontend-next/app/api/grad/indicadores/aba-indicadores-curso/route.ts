import { GradRequest } from "@/protos/messages_pb";
import { NextRequest, NextResponse } from "next/server";
import { stubIndicadores, toApiResponse } from "../../utils";

export async function POST(req: NextRequest) {
  try {
    const { id, idIes, anoInicial, anoFinal } = await req.json();

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

    return NextResponse.json(response);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Erro ao processar requisição" });
  }
}
