"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DualAxes } from "@ant-design/plots";

export const IndOri = ( {dadosIndOri} ) => {
  const data = dadosIndOri.labels.map((ano, index) => ({
    ano: ano.toString(),
    indOri: dadosIndOri.datasets[0].data[index],
    mediaIndOri: dadosIndOri.datasets[1].data[index],
  }));

  const config = {
    data,
    xField: "ano",
    legend: true,
    children: [
      {
        type: "interval",
        yField: "indOri",
        style: { maxWidth: 80 },
      },
      {
        type: "line",
        yField: "mediaIndOri",
        style: { lineWidth: 2 },
        axis: { y: { position: "right" } },
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> IndOri (comparado com outros PPGs) </CardTitle>
        <CardDescription> 
          (A +2B)/DP, onde A = mestrados em 24 meses e B = doutorados em 48 meses
          Avalia as defesas com orientação de docentes permanentes (DP) do programa 
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DualAxes {...config} /> 
      </CardContent>
    </Card>
  );
}
