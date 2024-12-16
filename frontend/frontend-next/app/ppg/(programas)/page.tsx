import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Programa } from "@/lib/ppg/definitions";
import { Search } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Programas',
};

export default function Page({ listaProgramas }: { listaProgramas : Programa[] }) {

  if (!listaProgramas) {
    listaProgramas = [
      {
        area: "Tecnologia da Informação",
        nome: "Análise de Dados",
        nota: "90",
        id: "1",
      },
      {
        area: "Engenharia",
        nome: "Engenharia de Software",
        nota: "85",
        id: "2",
      },
      {
        area: "Saúde",
        nome: "Medicina",
        nota: "92",
        id: "3",
      },
      {
        area: "Ciências Sociais",
        nome: "Psicologia",
        nota: "88",
        id: "4",
      },
      {
        area: "Administração",
        nome: "Gestão de Empresas",
        nota: "80",
        id: "5",
      },
      {
        area: "Humanidades",
        nome: "Filosofia",
        nota: "75",
        id: "6",
      },
      {
        area: "Artes",
        nome: "Design Gráfico",
        nota: "89",
        id: "7",
      },
      {
        area: "Ciências Naturais",
        nome: "Biologia",
        nota: "94",
        id: "8",
      },
      {
        area: "Educação",
        nome: "Pedagogia",
        nota: "87",
        id: "9",
      },
      {
        area: "Arquitetura",
        nome: "Arquitetura e Urbanismo",
        nota: "91",
        id: "10",
      },
    ];
  }

  return (
    <>
      <h1>Programas</h1>
      
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Busque por um programa..." className="pl-8" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {listaProgramas.map((programa, index) => (
          <Card key={index}>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{programa.area}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{programa.nome}</div>
              <p className="text-xs text-muted-foreground">Nota {programa.nota}</p>
              <Link className="flex" href={`/ppg/graficos/${programa.id}/`} passHref>
                <Button className="mt-4 ml-auto block">Gráficos</Button>
              </Link>            
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
