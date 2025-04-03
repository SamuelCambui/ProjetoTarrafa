"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DualAxes } from "@ant-design/plots";

export const IndAut = ({ dadosIndAut }) => {
  
  const data = dadosIndAut.labels.map((ano, index) => ({
    ano: ano.toString(),
    IndAut: dadosIndAut.datasets[0].data[index],
    mediaIndAut: dadosIndAut.datasets[1].data[index],
  }));

  const config = {
    data,
    xField: "ano",
    legend: true,
    children: [
      {
        type: "interval",
        yField: "IndAut",
        style: { maxWidth: 80 },
      },
      {
        type: "line",
        yField: "mediaIndAut",
        style: { lineWidth: 2 },
        axis: { y: { position: "right" } },
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> IndAut (comparado com outros PPGs) </CardTitle>
        <CardDescription>
          {" "}
          E/F, onde E = discentes autores e F = corpo discente + egressos 5 anos
          Índice de discentes autores. Considera todos os produtos menos
          apresentação de trabalhos.{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DualAxes {...config} />
      </CardContent>
    </Card>
  );
};
