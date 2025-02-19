import { TabsContent } from "@/components/ui/tabs";
import { useAbaIndicadoresCurso } from "@/service/ppgls/indicadores/queries";
import { useState } from "react";
import { GraficoBoxplotIdade } from "./GraficoBoxplotIdade";
import { GraficoFormaIngresso } from "./GraficoFormaIngresso";
import { GraficoNaturalidade } from "./GraficoNaturalidade";
import { GraficoNecessidadeEspecial } from "./GraficoNecessidadeEspecial";
import { GraficoQuantidadeAlunos } from "./GraficoQuantidadeAlunos";
import { Filtro } from "../../../../../(components)/Filtro";
import { TabProps } from "../types";

export const TabIndicadores = ({ value, idCurso, idIes }: TabProps) => {
  const [periodo, setPeriodo] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({
    anoInicial: new Date().getFullYear() - 10,
    anoFinal: new Date().getFullYear(),
  });

  const { data, isLoading } = useAbaIndicadoresCurso({
    idCurso: idCurso,
    idIes: idIes,
    anoInicial: periodo.anoInicial,
    anoFinal: periodo.anoFinal,
  });

  console.log(data);
  return (
    <TabsContent value={value}>
      <Filtro
        periodo={periodo}
        setPeriodo={setPeriodo}
        isFetching={isLoading}
      />
      <div className="space-y-4">
        <GraficoQuantidadeAlunos data={data?.graficoQuantidadeAlunosSexo} />
        <GraficoBoxplotIdade data={data?.graficoBoxplotIdade} />
        <GraficoFormaIngresso data={data?.graficoFormaIngresso} />
        <GraficoNecessidadeEspecial data={data?.graficoNecessidadeEspecial} />
        <GraficoNaturalidade data={data?.municipios} />
      </div>
    </TabsContent>
  );
};
