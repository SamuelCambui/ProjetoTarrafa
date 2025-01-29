import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Column } from "@ant-design/plots";
  import { LoadingCard } from "../../../../../(components)/LoadingCard";
  import { GraficoProps } from "@/app/ppgls/(components)/types";
  
  export const GraficoQuantidaderegressos = ({
    data,
    isLoading,
  }: GraficoProps) => {
    if (!data || isLoading) {
      return <LoadingCard />;
    }
  
    const config = {
      data: data?.map(({ ano_matricula, quantidade_matriculas, curso }: any) => {
        return {
          anoMatricula: ano_matricula, // Eixo X
          quantidade: quantidade_matriculas, // Eixo Y
          curso: curso, // Série que será empilhada
        };
      }),
      xField: "anoMatricula",
      yField: "quantidade",
      seriesField: "curso", // Cada barra será dividida pelos valores únicos de 'curso'
      isStack: true, // Habilita o empilhamento
      tooltip: {
        customContent: (title: string, items: any[]) => {
          return (
            <div key={title}>
              <h4 className="mb-2">{title}</h4>
              {items.map((item) => {
                const { name, value, color } = item;
                return (
                  <div key={name}>
                    <div className="m-0 flex justify-between">
                      <div>
                        <span
                          className="mr-1 inline-block h-2 w-2 rounded"
                          style={{ backgroundColor: color }}
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
      legend: {
        position: "top", // Coloca a legenda no topo
      },
      colorField: "curso", // Garante que cada curso tenha uma cor única
      columnStyle: {
        borderRadius: [4, 4, 0, 0], // Borda arredondada no topo das colunas
      },
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Barras Empilhadas</CardTitle>
          <CardDescription>
            Quantidade de matrículas por ano e curso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Column {...config} />
        </CardContent>
      </Card>
    );
  };
  