"use client"

import { Docente } from "@/lib/ppg/definitions";
import DataTable from "@/app/ppg/(components)/table-ranking-docentes";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDadosHomeContext } from "@/lib/ppg/context/dados-home-context";
import { Loading } from "@/components/loading";

export default function Page() {
  const { data, isLoading } = useDadosHomeContext();
  const docentes : Record<string, Docente> = data?.ranking;

  if (isLoading) {
    return <Loading />;
  }

  if (Object.keys(docentes).length === 0) {
    return <p>Nenhum programa foi encontrado.</p>;
  }

  return (
    <div>
      <h1 className="">Ranking de Docentes</h1>
      <div className="relative mb-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Busque por um docente..." className="pl-8" />
      </div>

      <DataTable data={docentes} />
    </div>
  );
}
