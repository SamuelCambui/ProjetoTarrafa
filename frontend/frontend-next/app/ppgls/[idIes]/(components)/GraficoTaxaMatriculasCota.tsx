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
  
  export const GraficoTaxaMatriculasCota = ({
    data,
    isLoading,
  }: GraficoProps) => {
    if (!data || isLoading) {
      return <LoadingCard />;
    }
  
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
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Matrículas por Cota</CardTitle>
          <CardDescription>
            Quantidade de alunos que ingressaram na universidade por cota e ampla
            concorrência.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Line {...config} />
        </CardContent>
      </Card>
    );
  };
  