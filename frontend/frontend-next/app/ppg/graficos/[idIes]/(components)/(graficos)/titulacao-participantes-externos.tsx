import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pie } from "@ant-design/plots";

export const TitulacaoPaticipantesExternos = () => {
  const config = {
    data: [
      { type: "分类一", value: 27 },
      { type: "分类二", value: 25 },
      { type: "分类三", value: 18 },
      { type: "分类四", value: 15 },
      { type: "分类五", value: 10 },
      { type: "其他", value: 5 },
    ],
    angleField: "value",
    colorField: "type",
    label: {
      text: "value",
      position: "outside",
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Titulação dos participantes externos </CardTitle>
        <CardDescription>
          Este gráfico apresenta quantidade de produtos do PPG vinculados aos
          TCCs defendidos{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Pie {...config} />
        <Pie {...config} />
        <Pie {...config} />
        <Pie {...config} />
      </CardContent>
    </Card>
  );
};
