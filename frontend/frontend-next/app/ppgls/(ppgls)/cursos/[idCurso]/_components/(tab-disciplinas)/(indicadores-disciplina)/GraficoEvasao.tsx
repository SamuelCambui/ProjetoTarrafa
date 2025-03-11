import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Column } from "@ant-design/plots";
  import { LoadingCard } from "../../../../../../_components/LoadingCard";
  import { GraficoProps } from "@/app/ppgls/_components/types";
  
  export const GraficoEvasao = ({ data, isLoading }: GraficoProps) => {
    if (!data || isLoading) {
      return <LoadingCard />;
    }
  
    const config = {
      data: data?.flatMap(({ ano_letivo, semestre, evasao, nao_evasao }: any) => [
        {
          semestreLetivo: ano_letivo + "/" + semestre,
          tipo: "Evadidos",
          quantidade: evasao,
        },
        {
          semestreLetivo: ano_letivo + "/" + semestre,
          tipo: "Concluintes",
          quantidade: nao_evasao,
        },
      ]),
      xField: "semestreLetivo",
      yField: "quantidade",
      colorField: "tipo",
      stack: true,
      normalized: true,
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
                        <span>{value} %</span>
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
          <CardTitle>Taxa de Evasão</CardTitle>
          <CardDescription>
            Porcentagem de alunos que concluíram e os que não concluíram a
            disciplina.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Column {...config} />
        </CardContent>
      </Card>
    );
  };
  