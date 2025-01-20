"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Line } from "@ant-design/plots";
import React, { useEffect, useState } from "react";

export const IndProdArtigos = ({ dadosIndProd }) => {
  const formatarIndProd = (data: { indprod: any }) => {
    const { indprod } = data;

    const conceito = parseInt(indprod.conceito, 10);

    const resultado = Object.keys(indprod)
      .filter((key) => !isNaN(key) && parseInt(key, 10) >= conceito)
      .flatMap((key) =>
        indprod[key].map(
          (item: { ano: number; indprodall: number; permanentes: number }) => ({
            ano: item.ano,
            IndProd: item.indprodall,
            permanentes: item.permanentes,
            tipo: `PPGs nota ${key}`,
          })
        )
      );

    const indProds = Object.entries(indprod.indprods).map(
      ([ano, indprodall]) => {
        return {
          ano: parseInt(ano, 10),
          IndProd: indprodall,
          permanentes: null,
          tipo: "IndProd do PPG",
        };
      }
    );

    return [...resultado, ...indProds];
  };

  const indProdFormatado = formatarIndProd(dadosIndProd);

  const config = {
    data: indProdFormatado,
    xField: "ano",
    yField: "IndProd",
    colorField: "tipo",
    point: {
      shapeField: 'circle',
      sizeField: 3,
    },  
    label: {
      text: (d: { IndProd: number; tipo: string }) => {
        if (d.tipo == "IndProd do PPG") {
          return `${d.IndProd.toFixed(2)}`;
        }
        return ""; 
      },
      style: {
        textBaseline: "bottom", 
      },
    },
    scale: { color: { range: ["#30BF78", "#F4664A", "#FAAD14"] } },
    style: {
      lineDash: (data: { tipo: string }[]) => {
        if (data[0].tipo !== "IndProd do PPG") return [4, 4];
      },
      lineWidth: (data: { tipo: string }[]) => {
        if (data[0].tipo === "IndProd do PPG") return 3;
      },
      // opacity: (data: { type: string }[]) => {
      //   if (data[0].type !== "register") return 0.5;
      // },
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
