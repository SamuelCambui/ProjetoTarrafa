"use client"

import TabBancas from "@/app/ppg/graficos/[idIes]/(components)/tab-bancas";
import TabDocentes from "@/app/ppg/graficos/[idIes]/(components)/tab-docentes";
import TabEgressos from "@/app/ppg/graficos/[idIes]/(components)/tab-egressos";
import TabIndicadores from "@/app/ppg/graficos/[idIes]/(components)/tab-indicadores";
import TabProjetos from "@/app/ppg/graficos/[idIes]/(components)/tab-projetos";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { Filter, Info } from "lucide-react";
import { useState } from "react";

// Define the available tab values in a union type
type Abas =
  | "indicadores"
  | "docentes"
  | "linhasPesquisaProjetos"
  | "bancas"
  | "egressos";

export default function Page(idIes, idPpg, nota 
) {
  const [activeTab, setActiveTab] = useState<Abas>("indicadores");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const anoInicial = 2019;
  const anoFinal = 2024;

  const onTabChange = (value: string) => {
    setActiveTab(value as Abas);
  };

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

        <div className="py-4 flex space-x-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDrawerOpen(true)}
          >
            Sobre o PPG <Info />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button">
                Filtrar por ano <Filter />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>

        <TabsContent value="indicadores">
          <TabIndicadores />
        </TabsContent>
        <TabsContent value="docentes">
          <TabDocentes />
        </TabsContent>
        <TabsContent value="linhasPesquisaProjetos">
          <TabProjetos />
        </TabsContent>
        <TabsContent value="bancas">
          <TabBancas
            idIes={idIes}
            idPpg={idPpg}
            anoInicial={anoInicial}
            anoFinal={anoFinal}
            nota={nota}
          />
        </TabsContent>
        <TabsContent value="egressos">
          <TabEgressos
            idIes={idIes}
            idPpg={idPpg}
            anoInicial={anoInicial}
            anoFinal={anoFinal}
            nota={nota}
          />
        </TabsContent>
      </Tabs>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Biodiversidade e Uso dos Recursos Naturais - ME/DO
            </DrawerTitle>
            <DrawerDescription>
              Nota
              <br />O programa de pós-graduação em Biodiversidade e Uso dos
              Recursos Naturais possui curso(s) de nível Mestrado/Doutorado, na
              modalidade ACADÊMICO. O PPG foi criado em 2006 e atualmente é
              coordenado por LUIZ ALBERTO DOLABELA FALCAO, é avaliado pela área
              BIODIVERSIDADE, área de conhecimento ECOLOGIA APLICADA e recebeu
              nota 4 na última avaliação.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="link">
              <a href="http://www.ppgcb.unimontes.br" target="_blank">
                http://www.ppgcb.unimontes.br
              </a>
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}