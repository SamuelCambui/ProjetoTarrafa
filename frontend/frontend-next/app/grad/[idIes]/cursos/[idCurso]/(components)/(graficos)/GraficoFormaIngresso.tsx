import { Pie } from "@ant-design/plots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface GraficoFormaIngressoProps {
  data?: any;
}

export const GraficoFormaIngresso = ({ data }: GraficoFormaIngressoProps) => {
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
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Forma de Ingresso</CardTitle>
          <CardDescription>
            Porcentagem de ingressantes por cada modalidade de ingresso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Pie {...config} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Forma de Ingresso</CardTitle>
          <CardDescription>
            Porcentagem de ingressantes por cada modalidade de ingresso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Pie {...config} />
        </CardContent>
      </Card>
    </div>
  );
};
