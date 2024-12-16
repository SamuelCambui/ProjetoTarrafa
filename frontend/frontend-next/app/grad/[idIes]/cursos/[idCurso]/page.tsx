"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { TabDisciplinas } from "./(components)/TabDisciplinas";
import { TabIndicadores } from "./(components)/TabIndicadores";
import { useParams } from "next/navigation";

type Abas = "indicadores" | "disciplinas" | "egressos" | "professores";

const Curso = () => {
  const [activeTab, setActiveTab] = useState<Abas>("indicadores");
  const { idCurso, idIes } = useParams();

  const onTabChange = (value: any) => {
    setActiveTab(value);
  };

  return (
    <div className="grid grid-cols-1 p-6">
      <div className="pb-4">
        Curso de <b>BACHARELADO</b> com nota mínima de aprovação igual a 70 e
        frequência mínima 75 %.
      </div>
      <Tabs
        defaultValue="account"
        value={activeTab}
        onValueChange={onTabChange}
      >
        <TabsList>
          <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
          <TabsTrigger value="egressos">Egressos</TabsTrigger>
          <TabsTrigger value="professores">Professores</TabsTrigger>
        </TabsList>
        <TabIndicadores
          value="indicadores"
          idCurso={idCurso as string}
          idIes={idIes as string}
        />
        <TabDisciplinas value="disciplinas" />
        <TabsContent value="egressos">Egressos</TabsContent>
        <TabsContent value="professores">Professores</TabsContent>
      </Tabs>
    </div>
  );
};

export default Curso;
