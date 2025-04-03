"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Column } from "@ant-design/plots";

export const ProdDocenteQualis = ({ dadosQualisDocentes }) => {


  const formatarDados = (dados: typeof dadosQualisDocentes) => {
    return Object.entries(dados).flatMap(([ano, categorias]) =>
      Object.entries(categorias).map(([categoria, quantidade]) => ({
        ano: parseInt(ano, 10),
        categoria,
        quantidade,
      }))
    );
  };

  const dadosFormatados = formatarDados(dadosQualisDocentes);


  const config = {
    data: dadosFormatados,
    xField: "ano",
    yField: "quantidade",
    colorField: "categoria",
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
        <CardDescription>
          {" "}
          Este gráfico apresenta quantidade de artigos em periódicos (com
          qualis) dos docentes permanentes do programa{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
