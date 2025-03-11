import { Skeleton } from "@/components/ui/skeleton";
import { Column } from "@ant-design/plots";
import { GraficoProps } from "@/app/ppgls/_components/types";

export const GraficoReprovacoesGrade = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  const map = new Map();

  // Criamos um mapa onde a chave é a abreviatura e o valor contém nome e estatísticas
  data.forEach(({ nome, abreviacao, media, desvio_padrao }: any) =>
    map.set(abreviacao, { nome, media, desvio_padrao })
  );

  const config = {
    data: data.flatMap(
      ({ nome, abreviacao, taxa_aprovacao, taxa_reprovacao }: any) => [
        {
          chave: `${nome}-(${abreviacao})`, // Combina abreviacao e nome para uma chave única
          nome, // Adiciona o nome completo
          tipo: "Taxa de Aprovação",
          value: taxa_aprovacao,
        },
        {
          chave: `${nome}-(${abreviacao})`, // Combina abreviacao e nome para uma chave única
          nome, // Adiciona o nome completo
          tipo: "Taxa de Reprovação",
          value: taxa_reprovacao,
        },
      ]
    ),
    xField: "chave", // Usar a chave combinada como valor do eixo X
    yField: "value",
    colorField: "tipo",
    normalized: true,
    stack: true,
    height: 800, // Defina um valor maior para aumentar a altura do gráfico
    interaction: {
      tooltip: {
        render: (_: any, { title, items }: any) => {
          const dadosDisciplina = map.get(title.split('-')[0]); // Pega os dados da disciplina pela abreviação
          return (
            <div key={title}>
              <h4 className="mb-2">{dadosDisciplina?.nome || title}</h4> {/* Exibe nome completo */}
              {items.map((item: any) => {
                const { name, value, color } = item;
                return (
                  <div key={name}>
                    <div className="m-0 flex justify-between">
                      <div>
                        <span
                          className="mr-1 inline-block h-2 w-2 rounded"
                          style={{ backgroundColor: color }}
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
