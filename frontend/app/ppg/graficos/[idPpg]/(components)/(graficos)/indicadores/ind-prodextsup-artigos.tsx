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

export const IndProdExtSupArtigos  = ({dadosIndProdExtSup}) => {
  
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
          tipo: "IndProd ExtSup do PPG",
        };
      }
    );

    return [...resultado, ...indProds];
  };

  const data = formatarIndProd(dadosIndProdExtSup);

  const config = {
    data,
    xField: 'ano',
    yField: 'IndProd',
    colorField: 'tipo',
    point: {
      shapeField: 'circle',
      sizeField: 3,
    },  
    label: {
      text: (d: { IndProd: number; tipo: string }) => {
        if (d.tipo == "IndProd ExtSup do PPG") {
          return `${d.IndProd.toFixed(2)}`;
        }
        return ""; 
      },

      style: {
        textBaseline: "bottom", 
      },
    },
    scale: { color: { range: ['#30BF78', '#F4664A', '#FAAD14'] } },
    style: {
      lineWidth: (data: { tipo: string }[]) => {
        if (data[0].tipo === "IndProd ExtSup do PPG") return 3;
      },
      lineDash: (data: { tipo: string }[]) => {
          if (data[0].tipo !== "IndProd ExtSup do PPG") return [4, 4];
      },
    },
  };
 
  return (
    <Card>
      <CardHeader>
        <CardTitle> IndProdExtSup Artigos </CardTitle>
        <CardDescription>
          IndProdArt do Extrato Superior
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Line {...config} />
      </CardContent>
    </Card>
  );
};



