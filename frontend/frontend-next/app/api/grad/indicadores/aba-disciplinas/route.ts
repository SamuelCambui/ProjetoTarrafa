import { GradDisciplinasRequest } from "@/protos/messages_pb";
import { NextRequest, NextResponse } from "next/server";
import { stubIndicadores, toApiResponse } from "../../utils";

export async function POST(req: NextRequest) {
  try {
    const { id_disc, id_curso, id_grade, id_ies, anoi, anof } =
      await req.json();

    const gradRequest = new GradDisciplinasRequest();

    gradRequest.setIdDisc(id_disc);
    gradRequest.setIdCurso(id_curso);
    gradRequest.setIdGrade(id_grade);
    gradRequest.setIdIes(id_ies);
    gradRequest.setAnoi(anoi && Number(anoi));
    gradRequest.setAnof(anof && Number(anof));

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

    return NextResponse.json(response);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Erro ao processar requisição" });
  }
}
