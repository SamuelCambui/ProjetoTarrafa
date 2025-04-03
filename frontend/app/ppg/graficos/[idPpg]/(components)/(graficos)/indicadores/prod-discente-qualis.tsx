"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Column } from "@ant-design/plots";

export const ProdDiscenteQualis = ({ dadosQualisDiscentes }) => {

  const formatarDados = (dados: typeof dadosQualisDiscentes) => {
    const { produtos } = dados;

    return Object.entries(produtos).flatMap(([ano, categorias]) =>
      Object.entries(categorias).map(([categoria, quantidade]) => ({
        ano: parseInt(ano, 10),
        categoria,
        quantidade,
      }))
    );
  };

  const dadosFormatados = formatarDados(dadosQualisDiscentes);

  const config = {
    data: dadosFormatados,
    xField: "ano",
    yField: "quantidade",
    colorField: "categoria",
    stack: true,
    // axis: {
    //   y: { labelFormatter: "~s" },
    //   x: {
    //     labelSpacing: 4,
    //     style: {
    //       labelTransform: "rotate(90)",
    //     },
    //   },
    // },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Produção Discente com Qualis </CardTitle>
        <CardDescription>
          {" "}
          Artigos dos discentes e egressos em periódicos (com qualis){" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
