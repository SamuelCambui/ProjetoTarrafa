import React, { useRef } from "react";
import { GraficoProps } from "../../_components/types";
import { Chart, Column } from "@ant-design/plots";
import { Grafico } from "../../_components/Grafico";
import { LoadingCard } from "../../_components/LoadingCard";

export const GraficoEgressosCota = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  const chartRef = useRef<Chart>(null);

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
      chartRef={chartRef}
    >
      <Column {...config} ref={chartRef} />
    </Grafico>
  );
};
