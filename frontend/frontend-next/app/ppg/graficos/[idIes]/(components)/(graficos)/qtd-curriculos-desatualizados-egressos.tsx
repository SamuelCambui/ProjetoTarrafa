import { Column } from "@ant-design/plots";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CurriculosDesatualizadosEgressos = () => {
  const config = {
    data: {
      type: "fetch",
      value:
        "https://gw.alipayobjects.com/os/antfincdn/iPY8JFnxdb/dodge-padding.json",
    },
    xField: "月份",
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
        <CardTitle> Quantidade de currículos Lattes desatualizados </CardTitle>
      </CardHeader>
      <CardContent>
        <Column {...config} />;
      </CardContent>
    </Card>
  );
};
