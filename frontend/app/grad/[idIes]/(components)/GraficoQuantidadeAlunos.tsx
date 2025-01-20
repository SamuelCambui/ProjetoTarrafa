import React from "react";
import { GraficoProps } from "../../(components)/types";
import { Column } from "@ant-design/plots";
import { Grafico } from "../../(components)/Grafico";
import { LoadingCard } from "../../(components)/LoadingCard";

export const GraficoQuantidadeAlunos = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }
  const config = {
    data,
    xField: "semestre_letivo",
    yField: "quantidade",
    colorField: "sexo",
    stack: true,
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
      }, // 圆角
    },
  };
  return (
    <Grafico
      titulo="Quantidade de Alunos"
      descricao="Alunos que estão matriculados em pelo menos uma disciplina."
    >
      <Column {...config} />
    </Grafico>
  );
};
