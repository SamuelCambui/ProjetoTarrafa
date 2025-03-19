import { Column } from "@ant-design/plots";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AtualizacaoLattes } from "@/lib/ppg/definitions";

export const CurriculosDesatualizados = ({dadosAtualizaoLattes} : {dadosAtualizaoLattes : AtualizacaoLattes[]}) => {
  const config = {
    data: dadosAtualizaoLattes,
    xField: "legenda",
    yField: "quantidade",
    colorField: "legenda",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Quantidade de currículos Lattes desatualizados </CardTitle>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
