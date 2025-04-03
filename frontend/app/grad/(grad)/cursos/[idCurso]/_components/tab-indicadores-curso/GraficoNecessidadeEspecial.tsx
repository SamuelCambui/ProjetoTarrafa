import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pie } from "@ant-design/plots";
import { GraficoProps } from "@/app/grad/_components/types";
import { LoadingCard } from "../../../../../_components/LoadingCard";
import { SemDados } from "@/app/grad/_components/SemDados";

export const GraficoNecessidadeEspecial = ({
  data,
  isLoading,
}: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }
  const config = {
    data: data,
    angleField: "quantidade",
    colorField: "neceespecial",
    label: false,
    tooltip: {
      title: {
        field: "neceespecial",
      },
    },
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
        <CardTitle>Necessidade Especial</CardTitle>
        <CardDescription>
          Porcentagem de alunos com necessidade especial.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? <SemDados /> : <Pie {...config} />}
      </CardContent>
    </Card>
  );
};
