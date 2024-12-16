import { Column } from "@ant-design/plots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export const QuantidadeLivrosTCCs = () => {
  const config = {
    data: {
      type: 'fetch',
      value: 'https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/column-column.json',
    },
    xField: 'letter',
    yField: 'frequency',
    label: {
      text: (d: { frequency: number; }) => `${(d.frequency * 100).toFixed(1)}%`,
      textBaseline: 'bottom',
    },
    axis: {
      y: {
        labelFormatter: '.0%',
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>  Quantidade de Livros por TCC  </CardTitle>
        <CardDescription>
          Quantidade de TCCs geradores de livros e capítulos de livros em cada ano
         </CardDescription>
      </CardHeader>
      <CardContent>
        <Column {...config} />
      </CardContent>
    </Card> 
  );
};
