import { Column } from "@ant-design/plots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const TempoDefesa = () => {
  const config = {
    data: {
      type: "fetch",
      value:
        "https://gw.alipayobjects.com/os/antfincdn/iPY8JFnxdb/dodge-padding.json",
    },
    xField: "月份",
    legend: true,
    yField: "月均降雨量",
    colorField: "name",
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
