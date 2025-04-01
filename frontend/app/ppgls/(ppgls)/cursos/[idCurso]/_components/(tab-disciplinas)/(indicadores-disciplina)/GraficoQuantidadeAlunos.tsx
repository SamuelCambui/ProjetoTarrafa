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
  import { SemDados } from "@/app/ppgls/_components/SemDados";
  
  export const GraficoQuantidadeAlunos = ({ data, isLoading }: GraficoProps) => {
    if (!data || isLoading) {
      return <LoadingCard />;
    }
    const config = {
      data: data?.map(({ ano_letivo, semestre, quantidade }: any) => {
        return {
          semestre_letivo: ano_letivo + "/" + semestre,
          quantidade: quantidade,
        };
      }),
      xField: "semestre_letivo",
      yField: "quantidade",
      interaction: {
        tooltip: {
          render: (_: any, { title, items }: any) => {
            return (
              <div key={title}>
                <h4 className="mb-2">{title}</h4>
                {items.map((item: any) => {
                  const { name, value, color } = item;
                  return (
                    <div>
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
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quantidade de Alunos</CardTitle>
          <CardDescription>Alunos matriculados na disciplina.</CardDescription>
        </CardHeader>
        <CardContent>
        {data.length === 0 ? <SemDados /> : <Column {...config} />}
        </CardContent>
      </Card>
    );
  };
  