import { TabsContent } from "@/components/ui/tabs";
import { useAbaRegressos } from "@/service/ppgls/indicadores/queries";
import { useState } from "react";
import { Filtro } from "../../../../../_components/Filtro";
import { TabProps } from "../types";
import { GraficoQuantidaderegressos } from "./GraficoQuantidadeRegressos";

export const TabRegressos = ({ idIes, idCurso, value }: TabProps) => {
  const [periodo, setPeriodo] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({
    anoInicial: new Date().getFullYear() - 10,
    anoFinal: new Date().getFullYear(),
  });

  const { data, isLoading } = useAbaRegressos({
    idCurso: idCurso,
    idIes: idIes,
    anoInicial: periodo.anoInicial,
    anoFinal: periodo.anoFinal,
  });
  
  return (
    <TabsContent value={value}>
      <Filtro
        periodo={periodo}
        setPeriodo={setPeriodo}
        isFetching={isLoading}
      />

      <div className="space-y-4">
        <GraficoQuantidaderegressos data={data?.graficoQuantAlunosVieramGraduENaoVieramPorCurso} />
      </div>
    </TabsContent>
  );
};
