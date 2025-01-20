"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CardSetup from "@/app/ppg/(components)/card-setup";

export default function Page() {
  const cardsData = [
    { titulo: "Coletar Currículos Lattes Docentes", progresso: 25 },
    { titulo: "Processar Currículos Lattes Docentes", progresso: 50 },
    { titulo: "Coletar Currículos Lattes Egressos", progresso: 75 },
    { titulo: "Processar Currículos Lattes Egressos", progresso: 80 },
    { titulo: "Restaurar cache", progresso: 100 },
  ];

  return (
    <>
      <h1 className="mb-2 text-xl font-bold">Setup</h1>
      <div className="flex items-center justify-between">
        <Select>
          <SelectTrigger className="max-w-96">
            <SelectValue placeholder="Selecione uma instituição..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inst1">Instituição 1</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Label htmlFor="select-all">Selecionar todas as instituições?</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm">Não</span>
            <Switch id="select-all" />
            <span className="text-sm">Sim</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-4 max-w-screen-md">
        {cardsData.map((card, index) => (
          <CardSetup
            key={index}
            titulo={card.titulo}
            onStart={() => console.log(`Tarefa ${card.titulo} iniciada!`)}
            progresso={card.progresso}
          />
        ))}
      </div>
    </>
  );
}
