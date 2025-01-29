import { PPGLSRequest } from "@/protos/messages_pb";
import { NextRequest, NextResponse } from "next/server";
import { stubIndicadoresPPGLS, toApiResponse } from "../../utils";

export async function POST(req: NextRequest) {
  try {
    const { id, id_ies, anoi, anof } = await req.json();

    const gradRequest = new PPGLSRequest();

    gradRequest.setIdCurso(id! as string);
    gradRequest.setIdIes(id_ies! as string);
    gradRequest.setAnoi(Number(anoi));
    gradRequest.setAnof(Number(anof));

    const response = await new Promise((resolve, reject) => {
      stubIndicadoresPPGLS.getAbaRegressos(gradRequest, (error, indicadores) => {
        if (error) {
          reject(error); // Rejeita a promise em caso de erro
        } else {
          const data = indicadores.toObject()["itemList"];

          resolve(toApiResponse(data)); // Resolve a promise com os indicadores
        }
      });
    });

    return NextResponse.json(response);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Erro ao processar requisição" });
  }
}

