import { TabsContent } from "@/components/ui/tabs";
import { useAbaEgressos } from "@/service/grad/indicadores/queries";
import { useState } from "react";
import { Filtro } from "../../../../../_components/Filtro";
import { TabProps } from "../types";
import { Loading } from "@/components/loading";
import { GraficoTempoFormacao } from "./GraficoTempoFormacao";
import { GraficoQuantidadeEgressos } from "./GraficoQuantidadeEgressos";

export const TabEgressos = ({ idIes, idCurso, value }: TabProps) => {
  const [periodo, setPeriodo] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({
    anoInicial: new Date().getFullYear() - 10,
    anoFinal: new Date().getFullYear(),
  });

  const { data, isLoading } = useAbaEgressos({
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
        <GraficoTempoFormacao data={data?.graficoTempoFormacao} />
        <GraficoQuantidadeEgressos data={data?.graficoEgressos} />
      </div>
    </TabsContent>
  );
};
