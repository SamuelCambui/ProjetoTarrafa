import React from "react";
import { GraficoProps } from "../../_components/types";
import { Column } from "@ant-design/plots";
import { Grafico } from "../../_components/Grafico";
import { LoadingCard } from "../../_components/LoadingCard";

export const GraficoEgressos = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }
  const config = {
    data: data?.map(({ ano_letivo, semestre, egressos, sexo }) => {
      return {
        sexo: sexo,
        semestreLetivo: ano_letivo + "/" + semestre,
        egressos: egressos,
      };
    }),
    xField: "semestreLetivo",
    yField: "egressos",
    colorField: "sexo",
    legend: false,
    interaction: {
      tooltip: {
        render: (_: any, { title, items }: any) => {
          return (
            <div key={title}>
              <h4 className="mb-2">{title}</h4>
              {items.map((item: any) => {
                const { name, value } = item;
                return (
                  <div key={name}>
                    <div className="m-0 flex justify-between">
                      <div>
                        <span
                          className="mr-1 inline-block h-2 w-2 rounded"
                          style={{
                            backgroundColor:
                              name === "Feminino" ? "#EB3A76" : "#1890FF",
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
    style: {
      fill: ({ sexo }: any) => {
        if (sexo === "Masculino") {
          return "#1890FF";
        }
        return "#EB3A76";
      },
    },
  };
  return (
    <Grafico
      titulo="Egressos"
      descricao="Quantidade de egressos da universidade."
    >
      <Column {...config} />
    </Grafico>
  );
};
