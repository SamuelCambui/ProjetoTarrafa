import { TabsContent } from "@/components/ui/tabs";
import { useAbaDisciplinas } from "@/service/grad/indicadores/queries";
import { useEffect, useState } from "react";
import { FiltroGrades } from "./FiltroGrades";
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
  const [gradeAtiva, setGradeAtiva] = useState<string | undefined>(undefined);
  const { data, isLoading } = useAbaDisciplinas({
    idCurso,
    idIes,
    idGrade: gradeAtiva,
  });

  useEffect(() => {
    setGradeAtiva(data?.grades[0].id_grade);
  }, []);

  return (
    <TabsContent value={value}>
      <div className="space-y-4">
        <FiltroGrades
          gradeAtiva={gradeAtiva}
          grades={data?.grades}
          setGradeAtiva={setGradeAtiva}
          isFetching={isLoading}
        />
        <TabsBoxplot data={data} serieFinal={serieFinal} />
        <TabsReprovacoesGrade data={data} serieFinal={serieFinal} />
        <ClassificacaoDisciplinas />
        <Separator />
        <IndicadoresDisciplina disciplinas={data?.disciplinas} idGrade={gradeAtiva} idCurso={idCurso} idIes={idIes}/>
      </div>
    </TabsContent>
  );
};
