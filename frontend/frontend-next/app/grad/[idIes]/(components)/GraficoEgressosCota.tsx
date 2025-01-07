import React from "react";
import { GraficoProps } from "../../(components)/types";
import { Column } from "@ant-design/plots";
import { Grafico } from "../../(components)/Grafico";
import { LoadingCard } from "../../(components)/LoadingCard";

export const GraficoEgressosCota = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }
  const config = {
    data: data?.map(({ cota, semestre_letivo, egressos }) => {
      return {
        tipo: cota ? "Cotista" : "Ampla Concorrência",
        semestreLetivo: semestre_letivo,
        egressos: egressos,
      };
    }),
    xField: "semestreLetivo",
    yField: "egressos",
    colorField: "tipo",
    stack: true,
    legend: false,
    interaction: {
      tooltip: {
        render: (_: any, { title, items }: any) => {
          return (
            <div key={title}>
              <h4 className="mb-2">{title}</h4>
              {items.map((item: any) => {
                const { name, value, color } = item;
                return (
                  <div key={name}>
                    <div className="m-0 flex justify-between">
                      <div>
                        <span
                          className="mr-1 inline-block h-2 w-2 rounded"
                          style={{
                            backgroundColor: color,
                          }}
                        ></span>
                        <span className="mr-6 capitalize">{name}</span>
                      </div>
                      <span>{value}</span>
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
    <Grafico
      titulo="Egressos por Cota"
      descricao="Quantidade de alunos egressos por semestre letivo, separados por cota e ampla concorrência."
    >
      <Column {...config} />
    </Grafico>
  );
};
