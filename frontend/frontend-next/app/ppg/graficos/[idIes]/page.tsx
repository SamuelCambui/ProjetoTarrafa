"use client";

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
import YearFilter from "@/components/year-filter";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { Filter, Info } from "lucide-react";
import { useState } from "react";

type Abas =
  | "indicadores"
  | "docentes"
  | "linhasPesquisaProjetos"
  | "bancas"
  | "egressos";

export default function Page() {
  const [activeTab, setActiveTab] = useState<Abas>("indicadores");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [startYear, setStartYear] = useState<string | undefined>(undefined);
  const [endYear, setEndYear] = useState<string | undefined>(undefined);

  const isEndYearValid = !startYear || !endYear || parseInt(endYear) >= parseInt(startYear);

  const handleApplyFilter = () => {
    // Implement filter logic here
    console.log("Filter applied with:", { startYear, endYear });
  };

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
            {/* <DropdownMenuContent className="w-64 p-4">
              <div className="my-4">
                <label className="mb-2 block text-sm font-medium">
                  Filtre por ano
                </label>
                <YearFilter
                  startYear={startYear}
                  endYear={endYear}
                  setStartYear={setStartYear}
                  setEndYear={setEndYear}
                />
              </div>
              {!isEndYearValid && (
                <p className="text-sm text-red-500">
                  O ano de fim deve ser maior ou igual ao ano de início.
                </p>
              )}
              <Button
                className="mt-4 w-full"
                onClick={handleApplyFilter}
                disabled={!isEndYearValid}
              >
                Aplicar Filtro
              </Button>
            </DropdownMenuContent> */}
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
          <TabBancas />
        </TabsContent>
        <TabsContent value="egressos">
          <TabEgressos />
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
              <br />
              O programa de pós-graduação em Biodiversidade e Uso dos Recursos
              Naturais possui curso(s) de nível Mestrado/Doutorado, na
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
