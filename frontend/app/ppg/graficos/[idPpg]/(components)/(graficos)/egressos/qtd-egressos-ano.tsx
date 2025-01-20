"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "@ant-design/plots";

interface EgressosTituladosPorAno {
  ano_egresso: number;
  quantidade: number;
}

interface EgressosTituladosPorAnoProps {
  egressosTituladosPorAno: Record<string, EgressosTituladosPorAno[]> | null;
}

export const EgressosTituladosPorAno = ({
  egressosTituladosPorAno,
}: EgressosTituladosPorAnoProps) => {
  if (
    !egressosTituladosPorAno ||
    Object.keys(egressosTituladosPorAno).length === 0
  ) {
    return <p>Nenhum dado disponível.</p>;
  }

  const mergedData = Object.entries(egressosTituladosPorAno).flatMap(
    ([category, data]) =>
      data.map((item) => ({
        ...item,
        categoria: category,
      }))
  );

  const config = {
    data: mergedData,
    xField: "ano_egresso",
    yField: "quantidade",
    colorField: "categoria",
    children: [
      {
        type: "line",
        yField: "quantidade",
      },
    ],
    scale: { color: { range: ["#30BF78", "#F4664A", "#FAAD14"] } },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Egressos titulados por ano</CardTitle>
      </CardHeader>
      <CardContent>
        <Line {...config} />
      </CardContent>
    </Card>
  );
};
