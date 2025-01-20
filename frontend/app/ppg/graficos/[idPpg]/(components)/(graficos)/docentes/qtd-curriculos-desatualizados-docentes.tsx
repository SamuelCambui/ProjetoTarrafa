import { Column } from "@ant-design/plots";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CurriculosDesatualizados = ({dadosAtualizaoLattes}) => {
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
