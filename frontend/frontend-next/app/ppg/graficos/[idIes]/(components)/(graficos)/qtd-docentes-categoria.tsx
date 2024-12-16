"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DualAxes } from "@ant-design/plots";

export const DocentesCategoria = () => {
    const data = [
      { time: '2019-03', value: 350, count: 800 },
      { time: '2019-04', value: 900, count: 600 },
      { time: '2019-05', value: 300, count: 400 },
      { time: '2019-06', value: 450, count: 380 },
      { time: '2019-07', value: 470, count: 220 },
    ];
  
    const config = {
      data,
      xField: 'time',
      legend: true,
      children: [
        {
          type: 'interval',
          yField: 'value',
          style: { maxWidth: 80 },
        },
        {
          type: 'line',
          yField: 'count',
          style: { lineWidth: 2 },
          axis: { y: { position: 'right' } },
        },
      ],
    };
  return (
    <Card>
      <CardHeader>
        <CardTitle>   Quantidade de docentes por categoria    </CardTitle>
      </CardHeader>
      <CardContent>
        <DualAxes {...config} /> 
      </CardContent>
    </Card>
  );
}
