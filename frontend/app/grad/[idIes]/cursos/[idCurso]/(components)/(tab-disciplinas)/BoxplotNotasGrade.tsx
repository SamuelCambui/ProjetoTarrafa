import { Skeleton } from "@/components/ui/skeleton";
import { Box } from "@ant-design/plots";
import { GraficoProps } from "@/app/grad/(components)/types";

export const BoxplotNotasGrade = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <Skeleton className="h-full w-full" />;
  }
  const map = new Map();

  data.forEach(({ nome, abreviacao, media, desvio_padrao }: any) =>
    map.set(abreviacao, { nome, media, desvio_padrao }),
  );

  const config = {
    data: {
      value: data.map(
        ({
          abreviacao,
          primeiro_quartil,
          segundo_quartil,
          terceiro_quartil,
          limite_superior,
          limite_inferior,
          media,
          desvio_padrao,
        }: any) => {
          return {
            x: abreviacao,
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
        { name: "Desvio Padrão", channel: "y6", color: "red" },
      ],
    },
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
  return <Box {...config} />;
};
