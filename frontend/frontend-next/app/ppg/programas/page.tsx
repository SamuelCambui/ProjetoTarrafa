"use client";

import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDadosHomeContext } from "@/lib/ppg/context/dados-home-context";
import { Programa } from "@/lib/ppg/definitions";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { data, isLoading } = useDadosHomeContext();
  const programas: Programa[] = data?.programas ?? [];

  if (isLoading) {
    return <Loading />;
  }

  if (programas.length === 0) {
    return <p>Nenhum programa foi encontrado.</p>;
  }

  return (
    <>
      <h1>Programas</h1>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Busque por um programa..." className="pl-8" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {programas.map((programa: Programa) => (
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
              <Link
                href={{
                  pathname: `/ppg/graficos/${programa.id}/`,
                }}
                passHref
              >
                <Button className="mt-4 ml-auto block">Gráficos</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
