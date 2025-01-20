"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useParams } from "next/navigation";
import useDadosPPG from "@/hooks/ppg/use-dados-ppg";
import TabIndicadores from "@/app/ppg/graficos/[idPpg]/(components)/tab-indicadores";
import TabDocentes from "@/app/ppg/graficos/[idPpg]/(components)/tab-docentes";
import TabProjetos from "@/app/ppg/graficos/[idPpg]/(components)/tab-projetos";
import TabBancas from "@/app/ppg/graficos/[idPpg]/(components)/tab-bancas";
import TabEgressos from "@/app/ppg/graficos/[idPpg]/(components)/tab-egressos";
import DrawerInfoPpg from "@/app/ppg/(components)/drawer-info-ppg";
import { Loading } from "@/components/loading";
import { FiltroAno } from "../../(components)/filtro-ano";

type Abas =
  | "indicadores"
  | "docentes"
  | "linhasPesquisaProjetos"
  | "bancas"
  | "egressos";

export default function Page({ idIes }: { idIes: string }) {
  if (!idIes) idIes = "3727";
  const { idPpg }: { idPpg: string } = useParams();
  const { dadosPpg, isLoading } = useDadosPPG(idIes, idPpg);

  const [activeTab, setActiveTab] = useState<Abas>("indicadores");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [anoInicio, setAnoInicio] = useState<number | null>(null);
  const [anoFim, setAnoFim] = useState<number | null>(null);

  const anos = dadosPpg?.anosPpg || [];

  useEffect(() => {
    if (anos.length > 0) {
      setAnoInicio(anos[0]);
      setAnoFim(anos[anos.length - 1]);
    }
  }, [anos]);

  const onTabChange = (value: string) => {
    setActiveTab(value as Abas);
  };

  const aplicarFiltroAno = (novoAnoInicio: number, novoAnoFim: number) => {
    setAnoInicio(novoAnoInicio);
    setAnoFim(novoAnoFim);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          <TabsTrigger value="docentes">Docentes</TabsTrigger>
          <TabsTrigger value="linhasPesquisaProjetos">
            Linhas de Pesquisa e Projetos
          </TabsTrigger>
          <TabsTrigger value="bancas">Bancas e TCCs</TabsTrigger>
          <TabsTrigger value="egressos">Egressos</TabsTrigger>
        </TabsList>

        {anoInicio && anoFim && (

          <>
                    <div className="py-4 flex space-x-2 justify-end">
          <FiltroAno
            anos={anos}
            anoInicio={anoInicio || 0}
            anoFim={anoFim || 0}
            aplicarFiltroAno={aplicarFiltroAno}
          />
          <Button onClick={() => setIsDrawerOpen(true)}>
            Sobre o PPG <Info />
          </Button>
        </div>

            <TabsContent value="indicadores">
              <TabIndicadores
                idIes={idIes}
                idPpg={idPpg}
                anoInicial={anoInicio}
                anoFinal={anoFim}
              />
            </TabsContent>
            <TabsContent value="docentes">
              <TabDocentes
                idIes={idIes}
                idPpg={idPpg}
                anoInicial={anoInicio}
                anoFinal={anoFim}
              />
            </TabsContent>
            <TabsContent value="linhasPesquisaProjetos">
              <TabProjetos
                idIes={idIes}
                idPpg={idPpg}
                anoInicial={anoInicio}
                anoFinal={anoFim}
              />
            </TabsContent>
            <TabsContent value="bancas">
              <TabBancas
                idIes={idIes}
                idPpg={idPpg}
                anoInicial={anoInicio}
                anoFinal={anoFim}
              />
            </TabsContent>
            <TabsContent value="egressos">
              <TabEgressos
                idIes={idIes}
                idPpg={idPpg}
                anoInicial={anoInicio}
                anoFinal={anoFim}
              />
            </TabsContent>
          </>
        )}
      </Tabs>

      <DrawerInfoPpg
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        infoPpg={dadosPpg?.informacaoPpg || []}
      />
    </div>
  );
}
