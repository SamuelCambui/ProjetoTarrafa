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
      seriesField: "curso",
      isStack: false,
      tooltip: false,
      
      // A configuração de legend para o lado direito
      legend: {
        position: "bottom",  // Posiciona a legenda à direita do gráfico
      },

      responsive: true,
    
      // Outras configurações do gráfico
      colorField: "curso",
      columnStyle: {
        borderRadius: [4, 4, 0, 0],  // Arredondar as bordas do gráfico
      },
    
      // Configuração dos labels (valores em cima das barras)
      label: {
        position: "top",
        offsetY: -10,  // Ajuste para cima
        style: {
          fill: "#000",  // Cor da fonte
          fontSize: 12,
          fontWeight: "bold",
          textBaseline: "bottom",  // Posicionamento do texto em relação à barra
        },
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
  