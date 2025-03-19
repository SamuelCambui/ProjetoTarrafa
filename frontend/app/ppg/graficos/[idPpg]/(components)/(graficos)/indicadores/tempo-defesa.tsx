import { Column } from "@ant-design/plots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const TempoDefesa = ({ dadosTempoDefesa }) => {
  
  const dadosAgregados = dadosTempoDefesa.reduce((acc, curr) => {
    const key = `${curr.meses}-${curr.nivel}`;
    if (!acc[key]) {
      acc[key] = { meses: curr.meses, nivel: curr.nivel, quantidade: 0 };
    }
    acc[key].quantidade += 1;
    return acc;
  }, {});

  const data = Object.values(dadosAgregados);
  
  const config = {
    data,
    xField: "meses",
    yField: "quantidade", 
    sort: {
      by: "x",
    },
    groupBy: "meses",
    group: true,
    colorField: 'nivel',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Tempo de Defesa </CardTitle>
        <CardDescription>Dado em meses</CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card>
  );
};
