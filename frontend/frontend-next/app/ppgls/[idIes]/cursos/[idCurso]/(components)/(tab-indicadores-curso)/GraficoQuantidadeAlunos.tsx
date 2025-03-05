import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chart, Column } from "@ant-design/plots";
import { LoadingCard } from "@/app/ppgls/(components)/LoadingCard";
import { GraficoProps } from "@/app/ppgls/(components)/types";
import { useRef } from "react";
import { Grafico } from "@/app/ppgls/(components)/Grafico";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";



export const GraficoQuantidadeAlunos = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }
  const transformedData = data.map(({ ano_letivo, semestre, ...resto }: any) => ({
    ...resto,
    semestre_letivo: `${ano_letivo}.${semestre}`,
  }));
  const ref = useRef<Chart>(null);
  const config = {
    data: transformedData,
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
                      <b>{value} Alunos</b>
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
      <Column {...config} ref={ref} />
    </Grafico>
  );
};
