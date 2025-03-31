"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DualAxes } from "@ant-design/plots";

export const Coautoria = ({dadosCoautoria}) => {
  const data = dadosCoautoria.labels.map((ano, index) => ({
    ano: ano.toString(),
    dadosCoatoria: dadosCoautoria.datasets[0].data[index],
    mediaCoautoria: dadosCoautoria.datasets[1].data[index],
  }));

  const config = {
      data,
      xField: 'ano',
      legend: true,
      children: [
        {
          type: 'interval',
          yField: 'dadosCoatoria',
          style: { maxWidth: 80 },
        },
        {
          type: 'line',
          yField: 'mediaCoautoria',
          style: { lineWidth: 2 },
          axis: { y: { position: 'right' } },
        },
      ],
    };
  return (
    <Card>
      <CardHeader>
        <CardTitle>  Coautoria (comparado com outros PPGs)   </CardTitle>
        <CardDescription> 
        IndProdCoautor/IndProd
        Avalia a coautoria de artigos com dois ou mais docentes e pelo menos um docente permanente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DualAxes {...config} /> 
      </CardContent>
    </Card>
  );
}
