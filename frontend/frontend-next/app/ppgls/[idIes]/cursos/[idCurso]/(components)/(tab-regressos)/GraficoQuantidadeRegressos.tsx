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
    console.log("Dados recebidos:", data);
    const config = {
      data: data?.map(({ ano_matricula, quantidade_matriculas, nome_curso_graduacao }: any) => ({
        anoMatricula: String(ano_matricula), // Converter número para string
        quantidade: quantidade_matriculas, // Eixo Y
        curso: nome_curso_graduacao, // Nome correto do curso
      })),
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
                const { name, color, data } = item;
                const valor = data ? data.quantidade : "N/A"; // Ajuste aqui para pegar o valor correto
                
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
                      <span>{valor}</span> {/* Exibe o valor absoluto */}
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
          <CardTitle>Regressos</CardTitle>
          <CardDescription>
            Quantidade de alunos que cursaram ou não um curso de graduação da Unimontes antes de ingressarem neste curso, agrupados por ano de matrícula na pós-graduação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Column {...config} />
        </CardContent>
      </Card>
    );
  };
  