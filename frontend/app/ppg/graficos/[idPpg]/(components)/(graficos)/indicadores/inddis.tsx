"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DualAxes } from "@ant-design/plots";

export const IndDis = ({ indDis }) => {

  // Transformar os dados no formato necessário para o gráfico
  const data = indDis.labels.map((year, index) => ({
    ano: year.toString(),
    indDis: indDis.datasets[0].data[index], // IndDis (barras)
    mediaIndDis: indDis.datasets[1].data[index], // Avg IndDis (linha)
  }));

  const config = {
    data,
    xField: 'ano',
    legend: true,
    children: [
      {
        type: 'interval',
        yField: 'indDis',
        style: { maxWidth: 80 },
      },
      {
        type: 'line',
        yField: 'mediaIndDis',
        style: { lineWidth: 2 },
        axis: { y: { position: 'right' } },
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> IndDis (comparado com outros PPGs) </CardTitle>
        <CardDescription>
          G/F, onde G = quantidade de produtos e F = corpo discente + egressos 5
          anos. Índice de produtos com autoria discente. Todos os produtos menos
          apresentação de trabalhos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DualAxes {...config} />
      </CardContent>
    </Card>
  );
};
