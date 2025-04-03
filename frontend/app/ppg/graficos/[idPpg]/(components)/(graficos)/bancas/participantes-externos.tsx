import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TipoParticipacao } from "@/lib/ppg/definitions";
import { Column } from "@ant-design/plots";

export const PPGsPaticipantesExternos = ({
  tipoParticipacao} : { tipoParticipacao : TipoParticipacao},
) => {
  const formatarDados = (dados: Object) => {
    return Object.entries(dados).map(([categoria, quantidade]) => {
      if (categoria === "Nenhum") {
        return {
          tipo: "Não",
          quantidade,
          categoria
        };
      }
  
      return {
        tipo: "Sim",
        quantidade,
        categoria 
      };
    });
  };
  
  const config = {
    data: formatarDados(tipoParticipacao),
    xField: "tipo",
    yField: "quantidade",
    colorField: "categoria",
    stacked: true,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participantes Externos - Participam de um PPG?</CardTitle>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
