import { Skeleton } from "@/components/ui/skeleton";
import { Column } from "@ant-design/plots";
import { GraficoProps } from "@/app/grad/(components)/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const GraficoQuantidadeProvaFinal = ({
  data,
  isLoading,
}: GraficoProps) => {
  if (!data || isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  const config = {
    data: data?.map(({ quantidade, ano_letivo, semestre }: any) => {
      return {
        semestreLetivo: ano_letivo + "/" + semestre,
        quantidade: quantidade,
      };
    }),
    xField: "semestreLetivo",
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provas Finais</CardTitle>
        <CardDescription>
          Quantidade de provas finais realizadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
