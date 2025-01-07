import { Column } from "@ant-design/plots";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ProdVinculadosTCCs = ({ produtos }) => {

  const formatarDados = (dados: Object) => {
    return Object.entries(dados).flatMap(([ano, produtos]) =>
      Object.entries(produtos)
        .filter(([produto]) => produto !== "BIBLIOGRÁFICA" && produto !== "total")
        .map(([produto, quantidade]) => ({
          ano,
          produto,
          quantidade
        }))
    );
  };
  
  const config = {
    data: formatarDados(produtos),
    xField: "ano",
    yField: "quantidade",
    colorField: "produto",
    group: true,
    label: {
      text: (d: { quantidade: number; }) => `${d.quantidade}`,
      textBaseline: 'bottom',
    },
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
