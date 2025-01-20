"use client";

import { Loading } from "@/components/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useArtigosDocentes from "@/hooks/ppg/use-artigos-docentes";
import { useState } from "react";
import DataTable from "../(components)/table-artigos";

export default function Page() {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(2024);

  const { artigos, isLoading, error } = useArtigosDocentes(
    "3727",
    anoSelecionado
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>Ocorreu um erro ao carregar os dados: {error.message}</p>;
  }

  if (!artigos || artigos.length === 0) {
    return <p>Nenhum artigo foi encontrado.</p>;
  }

  const anos = Array.from({ length: 8 }, (_, i) => (2024 - i).toString());

  return (
    <>
      <h1 className="mb-2 text-xl font-bold">Artigos de Docentes</h1>

      <Select
        onValueChange={(value) => setAnoSelecionado(Number(value))}
        value={anoSelecionado.toString()}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue>{anoSelecionado}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {anos.map((ano) => (
            <SelectItem key={ano} value={ano}>
              {ano}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DataTable data={artigos} />
    </>
  );
}
