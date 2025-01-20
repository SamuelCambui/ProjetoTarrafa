"use client";

import { Docente } from "@/lib/ppg/definitions";
import DataTable from "@/app/ppg/(components)/table-ranking-docentes";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/loading";
import useRankingDocentes from "@/hooks/ppg/use-ranking-docentes";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearch } from "@/hooks/use-search";

export default function Page() {
  const { docentes, isLoading, error } = useRankingDocentes("3727");

  const [selectedIES, setSelectedIES] = useState<string>("todos");

  const iesUnicos = useMemo(() => {
    if (!docentes) return [];
    return Array.from(
      new Set(Object.values(docentes).map((docente) => docente.ies))
    ).sort();
  }, [docentes]);

  const {
    filteredData: docentesFiltrados,
    searchTerm,
    setSearchTerm,
  } = useSearch(
    Object.values(docentes || []),
    (docente: Docente, termoBusca: string) => {
      const matchesIES = selectedIES === "todos" || docente.ies === selectedIES;
      const matchesSearchTerm = docente.nome
        .toLowerCase()
        .includes(termoBusca.toLowerCase());
      return matchesIES && matchesSearchTerm;
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>Ocorreu um erro ao carregar os dados: {error.message}</p>;
  }

  if (!docentes || !Object.keys(docentes).length) {
    return <p>Nenhum docente foi encontrado.</p>;
  }

  return (
    <>
      <h1 className="mb-2 text-xl font-bold">Ranking de Docentes</h1>
      <div className="flex gap-4">
        <div className="relative mb-2 w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Busque por um docente..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Select
            onValueChange={(value) => setSelectedIES(value)}
            value={selectedIES}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione uma IES" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as IES</SelectItem>
              {iesUnicos.map((ies) => (
                <SelectItem key={ies} value={ies}>
                  {ies}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable data={docentesFiltrados} />
    </>
  );
}
