import { Skeleton } from "@/components/ui/skeleton";
import { Column } from "@ant-design/plots";
import { GraficoProps } from "@/app/grad/(components)/types";

export const GraficoReprovacoesGrade = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <Skeleton className="h-full w-full" />;
  }
  const map = new Map();

  data.forEach(({ nome, abreviacao, media, desvio_padrao }: any) =>
    map.set(abreviacao, { nome, media, desvio_padrao }),
  );

  const config = {
    data: data.flatMap(
      ({ nome, abreviacao, taxa_aprovacao, taxa_reprovacao }: any) => [
        {
          nome: nome,
          abreviacao: abreviacao,
          tipo: "Taxa de Aprovação",
          value: taxa_aprovacao,
        },
        {
          nome: nome,
          abreviacao: abreviacao,
          tipo: "Taxa de Reprovação",
          value: taxa_reprovacao,
        },
      ],
    ),
    xField: "abreviacao",
    yField: "value",
    colorField: "tipo",
    normalized: true,
    stack: true,
    interaction: {
      tooltip: {
        render: (_: any, { title, items }: any) => {
          return (
            <div key={title}>
              <h4 className="mb-2">{map.get(title).nome}</h4>
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

  return <Column {...config} />;
};
