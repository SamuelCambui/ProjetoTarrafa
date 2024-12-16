"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Line } from "@ant-design/plots";
import React, { useEffect, useState } from "react";

export const IndProdArtigos = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/c48dbbb1-fccf-4a46-b68f-a3ddb4908b68.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const config = {
    data,
    xField: 'date',
    yField: 'value',
    colorField: 'type',
    axis: {
      y: {
        labelFormatter: (v : string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    scale: { color: { range: ['#30BF78', '#F4664A', '#FAAD14'] } },
    style: {
      lineWidth: 2,
      lineDash: (data: { type: string; }[]) => {
        if (data[0].type === 'register') return [4, 4];
      },
      opacity: (data: { type: string; }[]) => {
        if (data[0].type !== 'register') return 0.5;
      },
    },
  };

  const equacao = `IndProdArt = (100A₁ + 85A₂ + 70A₃ + 60A₄ + 50B₁ + 30B₂ + 20B₃ + 10B₄) / DP`;
 
  return (
    <Card>
      <CardHeader>
        <CardTitle> IndProd Artigos </CardTitle>
        <CardDescription>
          <p>{equacao}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Line {...config} />
      </CardContent>
    </Card>
  );
};



