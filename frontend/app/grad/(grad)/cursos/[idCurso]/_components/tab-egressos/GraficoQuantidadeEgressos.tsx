import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Column } from "@ant-design/plots";
import { LoadingCard } from "../../../../../_components/LoadingCard";
import { GraficoProps } from "@/app/grad/_components/types";
import { SemDados } from "@/app/grad/_components/SemDados";

export const GraficoQuantidadeEgressos = ({
  data,
  isLoading,
}: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  const config = {
    data: data?.map(({ egressos, ano_letivo, semestre }: any) => {
      return {
        semestreLetivo: ano_letivo + "/" + semestre,
        egressos: egressos,
      };
    }),
    xField: "semestreLetivo",
    yField: "egressos",
    interaction: {
      tooltip: {
        render: (e: any, { title, items }: any) => {
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
        <CardTitle>Egressos</CardTitle>
        <CardDescription>Quantidade de egressos.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? <SemDados /> : <Column {...config} />}
      </CardContent>
    </Card>
  );
};
