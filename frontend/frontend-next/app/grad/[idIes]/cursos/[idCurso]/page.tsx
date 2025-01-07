"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetCurso } from "@/service/grad/dados/queries";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { TabDisciplinas } from "./(components)/(tab-disciplinas)/TabDisciplinas";
import { TabEgressos } from "./(components)/(tab-egressos)/TabEgressos";
import { TabIndicadores } from "./(components)/(tab-indicadores-curso)/TabIndicadores";
import { TabProfessores } from "./(components)/(tab-professores)/TabProfessores";
import { GradContext } from "@/app/grad/GradContext";

type Abas = "indicadores" | "disciplinas" | "egressos" | "professores";

const Curso = () => {
  const [activeTab, setActiveTab] = useState<Abas>("indicadores");
  const { idCurso, idIes } = useParams();
  const { data, isLoading } = useGetCurso({
    idCurso,
    idIes,
  });

  const onTabChange = (value: any) => {
    setActiveTab(value);
  };

  return (
    <div className="grid grid-cols-1 p-6">
      <div className="pb-4">
        {isLoading || !data ? (
          <Skeleton className="h-12 w-2/3" />
        ) : (
          <p>
            {" "}
            Curso de <b>TIPO_CURSO</b> com nota mínima de aprovação igual a{" "}
            <b>{data?.nota_min_aprovacao}</b>, frequência mínima{" "}
            <b>{data?.freq_min_aprovacao}%</b> e duração de{" "}
            <b>{data?.serie_final}</b> semestres.
          </p>
        )}
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
        <TabDisciplinas
          value="disciplinas"
          idCurso={idCurso as string}
          idIes={idIes as string}
          serieFinal={data?.serie_final}
        />
        <TabEgressos
          value="egressos"
          idCurso={idCurso as string}
          idIes={idIes as string}
        />
        <TabProfessores
          value="professores"
          idCurso={idCurso as string}
          idIes={idIes as string}
        />
      </Tabs>
    </div>
  );
};

export default Curso;
