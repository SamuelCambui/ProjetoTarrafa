"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DualAxes, Line } from "@ant-design/plots";

export const QtdDiscentesTitulados = () => {
  const data = [
    { year: '1991', value: 3, count: 10 },
    { year: '1992', value: 4, count: 4 },
    { year: '1993', value: 3.5, count: 5 },
    { year: '1994', value: 5, count: 5 },
    { year: '1995', value: 4.9, count: 4.9 },
    { year: '1996', value: 6, count: 35 },
    { year: '1997', value: 7, count: 7 },
    { year: '1998', value: 9, count: 1 },
    { year: '1999', value: 13, count: 20 },
  ];

  const config = {
    data,
    xField: 'year',
    yField: 'value',
    legend: true,
    children: [
      {
        type: 'area',
        style: {
          stroke: '#2A635D',
          lineWidth: 2,
          fill: '#2A635D',
          fillOpacity: 0.2,

        },
      },
      {
        type: 'area',
        yField: 'count',
        style: {
          stroke: '#E76A4B',
          lineWidth: 2,
          fill: "#E76A4B",
          fillOpacity: 0.3,
        },
      },
    ],
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>  Quantidade de Discentes Titulados   </CardTitle>
      </CardHeader>
      <CardContent>
        <DualAxes {...config} />
      </CardContent>
    </Card>
  );
}
