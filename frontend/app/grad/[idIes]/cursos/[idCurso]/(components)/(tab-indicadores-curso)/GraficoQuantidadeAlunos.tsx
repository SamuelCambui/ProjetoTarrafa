import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Column } from "@ant-design/plots";
import { LoadingCard } from "../../../../../(components)/LoadingCard";
import { GraficoProps } from "@/app/grad/(components)/types";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantidade de Alunos</CardTitle>
        <CardDescription>
          Alunos que possuem pelo menos uma disciplina matriculada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
