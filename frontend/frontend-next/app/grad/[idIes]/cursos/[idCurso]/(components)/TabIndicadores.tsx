import { TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { GraficoQuantidadeAlunos } from "./(graficos)/GraficoQuantidadeAlunos";
import { GraficoFormaIngresso } from "./(graficos)/GraficoFormaIngresso";
import { GraficoNecessidadeEspecial } from "./(graficos)/GraficoNecessidadeEspecial";
import { GraficoNaturalidade } from "./(graficos)/GraficoNaturalidade";
import { GraficoBoxplotIdade } from "./(graficos)/GraficoBoxplotIdade";
import { Filtro } from "./Filtro";
import { getAbaIndicadoresCurso } from "@/service/grad/service";

interface TabIndicadoresProps {
  value: string;
  idCurso: string;
  idIes: string;
}

export const TabIndicadores = ({
  value,
  idCurso,
  idIes,
}: TabIndicadoresProps) => {
  const [periodo, setPeriodo] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({
    anoInicial: new Date().getFullYear() - 10,
    anoFinal: new Date().getFullYear(),
  });
  const [dados, setDados] = useState<any | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAbaIndicadoresCurso(
        idCurso,
        idIes,
        periodo.anoInicial,
        periodo.anoFinal,
      );
      console.log(data);
      setDados(data);
    };

    fetchData().catch((e) => console.error(e));
  }, [periodo]);

  return (
    <TabsContent value={value}>
      <Filtro periodo={periodo} setPeriodo={setPeriodo} />
      <div className="space-y-4">
        <GraficoQuantidadeAlunos />
        <GraficoBoxplotIdade />
        <GraficoFormaIngresso />
        <GraficoNecessidadeEspecial />
        <GraficoNaturalidade />
      </div>
    </TabsContent>
  );
};
