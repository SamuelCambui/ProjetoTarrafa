import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Column } from "@ant-design/plots";
  import { LoadingCard } from "../../../../../_components/LoadingCard";
  import { GraficoProps } from "@/app/ppgls/_components/types";
  

  export const GraficoQuantidaderegressos = ({
    data,
    isLoading,
  }: GraficoProps) => {
    if (!data || isLoading) {
      return <LoadingCard />;
    }
    console.log("Dados recebidos:", data);
    const config = {
      data: Array.isArray(data) 
      ? data.map(({ ano_matricula, quantidade_matriculas, nome_curso_graduacao }: any) => ({
          anoMatricula: String(ano_matricula),
          quantidade: quantidade_matriculas,
          curso: nome_curso_graduacao,
        }))
      : [],

      xField: "anoMatricula",
      yField: "quantidade",
      seriesField: "curso", // Cada barra será dividida pelos valores únicos de 'curso'
      isStack: false, // Habilita o empilhamento
      tooltip: false,
      
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
  