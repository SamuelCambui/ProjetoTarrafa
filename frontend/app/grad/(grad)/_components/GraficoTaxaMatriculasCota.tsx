import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chart, Line } from "@ant-design/plots";
import { LoadingCard } from "../../_components/LoadingCard";
import { GraficoProps } from "../../_components/types";
import { Grafico } from "../../_components/Grafico";
import { useRef } from "react";

export const GraficoTaxaMatriculasCota = ({
  data,
  isLoading,
}: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  const chartRef = useRef<Chart>(null);

  const config = {
    data: data?.map(({ cota, semestre_letivo, quantidade }) => {
      return {
        tipo: cota ? "Cotista" : "Ampla Concorrência",
        semestreLetivo: semestre_letivo,
        quantidade: quantidade,
      };
    }),
    xField: "semestreLetivo",
    yField: "quantidade",
    colorField: "tipo",
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
    legend: false,
    style: {
      lineWidth: 2,
    },
  };

  return (
    <Grafico
      titulo="Taxa de Matrículas por Cota"
      descricao="Quantidade de alunos que ingressaram na universidade por cota e ampla
          concorrência."
      chartRef={chartRef}
    >
      <Line {...config} ref={chartRef} />
    </Grafico>
  );
};
