import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Box } from "@ant-design/plots";
  import { LoadingCard } from "../../(components)/LoadingCard";
  import { GraficoProps } from "@/app/ppgls/(components)/types";
  
  export const GraficoBoxplotIdade = ({ data, isLoading }: GraficoProps) => {
    if (!data || isLoading) {
      return <LoadingCard />;
    }
    const config = {
      data: {
        value: data.map(
          ({
            ano_ingresso,
            primeiro_quartil,
            segundo_quartil,
            terceiro_quartil,
            limite_superior,
            limite_inferior,
            media,
          }: any) => {
            return {
              x: ano_ingresso,
              y: [
                limite_inferior,
                primeiro_quartil,
                segundo_quartil,
                terceiro_quartil,
                limite_superior,
                media,
              ],
            };
          },
        ),
      },
      xField: "x",
      yField: "y",
      scale: { x: { paddingInner: 0.6, paddingOuter: 0.3 } },
      tooltip: {
        items: [
          { name: "Limite Inferior", channel: "y" },
          { name: "1º Quartil", channel: "y1" },
          { name: "2º Quartil", channel: "y2" },
          { name: "3º Quartil", channel: "y3" },
          { name: "Limite Superior", channel: "y4" },
          { name: "Média", channel: "y5", color: "green" },
        ],
      },
    };
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Idade</CardTitle>
          <CardDescription>
            Distribuição de idade dos alunos por ano de ingresso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Box {...config} />
        </CardContent>
      </Card>
    );
  };
  