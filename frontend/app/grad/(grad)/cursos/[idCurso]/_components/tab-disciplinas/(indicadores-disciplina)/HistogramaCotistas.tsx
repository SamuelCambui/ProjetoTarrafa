import { GraficoProps } from "@/app/grad/_components/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LoadingCard } from "@/app/grad/_components/LoadingCard";
import { Column } from "@ant-design/plots";

export const HistogramaCotistas = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  const config = {
    data: data?.flatMap((data: any) => [
      {
        cota: data.cota ? "Cotista" : "Ampla Concorrência",
        intervalo: "0 até 50",
        value: data["[0_50)"],
      },
      {
        cota: data.cota ? "Cotista" : "Ampla Concorrência",
        intervalo: "50 até 70",
        value: data["[50_70)"],
      },
      {
        cota: data.cota ? "Cotista" : "Ampla Concorrência",
        intervalo: "70 até 80",
        value: data["[70_80)"],
      },
      {
        cota: data.cota ? "Cotista" : "Ampla Concorrência",
        intervalo: "80 até 90",
        value: data["[80_90)"],
      },
      {
        cota: data.cota ? "Cotista" : "Ampla Concorrência",
        intervalo: "90 até 100",
        value: data["[90_100]"],
      },
    ]),
    xField: "intervalo",
    yField: "value",
    colorField: "cota",
    seriesField: "cota",
    annotations: [
      {
        type: "rangeX",
        data: [
          {
            intervalo: ["50 até 70", "50 até 70"],
            event: "Dependência",
          },
        ],
        xField: "intervalo",
        yField: "value",
        scale: { color: { independent: true, range: ["#FAAD14", "#30BF78"] } },
        style: { fillOpacity: 0.1 },
      },
    ],
    interaction: {
      tooltip: {
        render: (_: any, { title, items }: any) => {
          return (
            <div key={title}>
              <h4 className="mb-2">{title}</h4>
              {items.map((item: any) => {
                const { name, value, color } = item;
                return (
                  <div>
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
        <CardTitle>Cotistas x Ampla Concorrência (Histograma)</CardTitle>
        <CardDescription>
          Comparação de desempenho entre alunos cotistas e não cotistas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
