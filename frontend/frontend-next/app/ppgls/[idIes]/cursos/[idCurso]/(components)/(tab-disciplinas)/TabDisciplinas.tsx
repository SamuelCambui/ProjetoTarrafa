import { TabsContent } from "@/components/ui/tabs";
import { useAbaDisciplinas } from "@/service/ppgls/indicadores/queries";
import { useEffect, useState } from "react";
import { TabDisciplinasProps } from "./types";
import { TabsBoxplot } from "./TabsBoxplot";
import { TabsReprovacoesGrade } from "./TabsReprovacoesGrade";
import { Separator } from "@/components/ui/separator";
import { IndicadoresDisciplina } from "./(indicadores-disciplina)/IndicadoresDisciplina";
import { ClassificacaoDisciplinas } from "./ClassificacaoDisciplinas";

export const TabDisciplinas = ({
  value,
  idCurso,
  idIes,
  serieFinal,
}: TabDisciplinasProps) => {
  const { data, isLoading } = useAbaDisciplinas({
    idCurso,
    idIes,
  });

  console.log("disciplinas recebido/arquivo TabDisciplinas:", data); // Log dos dados recebidos
  return (
    <TabsContent value={value}>
      <div className="space-y-4">
        <TabsBoxplot data={data} serieFinal={serieFinal} />
        <TabsReprovacoesGrade data={data} serieFinal={serieFinal} />
        <ClassificacaoDisciplinas
          isLoading={isLoading}
          data={data?.classificacaoDisciplinas}
        />
        <Separator />
        <IndicadoresDisciplina
          disciplinas={data?.disciplinas}
          idCurso={idCurso}
          idIes={idIes}
        />
      </div>
    </TabsContent>
  );
};
