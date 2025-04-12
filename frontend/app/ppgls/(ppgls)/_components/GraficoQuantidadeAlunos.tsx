import React, { useRef } from "react";
import { GraficoProps } from "../../_components/types";
import { Chart, Column } from "@ant-design/plots";
import { Grafico } from "../../_components/Grafico";
import { LoadingCard } from "../../_components/LoadingCard";

interface DataItem {
  semestre_letivo: string;
  sexo: string;
  quantidade: number;
}

// Função para transformar os dados agregados
const transformData = (data: DataItem[]): DataItem[] => {
  const transformedData: DataItem[] = [];

  // Agrupar os dados por semestre e sexo, somando as quantidades
  data.forEach((item: any) => {
    const existingItem = transformedData.find(
      (d) => d.semestre_letivo === item.semestre_letivo && d.sexo === item.sexo
    );
    if (existingItem) {
      existingItem.quantidade += item.quantidade;
    } else {
      transformedData.push({ ...item });
    }
  });

  return transformedData;
};

export const GraficoQuantidadeAlunos = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  // Transformando os dados antes de usá-los
  const transformedData = transformData(data);

  console.log("----------------------Dados de GraficoQuantidadeAlunos---------------------");
  console.log(transformedData);

  const ref = useRef<Chart>(null);

  const config = {
    data: transformedData, // Usando os dados transformados
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
                  <div key={`${item.data.semestre_letivo}-${name}`}>
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
      titulo="Quantidade de Alunos"
      descricao="Alunos matriculados por semestre e sexo"
      chartRef={ref}
    >
      <Column {...config} ref={ref} />
    </Grafico>
  );
};
