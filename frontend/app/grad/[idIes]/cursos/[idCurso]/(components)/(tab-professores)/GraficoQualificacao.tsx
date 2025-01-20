import React from "react";
import { GraficoProps } from "@/app/grad/(components)/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Radar } from "@ant-design/plots";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingCard } from "../../../../../(components)/LoadingCard";

export const GraficoQualificacao = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  const qualificacoesAgrupadas = data?.reduce((acc: any, professor: any) => {
    const { qualificacao } = professor;
    acc[qualificacao] = (acc[qualificacao] || 0) + 1;
    return acc;
  }, []);

  const listaQualificacoes = Object.entries(qualificacoesAgrupadas).map(
    ([qualificacao, quantidade]) => ({
      qualificacao,
      quantidade,
    }),
  );

  const config = {
    data: listaQualificacoes,
    xField: "qualificacao",
    yField: "quantidade",
    area: {
      style: {
        fillOpacity: 0.2,
      },
    },
    scale: {
      x: {
        padding: 0.5,
        align: 0,
      },
    },
    axis: {
      x: {
        title: false,
        grid: true,
      },
      y: {
        gridAreaFill: "rgba(0, 0, 0, 0.04)",
        label: false,
        title: false,
      },
    },
    interaction: {
      tooltip: {
        render: (_: any, { title, items }: any) => {
          return (
            <div key={title}>
              <h4 className="mb-2">{title}</h4>
              {items.map((item: any) => {
                const { name, value } = item;
                return (
                  <div>
                    <div className="m-0 flex justify-between">
                      <div>
                        <span
                          className="mr-1 inline-block h-2 w-2 rounded"
                          style={{
                            backgroundColor:
                              name === "F" ? "#EB3A76" : "#1890FF",
                          }}
                        ></span>
                        <span className="mr-6 capitalize">{name}</span>
                      </div>
                      <b>{value}</b>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Qualificação de Professores</CardTitle>
        <CardDescription>
          Quantidade de professores por qualificação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Radar {...config} />
      </CardContent>
    </Card>
  );
};
