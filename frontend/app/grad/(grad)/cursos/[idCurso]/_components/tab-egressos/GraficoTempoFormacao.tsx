import { GraficoProps } from "@/app/grad/_components/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Column } from "@ant-design/plots";
import { LoadingCard } from "@/app/grad/_components/LoadingCard";

export const GraficoTempoFormacao = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  const config = {
    data,
    xField: "tempo_formacao",
    yField: "quantidade",
    axis: {
      x: {
        title: "Tempo de Formação (Em Períodos)",
      },
    },
    interaction: {
      tooltip: {
        render: (e: any, { title, items }: any) => {
          return (
            <div key={title}>
              <h4 className="mb-2">{title} Períodos</h4>
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tempo de Formação</CardTitle>
        <CardDescription>
          Tempo de Formação x Quantidade de Alunos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
