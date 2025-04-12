import { Grafico } from "@/app/grad/_components/Grafico";
import { LoadingCard } from "@/app/grad/_components/LoadingCard";
import { SemDados } from "@/app/grad/_components/SemDados";
import { GraficoProps } from "@/app/grad/_components/types";
import { Chart, Column } from "@ant-design/plots";
import { useRef } from "react";

export const GraficoQuantidadeAlunos = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  const ref = useRef<Chart>(null);
  const config = {
    data,
    xField: "semestre_letivo",
    yField: "quantidade",
    colorField: "sexo",
    stack: true,
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
                              name === "F" ? "#EB3A76" : "#1890FF",
                          }}
                        ></span>
                        <span className="mr-6 capitalize">{name}</span>
                      </div>
                      <span>{value} Alunos</span>
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
      fill: ({ sexo }: any) => {
        if (sexo === "M") {
          return "#1890FF";
        }
        return "#EB3A76";
      },
    },
  };

  function handleClick() {
    if (ref.current && ref.current.downloadImage) {
      ref.current.downloadImage("quantidade_alunos", "image/jpg");
    }
  }
  return (
    <Grafico
      titulo="Quantidade de Alunos"
      descricao="Alunos que possuem pelo menos uma disciplina matriculada."
    >
      {data.length === 0 ? <SemDados /> : <Column {...config} ref={ref} />}
    </Grafico>
  );
};
