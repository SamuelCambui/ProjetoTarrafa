import { GraficoProps } from "@/app/ppgls/(components)/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LoadingCard } from "../../../../../../(components)/LoadingCard";
import { Column } from "@ant-design/plots";

export const HistogramaNotas = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  const config = {
    data: data?.flatMap((data: any) => [
      {
        intervalo: "0 até 50",
        quantidade: data["[0_50)"],
      },
      {
        intervalo: "50 até 70",
        quantidade: data["[50_70)"],
      },
      {
        intervalo: "70 até 80",
        quantidade: data["[70_80)"],
      },
      {
        intervalo: "80 até 90",
        quantidade: data["[80_90)"],
      },
      {
        intervalo: "90 até 100",
        quantidade: data["[90_100]"],
      },
    ]),
    xField: "intervalo",
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
                  <div key={value + name}>
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
        <CardTitle>Desempenho (Histograma)</CardTitle>
        <CardDescription>Distribuição de notas na disciplina.</CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
