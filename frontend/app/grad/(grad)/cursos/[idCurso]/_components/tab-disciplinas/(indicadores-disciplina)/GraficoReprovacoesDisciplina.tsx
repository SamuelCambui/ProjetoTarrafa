import { Skeleton } from "@/components/ui/skeleton";
import { Column } from "@ant-design/plots";
import { GraficoProps } from "@/app/grad/_components/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const GraficoReprovacoesDisciplina = ({
  data,
  isLoading,
}: GraficoProps) => {
  if (!data || isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  const config = {
    data: data?.flatMap(
      ({ ano_letivo, semestre, taxa_aprovacao, taxa_reprovacao }: any) => [
        {
          anoLetivo: ano_letivo + "/" + semestre,
          tipo: "Taxa de Aprovação",
          value: taxa_aprovacao,
        },
        {
          anoLetivo: ano_letivo + "/" + semestre,
          tipo: "Taxa de Reprovação",
          value: taxa_reprovacao,
        },
      ]
    ),
    xField: "anoLetivo",
    yField: "value",
    colorField: "tipo",
    normalized: true,
    scale: {
      y: {
        domain: [0, 100],
      },
    },
    stack: true,
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
                        <span className="mr-6">{name}</span>
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
        <CardTitle>Taxa de Aprovação x Reprovação</CardTitle>
        <CardDescription>
          Índice de aprovação na disciplina ao longo do tempo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
