"use client";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Filtro } from "../(components)/Filtro";
import { useIndicadoresGlobais } from "@/service/grad/indicadores/queries";
import { GraficoTaxaMatriculas } from "./(components)/GraficoTaxaMatriculas";
import { GraficoQuantidadeAlunos } from "./(components)/GraficoQuantidadeAlunos";
import { GraficoEgressos } from "./(components)/GraficoEgressos";
import { GraficoBoxplotIdade } from "./(components)/GraficoBoxplotIdade";
import { GraficoEgressosCota } from "./(components)/GraficoEgressosCota";
import { GraficoTaxaMatriculasCota } from "./(components)/GraficoTaxaMatriculasCota";
import { GraficoNaturalidade } from "./(components)/GraficoNaturalidade";
import { GradContext } from "../GradContext";

export const Home = () => {
  const { idIes } = useParams();
  const [periodo, setPeriodo] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({
    anoInicial: new Date().getFullYear() - 10,
    anoFinal: new Date().getFullYear(),
  });
  const { data, error, isLoading } = useIndicadoresGlobais({
    idIes,
    anoInicial: periodo.anoInicial,
    anoFinal: periodo.anoFinal,
  });
  const { setVariables } = useContext(GradContext);

  useEffect(() => {
    setVariables(idIes as string, "Universidade Estadual de Montes Claros");
  }, []);

  return (
    <div className="space-y-2">
      <Filtro
        periodo={periodo}
        setPeriodo={setPeriodo}
        isFetching={isLoading}
      />
      {error ? (
        <div className="flex justify-center items-center">
          <span className="text-red-500">
            Houve um erro ao carregar os dados.
          </span>
        </div>
      ) : (
        <>
          <GraficoTaxaMatriculas
            data={data?.taxaMatriculas}
            isLoading={isLoading}
          />
          <GraficoTaxaMatriculasCota
            data={data?.taxaMatriculasCota}
            isLoading={isLoading}
          />
          <GraficoQuantidadeAlunos
            data={data?.graficoSexoAlunos}
            isLoading={isLoading}
          />
          <GraficoEgressos data={data?.graficoEgressos} isLoading={isLoading} />
          <GraficoEgressosCota
            data={data?.graficoEgressosCota}
            isLoading={isLoading}
          />
          <GraficoBoxplotIdade
            data={data?.boxplotIdade}
            isLoading={isLoading}
          />
          <GraficoNaturalidade data={data?.municipios} />
        </>
      )}
    </div>
  );
};

export default Home;
