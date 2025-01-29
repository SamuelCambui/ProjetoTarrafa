import { Loading } from "@/components/loading";
import { TabsContent } from "@/components/ui/tabs";
import { useAbaProfessores } from "@/service/ppgls/indicadores/queries";
import { useState } from "react";
import { Filtro } from "../../../../../(components)/Filtro";
import { TabProps } from "../types";
import { GraficoQualificacao } from "./GraficoQualificacao";
import { TabelaProfessores } from "./TabelaProfessores";
import { GraficoDepartamento } from "./GraficoDepartamento";

export const TabProfessores = ({ idCurso, idIes, value }: TabProps) => {
  const [periodo, setPeriodo] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({
    anoInicial: new Date().getFullYear() - 10,
    anoFinal: new Date().getFullYear(),
  });
  const { data, isLoading } = useAbaProfessores({
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
      <div className="mb-4 grid grid-cols-2 gap-4">
        <GraficoQualificacao data={data?.professores} />
        <GraficoDepartamento data={data?.professores} />
      </div>
      <TabelaProfessores data={data?.professores} />
    </TabsContent>
  );
};
