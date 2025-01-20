import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GraficoBoxplotIdadeProps {
    data?: any
}

export const GraficoBoxplotIdade = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Idade</CardTitle>
        <CardDescription>
          Distribuição de idade dos alunos.
        </CardDescription>
      </CardHeader>
      <CardContent>Boxplot</CardContent>
    </Card>
  );
};
