import { GradDisciplinasRequest } from "@/protos/messages_pb";
import { NextRequest, NextResponse } from "next/server";
import { stubHome, toApiResponse } from "../utils";

export async function POST(req: NextRequest) {
  try {
    const { id_ies } =
      await req.json();

    const homeRequest = new GradDisciplinasRequest();

    homeRequest.setIdIes(id_ies);

    const response = await new Promise((resolve, reject) => {
      stubHome.obtemHome(homeRequest, (error, indicadores) => {
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
