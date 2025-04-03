import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Box } from "@ant-design/plots";
import { LoadingCard } from "../../../../../../_components/LoadingCard";
import { GraficoProps } from "@/app/grad/_components/types";
import { Frown } from "lucide-react";

export const BoxplotProvaFinal = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }
  const config = {
    data: {
      value: data?.map(
        ({
          primeiro_quartil,
          segundo_quartil,
          terceiro_quartil,
          limite_superior,
          limite_inferior,
          media,
          desvio_padrao,
        }: any) => {
          return {
            y: [
              limite_inferior,
              primeiro_quartil,
              segundo_quartil,
              terceiro_quartil,
              limite_superior,
              media,
              desvio_padrao,
            ],
          };
        }
      ),
    },
    yField: "y",
    scale: { x: { paddingInner: 0.6, paddingOuter: 0.3 } },
    annotations: [
      {
        type: "lineY",
        yField: 70,
        style: {
          stroke: "#222222",
          strokeOpacity: 0.4,
          lineWidth: 1,
          lineDash: [4, 4],
        },
      },
    ],
    tooltip: {
      items: [
        { name: "Limite Inferior", channel: "y" },
        { name: "1º Quartil", channel: "y1" },
        { name: "2º Quartil", channel: "y2" },
        { name: "3º Quartil", channel: "y3" },
        { name: "Limite Superior", channel: "y4" },
        { name: "Média", channel: "y5", color: "green" },
        { name: "Desvio Padrão", channel: "y6", color: "red" },
      ],
    },
    interaction: {
      tooltip: {
        render: (_: any, { title, items }: any) => {
          return (
            <div key={title}>
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
                        <span className="mr-6">{name}</span>
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
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho Prova Final</CardTitle>
        <CardDescription>Desempenho dos alunos na prova final.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="mx-auto flex justify-center text-lg items-center gap-2 text-muted-foreground h-48">
            <Frown className="mr-2 size-6" /> <span>Sem dados.</span>
          </div>
        ) : (
          <Box {...config} />
        )}
      </CardContent>
    </Card>
  );
};
