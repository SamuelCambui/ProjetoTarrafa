import { Column } from "@ant-design/plots";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "@ant-design/plots";

export const DiscentesTitulados = ({dadosDiscentesTitulados}: {dadosDiscentesTitulados: any}) => {

  const config = {
    data: dadosDiscentesTitulados,
    xField: "ano",
    yField: "count",
    colorField: "nivel",
    children: [
      {
        type: 'area',
        yField: 'count',    
        shapeField: 'smooth',
      }
    ],
    scale: { color: { range: ['#30BF78', '#F4664A', '#FAAD14'] } },
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle> Quantidade de Discentes Titulados </CardTitle>
      </CardHeader>
      <CardContent>
        <Line {...config} />
      </CardContent>
    </Card>
  );
};
