import { Column } from "@ant-design/plots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ProdVinculadosTCCs = () => {
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
        <CardTitle>Produtos vinculados aos TCCs</CardTitle>
        <CardDescription>
        Este gráfico apresenta quantidade de produtos do PPG vinculados aos TCCs defendidos         </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card> 
  );
};
