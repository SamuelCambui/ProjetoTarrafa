import { Column } from "@ant-design/plots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const TempoDefesa = ({dadosTempoDefesa}) => {

  const config = {
    data: dadosTempoDefesa,
    xField: "meses",
    legend: true,
    colorField: "nivel",
    group: true,
    style: {
      inset: 5,
    },
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
