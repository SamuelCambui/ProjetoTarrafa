"use client";
import { useState } from "react";
import { Filtro } from "@/app/grad/_components/Filtro";
import { useIndicadoresGlobais } from "@/service/grad/indicadores/queries";
import { GraficoTaxaMatriculas } from "./GraficoTaxaMatriculas";
import { GraficoQuantidadeAlunos } from "./GraficoQuantidadeAlunos";
import { GraficoEgressos } from "./GraficoEgressos";
import { GraficoBoxplotIdade } from "./GraficoBoxplotIdade";
import { GraficoEgressosCota } from "./GraficoEgressosCota";
import { GraficoTaxaMatriculasCota } from "./GraficoTaxaMatriculasCota";
import { GraficoNaturalidade } from "./GraficoNaturalidade";

export const Graficos = ({ idIes }: { idIes: string }) => {
  const [periodo, setPeriodo] = useState<{
    anoInicial: number;
    anoFinal: number;
  }>({
    anoInicial: new Date().getFullYear() - 10,
    anoFinal: new Date().getFullYear(),
  });
  const { data, error, isLoading } = useIndicadoresGlobais({
    idIes: idIes,
    anoInicial: periodo.anoInicial,
    anoFinal: periodo.anoFinal,
  });

  return error ? (
    <div className="flex justify-center items-center">
      <span className="text-red-500">Houve um erro ao carregar os dados.</span>
    </div>
  ) : (
    <div className="space-y-2">
      <Filtro
        periodo={periodo}
        setPeriodo={setPeriodo}
        isFetching={isLoading}
      />
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
      <GraficoBoxplotIdade data={data?.boxplotIdade} isLoading={isLoading} />
      <GraficoNaturalidade data={data?.municipios} />
    </div>
  );
};
