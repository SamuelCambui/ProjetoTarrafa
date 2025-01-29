import React from "react";
import { GraficoProps } from "@/app/ppgls/(components)/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Pie } from "@ant-design/plots";
import { LoadingCard } from "../../../../../(components)/LoadingCard";

export const GraficoDepartamento = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  const departamentosAgrupados = data?.reduce((acc: any, professor: any) => {
    const { departamento } = professor;
    acc[departamento] = (acc[departamento] || 0) + 1;
    return acc;
  }, []);

  const listaDepartamentos = Object.entries(departamentosAgrupados).map(
    ([departamento, Quantidade]) => ({
      departamento,
      Quantidade,
    }),
  );

  const config = {
    data: listaDepartamentos,
    angleField: "Quantidade",
    colorField: "departamento",
    label: false,
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    tooltip: {
      title: {
        field: "departamento",
      },
      items: [],
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Departamentos</CardTitle>
        <CardDescription>
          Quantidade de professores por departamento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Pie {...config} />
      </CardContent>
    </Card>
  );
};
