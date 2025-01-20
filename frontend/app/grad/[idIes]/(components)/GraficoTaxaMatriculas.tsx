import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Line } from "@ant-design/plots";
import { LoadingCard } from "../../(components)/LoadingCard";
import { GraficoProps } from "../../(components)/types";
import { Grafico } from "../../(components)/Grafico";

export const GraficoTaxaMatriculas = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  const config = {
    data,
    xField: "semestre_letivo",
    yField: "quantidade",
    colorField: "sexo",
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
    legend: false,
    style: {
      lineWidth: 2,
    },
    scale: {
      color: {
        domain: ["Feminino", "Masculino"],
        range: ["#EB3A76", "#1890FF"],
      },
    },
  };

  return (
    <Grafico
      titulo="Taxa de Matrículas"
      descricao="Quantidade de alunos que ingressaram na universidade por sexo."
    >
      <Line {...config} />
    </Grafico>
  );
};
