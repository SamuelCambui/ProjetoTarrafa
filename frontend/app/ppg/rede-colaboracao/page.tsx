"use client";

import React, { useState } from "react";
import { Loading } from "@/components/loading";
import useRedeColab from "@/hooks/ppg/use-rede-colab";
import GrafoColaboracao from "@/components/grafo-colaboracao";
import { FiltroColab } from "../(components)/filtro-dropdown";

export default function Page() {
  const [produto, setProduto] = useState<string>("ARTIGO EM PERIÓDICO");
  const [fonte, setFonte] = useState<"sucupira" | "lattes">("sucupira");
  const [aresta, setAresta] = useState<"ppgs" | "docentes">("docentes");
  const [anoInicio, setAnoInicio] = useState<number>(2020);
  const [anoFim, setAnoFim] = useState<number>(2024);
  const [numConexoes, setNumConexoes] = useState<number>(50);

  const { dadosColaboracao, isLoading } = useRedeColab(
    "3727",
    produto,
    fonte,
    aresta,
    anoInicio,
    anoFim
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!dadosColaboracao || Object.keys(dadosColaboracao).length === 0) {
    return <p>Nenhum dado foi encontrado.</p>;
  }

  return (
    <>
      <h1 className="mb-2 text-xl font-bold">Rede de Colaboração</h1>
      <FiltroColab
        produto={produto}
        setProduto={setProduto}
        fonte={fonte}
        setFonte={setFonte}
        aresta={aresta}
        setAresta={setAresta}
        anoInicio={anoInicio}
        setAnoInicio={setAnoInicio}
        anoFim={anoFim}
        setAnoFim={setAnoFim}
        numConexoes={numConexoes}
        setNumConexoes={setNumConexoes}
      />
      <GrafoColaboracao
        dadosColaboracao={dadosColaboracao.grafoCoautores}
        forca={dadosColaboracao.forca}
      />
    </>
  );
}
