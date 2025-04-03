"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DualAxes } from "@ant-design/plots";

export const PartDis = ({dadosPartDis}) => {
  const data = dadosPartDis.labels.map((ano, index) => ({
    ano: ano.toString(),
    partDis: dadosPartDis.datasets[0].data[index],
    mediaPartDis: dadosPartDis.datasets[1].data[index],
  }));
  
  const config = {
    data,
    xField: "ano",
    legend: true,
    children: [
      {
        type: "interval",
        yField: "partDis",
        style: { maxWidth: 80 },
      },
      {
        type: "line",
        yField: "mediaPartDis",
        style: { lineWidth: 2 },
        axis: { y: { position: "right" } },
      },
    ],
  };

  
  return (
    <Card>
      <CardHeader>
        <CardTitle>  PartDis (comparado com outros PPGs)  </CardTitle>
        <CardDescription>  IndProdDis/IndProd
        Avalia a participação da produção discente na produção de artigos do programa.  </CardDescription>
      </CardHeader>
      <CardContent>
        <DualAxes {...config} /> 
      </CardContent>
    </Card>
  );
}
