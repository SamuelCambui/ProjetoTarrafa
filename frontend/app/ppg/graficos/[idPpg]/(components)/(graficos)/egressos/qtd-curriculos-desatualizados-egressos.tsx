import { Column } from "@ant-design/plots";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EgressoData {
  legenda: string;
  quantidade: number;
}

interface CurriculosDesatualizadosEgressosProps {
  tempoAtualizacaoEgressos: EgressoData[];
}

export const CurriculosDesatualizadosEgressos = ({
  tempoAtualizacaoEgressos,
}: CurriculosDesatualizadosEgressosProps) => {
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
        <CardTitle>Tempo de atualização dos currículos Lattes dos egressos</CardTitle>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
