import { Column } from "@ant-design/plots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export const QuantidadeProdutosTCCs = () => {
  const config = {
    data: {
      type: "fetch",
      value:
        "https://gw.alipayobjects.com/os/antfincdn/iPY8JFnxdb/dodge-padding.json",
    },
    xField: "月份",
    label: {
      text: `praia`,
      textBaseline: 'bottom',
    },
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
        <CardTitle> Quantidade de Produtos por TCC </CardTitle>
        <CardDescription>
        Quantidade de TCCs geradores dos produtos em cada ano. Comparado com médias dos PPGs de mesma nota
         </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card> 
  );
};
