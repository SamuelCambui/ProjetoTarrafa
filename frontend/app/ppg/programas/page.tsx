"use client";

import { useState } from "react";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useDadosProgramas from "@/hooks/ppg/use-dados-programas";
import { Programa } from "@/lib/ppg/definitions";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { programas, isLoading } = useDadosProgramas("3727");
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return <Loading />;
  }

  if (!programas || programas.length === 0) {
    return <p>Nenhum programa foi encontrado.</p>;
  }

  const filteredProgramas = programas.filter(
    (programa) =>
      programa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programa.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1 className="mb-2 text-xl font-bold">Programas</h1>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Busque por um programa..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProgramas.length === 0 ? (
        <p>Nenhum programa encontrado para a busca atual.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProgramas.map((programa: Programa) => (
            <Card key={programa.id}>
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {programa.area}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold capitalize">
                  {programa.nome.toLowerCase()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Nota {programa.nota}
                </p>
                <Link href={`/ppg/graficos/${programa.id}/`}>
                  <Button className="mt-4 ml-auto block">Gráficos</Button>
                </Link>{" "}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
