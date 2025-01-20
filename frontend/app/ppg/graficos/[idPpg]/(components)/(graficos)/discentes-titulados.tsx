import { Column } from "@ant-design/plots";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DiscentesTitulados = ({dadosDiscentesTitulados}) => {
  const config = {
    data: dadosDiscentesTitulados,
    xField: "ano",
    yField: "count",
    colorField: "nivel",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Quantidade de Docentes Titulados </CardTitle>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
