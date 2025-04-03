"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DualAxes } from "@ant-design/plots";

export const IndDistOri = ( {dadosIndDistOri} ) => {

  const data = dadosIndDistOri.labels.map((ano, index) => ({
    ano: ano.toString(),
    IndDisOri: dadosIndDistOri.datasets[0].data[index],
    mediaIndDisOri: dadosIndDistOri.datasets[1].data[index],
  }));

  const config = {
    data,
    xField: "ano",
    legend: true,
    children: [
      {
        type: "interval",
        yField: "IndDisOri",
        style: { maxWidth: 80 },
      },
      {
        type: "line",
        yField: "mediaIndDisOri",
        style: { lineWidth: 2 },
        axis: { y: { position: "right" } },
      },
    ],
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>  IndDistOri (comparado com outros PPGs)  </CardTitle>
        <CardDescription> 
          DP que concluíram orientações no ano /DP
          Avalia a distribuição das orientações concluídas em relação ao corpo docente permanente   
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DualAxes {...config} /> 
      </CardContent>
    </Card>
  );
}
