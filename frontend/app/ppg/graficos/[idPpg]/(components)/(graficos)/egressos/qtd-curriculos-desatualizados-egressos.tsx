import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TempoAtualizacaoLattesEgressos } from "@/lib/ppg/definitions";
import { Column } from "@ant-design/plots";

export const CurriculosDesatualizadosEgressos = ({
  tempoAtualizacaoEgressos,
}: {
  tempoAtualizacaoEgressos: TempoAtualizacaoLattesEgressos[];
}) => {
  const data = tempoAtualizacaoEgressos || [];

  const config = {
    data,
    xField: "legenda",
    yField: "quantidade",
    colorField: "legenda",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Tempo de atualização dos currículos Lattes dos egressos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
