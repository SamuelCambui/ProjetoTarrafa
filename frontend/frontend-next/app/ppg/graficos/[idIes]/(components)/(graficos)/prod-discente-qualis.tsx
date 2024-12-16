"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Column } from "@ant-design/plots";

export const ProdDiscenteQualis = () => {
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
        <CardTitle> Produção Discente com Qualis </CardTitle>
        <CardDescription>  Artigos dos discentes e egressos em periódicos (com qualis)  </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
