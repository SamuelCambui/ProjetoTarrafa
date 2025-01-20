"use client";

import React, { useState } from "react";
import { Loading } from "@/components/loading";
import useRedeColab from "@/hooks/ppg/use-rede-colab";
import { Search } from "lucide-react";
import { Input } from "postcss";
import { DropdownFilter } from "../(components)/filtro-dropdown";
import GrafoColaboracao from "@/components/grafo-colaboracao";

export default function Page() {
  const [produto, setProduto] = useState<string>("ARTIGO EM PERIÓDICO");
  const [fonte, setFonte] = useState<"sucupira" | "lattes">("sucupira");
  const [aresta, setAresta] = useState<"ppgs" | "docentes">("ppgs");
  const [anoInicio, setAnoInicio] = useState<number>(2020);
  const [anoFim, setAnoFim] = useState<number>(2024);
  const [numeroConexoes, setNumeroConexoes] = useState<number>(50);

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
      <GrafoColaboracao dadosColaboracao={dadosColaboracao[0]} forca={dadosColaboracao[1]} />
    </>
  );
}
