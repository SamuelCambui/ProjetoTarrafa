"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Column } from "@ant-design/plots";

export const ProdDocenteQualis = () => {
  const config = {
    data: {
      type: "fetch",
      value:
        "https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/column-stacked.json",
    },
    xField: "state",
    yField: "population",
    colorField: "age",
    stack: true,
    sort: {
      reverse: true,
      by: "y",
    },
    axis: {
      y: { labelFormatter: "~s" },
      x: {
        labelSpacing: 4,
        style: {
          labelTransform: "rotate(90)",
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Produção Docente com Qualis </CardTitle>
        <CardDescription> Este gráfico apresenta quantidade de artigos em periódicos (com qualis) dos docentes permanentes do programa </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
